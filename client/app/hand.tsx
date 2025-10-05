import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

// HTML page loaded inside iframe/WebView. It's a compact script that loads
// MediaPipe Hands from CDN, runs the pipeline and posts JSON messages with
// detected landmarks back to the React layer.
const HTML: string = [
  "<!doctype html>",
  "<html>",
  '<head><meta name="viewport" content="width=device-width, initial-scale=1"></head>',
  "<style>html,body{margin:0;padding:0;height:100%;background:#000}video{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover}canvas{position:absolute;left:0;top:0;width:100%;height:100%}</style>",
  "<body>",
  '<video id="video" autoplay playsinline muted></video>',
  '<canvas id="canvas"></canvas>',
  '<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></' +
    "script>",
  "<script>",
  'const video=document.getElementById("video");',
  'const canvas=document.getElementById("canvas");',
  'const ctx=canvas.getContext("2d");',
  "async function start(){",
  " try{",
  '  const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});',
  "  video.srcObject=stream; await video.play(); canvas.width=video.videoWidth||640; canvas.height=video.videoHeight||480;",
  '  const hands=new Hands({locateFile:function(file){return "https://cdn.jsdelivr.net/npm/@mediapipe/hands/"+file;}});',
  "  hands.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:0.5,minTrackingConfidence:0.5});",
  '  hands.onResults(function(results){ ctx.save(); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.drawImage(video,0,0,canvas.width,canvas.height); if(results.multiHandLandmarks){ var out=[]; for(var i=0;i<results.multiHandLandmarks.length;i++){ var landmarks=results.multiHandLandmarks[i].map(function(lm){return [lm.x,lm.y,lm.z];}); out.push({landmarks:landmarks,handedness:(results.multiHandedness&&results.multiHandedness[i])?results.multiHandedness[i].label:null}); for(var j=0;j<results.multiHandLandmarks[i].length;j++){ var p=results.multiHandLandmarks[i][j]; ctx.beginPath(); ctx.arc(p.x*canvas.width,p.y*canvas.height,6,0,2*Math.PI); ctx.fillStyle="cyan"; ctx.fill(); } } var payload=JSON.stringify({hands:out}); if(window.ReactNativeWebView&&window.ReactNativeWebView.postMessage){ window.ReactNativeWebView.postMessage(payload); } else if(window.parent){ window.parent.postMessage(payload,"*"); } } ctx.restore(); });',
  "  var sendFrame=async function(){ await hands.send({image:video}); requestAnimationFrame(sendFrame); }; sendFrame();",
  ' } catch(e) { var payload=JSON.stringify({error:e.message||String(e)}); if(window.ReactNativeWebView&&window.ReactNativeWebView.postMessage){ window.ReactNativeWebView.postMessage(payload); } else if(window.parent){ window.parent.postMessage(payload, "*"); } }',
  "}",
  "start();",
  "</" + "script>",
  "</body>",
  "</html>",
].join("\n");

// Lazy require WebView only on native to avoid bundling it for web
let NativeWebView: any = null;
if (Platform.OS !== "web") {
  try {
    NativeWebView = require("react-native-webview").WebView;
  } catch (e) {
    NativeWebView = null;
  }
}

type Props = {
  cameraRef?: any;
};

export default function HandScreen({ cameraRef }: Props) {
  const [msg, setMsg] = useState<string | null>(null);
  const [hands, setHands] = useState<any[]>([]);

  // listen for messages from iframe (web)
  useEffect(() => {
    if (Platform.OS === "web") {
      const onMessage = (ev: MessageEvent) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.hands) setHands(data.hands);
          if (data.error) setMsg(data.error);
        } catch (e) {
          // ignore
        }
      };
      window.addEventListener("message", onMessage);
      return () => window.removeEventListener("message", onMessage);
    }
    return undefined;
  }, []);

  // If a cameraRef is provided (native mobile CameraView), capture frames and
  // run the server websocket or local processing. We'll capture periodic
  // pictures and send them to the embedded page via postMessage fallback.
  useEffect(() => {
    let interval: any = null;
    let ws: WebSocket | null = null;
    if (Platform.OS !== "web" && cameraRef && cameraRef.current) {
      // open optional websocket to server landmarks endpoint if you want server processing
      try {
        const url = "ws://10.0.2.2:8000/ws/landmarks/mobile-client";
        ws = new WebSocket(url);
        ws.onopen = () => console.log("landmarks ws open");
        ws.onmessage = (ev) => {
          try {
            const data = JSON.parse(ev.data);
            if (data.hands) setHands(data.hands);
          } catch (e) {}
        };
      } catch (e) {
        ws = null;
      }

      interval = setInterval(async () => {
        try {
          const cam = cameraRef.current;
          if (!cam || !cam.takePictureAsync) return;
          const photo = await cam.takePictureAsync({
            base64: true,
            quality: 0.4,
            skipProcessing: true,
          });
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({ image: `data:image/jpg;base64,${photo.base64}` })
            );
          }
        } catch (e) {
          // ignore
        }
      }, 250);
    }

    return () => {
      if (interval) clearInterval(interval);
      try {
        if (ws) ws.close();
      } catch (e) {}
    };
  }, [cameraRef]);

  if (Platform.OS === "web") {
    // render as iframe
    return (
      <View style={styles.container}>
        <iframe title="hands" srcDoc={HTML} style={styles.webview} />
        <View style={styles.overlay} pointerEvents="none">
          {hands.map((hand, hIdx) => (
            <View key={String(hIdx)}>
              {hand.landmarks.map((p: any, idx: number) => {
                const left = `${p[0] * 100}%` as any;
                const top = `${p[1] * 100}%` as any;
                return (
                  <View
                    key={`${hIdx}-${idx}`}
                    style={[styles.point, { left, top }]}
                  />
                );
              })}
            </View>
          ))}
          {msg ? <Text style={styles.error}>{msg}</Text> : null}
        </View>
      </View>
    );
  }

  // mobile: use WebView
  const WebViewComponent = NativeWebView;
  return (
    <View style={styles.container}>
      {WebViewComponent ? (
        <WebViewComponent
          originWhitelist={["*"]}
          source={{ html: HTML }}
          style={styles.webview}
          onMessage={(ev: any) => {
            try {
              const data = JSON.parse(ev.nativeEvent.data);
              if (data.hands) setHands(data.hands);
              if (data.error) setMsg(data.error);
            } catch (e) {}
          }}
        />
      ) : (
        <View style={styles.container}>
          <Text style={{ color: "white" }}>WebView not available</Text>
        </View>
      )}
      <View style={styles.overlay} pointerEvents="none">
        {hands.map((hand, hIdx) => (
          <View key={String(hIdx)}>
            {hand.landmarks.map((p: any, idx: number) => {
              const left = `${p[0] * 100}%` as any;
              const top = `${p[1] * 100}%` as any;
              return (
                <View
                  key={`${hIdx}-${idx}`}
                  style={[styles.point, { left, top }]}
                />
              );
            })}
          </View>
        ))}
        {msg ? <Text style={styles.error}>{msg}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  webview: { flex: 1, width: "100%", height: "100%" },
  overlay: { position: "absolute", left: 0, top: 0, right: 0, bottom: 0 },
  point: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "cyan",
    transform: [{ translateX: -5 }, { translateY: -5 }],
  },
  error: { color: "red", position: "absolute", bottom: 20, left: 20 },
});
