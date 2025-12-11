import { Button } from "@/components/Button";
import { LandmarksOverlay } from "@/components/LandmarksOverlay";
import api, { HttpError, NetworkError, type LstmFrame } from "@/lib/api";
import { useAppSettings } from "@/lib/app-settings";
import { useTheme } from "@/lib/theme";
import { useWordBuilder } from "@/lib/useWordBuilder";
import { useIsFocused } from "@react-navigation/native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CAPTURE_INTERVAL = 1000 / 5;
const CAPTURE_INTERVAL_ALPHABET = 1000;
const LSTM_WINDOW = 40;

const normalizeClasses = (input?: string[] | Record<string, number>) => {
  if (Array.isArray(input)) return input;
  if (!input) return [];
  const entries = Object.entries(input).filter(([, v]) => typeof v === "number");
  if (!entries.length) return Object.keys(input);
  return entries
    .sort((a, b) => (a[1] as number) - (b[1] as number))
    .map(([k]) => k);
};

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [landmarks, setLandmarks] = useState<{ x: number; y: number; z: number }[]>([]);

  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();
  const { colors, colorScheme } = useTheme();
  const { aiModel, alphabetModel, showLandmarksButton } = useAppSettings();
  const withAlpha = (hex: string, alpha: string = "D0") =>
    hex?.length === 7 ? `${hex}${alpha}` : hex;
  const cardTranslucent = withAlpha(colors.card, "B3");
  const buttonBg = withAlpha(colors.card, "B3");
  const lstmBufferRef = useRef<LstmFrame[]>([]);
  const lstmPredictingRef = useRef(false);

  // Word builder hook with optimized settings for sign language
  const { currentWord, letterBuffer, addLetter, clearWord, deleteLastLetter, commitBuffer } =
    useWordBuilder({
      dwellTime: 800, // Hold letter for 800ms before adding
      idleTimeout: 2500, // 2.5s of no detection creates word boundary
      repeatWindow: 1500, // 1.5s window to detect intentional repeats
    });

  // Request permission and load classes on mount / model change
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
      return;
    }

    let cancelled = false;
    setClasses([]);

    const loadClasses = async () => {
      try {
        if (aiModel === "LSTM") {
          const resp = await api.lstmClasses();
          if (!cancelled) setClasses(normalizeClasses(resp.classes));
        } else if (alphabetModel) {
          const resp = await api.classes(alphabetModel);
          if (!cancelled) setClasses(normalizeClasses(resp.classes));
        }
      } catch (error) {
        console.warn(error);
      }
    };

    loadClasses();

    return () => {
      cancelled = true;
    };
  }, [permission?.granted, requestPermission, aiModel, alphabetModel]);

  // Reset buffers when switching models
  useEffect(() => {
    lstmBufferRef.current = [];
    lstmPredictingRef.current = false;
    setPrediction(null);
    setConfidence(null);
    setLandmarks([]);
  }, [aiModel]);

  const emptyPose = () =>
    Array.from({ length: 33 }, () => ({ x: 0, y: 0, z: 0, visibility: 0 }));
  const emptyHand = () => Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 }));

  // Capture and process images
  const capture = async () => {
    if (!cameraRef.current || !permission?.granted || !isFocused) return;
    if (aiModel !== "LSTM" && !alphabetModel) return;

    try {
      const cam = cameraRef.current;
      const photo =
        (await cam.takePictureAsync?.({
          quality: 0.4,
          skipProcessing: true,
          base64: false,
          shutterSound: false,
          imageType: "jpg",
          exif: false,
        })) ??
        (await (cam as any).takePhoto?.({
          qualityPrioritization: "speed",
          flash: "off",
        }));

      if (!photo?.uri) throw new Error("Failed to capture photo");

      // Prepare image based on platform
      let imageData: string | File = photo.uri;
      if (Platform.OS === "web") {
        const response = await fetch(photo.uri);
        const blob = await response.blob();
        imageData = new File([blob], "frame.jpg", { type: "image/jpeg" });
      }

      // LSTM flow (sequence-based)
      if (aiModel === "LSTM") {
        const poseResult = await api.keypointsPoseFromImage(imageData, CAPTURE_INTERVAL*4);
        const hasPose = poseResult?.pose?.length === 33;
        const hasLeftHand = poseResult?.left_hand?.length === 21;
        const hasRightHand = poseResult?.right_hand?.length === 21;

        const poseLandmarks = hasPose ? poseResult.pose : emptyPose();
        const leftHandLandmarks = hasLeftHand ? poseResult.left_hand : emptyHand();
        const rightHandLandmarks = hasRightHand ? poseResult.right_hand : emptyHand();

        const overlayLandmarks =
          hasRightHand && rightHandLandmarks.length === 21
            ? rightHandLandmarks
            : hasLeftHand && leftHandLandmarks.length === 21
              ? leftHandLandmarks
              : [];
        setLandmarks(overlayLandmarks);

        const frame: LstmFrame = {
          pose: poseLandmarks,
          left_hand: leftHandLandmarks,
          right_hand: rightHandLandmarks,
        };

        const buffer = lstmBufferRef.current;
        buffer.push(frame);
        if (buffer.length > LSTM_WINDOW) {
          buffer.shift();
        }

        if (!lstmPredictingRef.current && buffer.length >= LSTM_WINDOW) {
          lstmPredictingRef.current = true;
          try {
            const frames = [...buffer];
            const result = await api.predictLstm({ frames });
            const rawPrediction = result?.prediction ?? null;
            let decodedPrediction = rawPrediction;
            const numericIndex = rawPrediction !== null ? Number(rawPrediction) : NaN;
            if (!Number.isNaN(numericIndex) && classes[numericIndex]) {
              decodedPrediction = classes[numericIndex];
            }

            setPrediction(decodedPrediction);
            setConfidence(typeof result?.confidence === "number" ? result.confidence : null);
          } catch (error) {
            console.warn("LSTM predict error:", error);
          } finally {
            lstmPredictingRef.current = false;
          }
        }
        return;
      }

      // Alphabet flow (ASL/VGT)
      const { landmarks: detectedLandmarks } = await api.keypointsHandsFromImage(imageData, CAPTURE_INTERVAL*4);
      if (detectedLandmarks.length === 21 && alphabetModel) {
        setLandmarks(detectedLandmarks);
        const result = await api.predict(alphabetModel, detectedLandmarks);
        const index = Number(result?.prediction);
        const detectedLetter =
          !isNaN(index) && classes[index] ? classes[index] : result?.prediction || null;
        setPrediction(detectedLetter);
        setConfidence(null);

        // Feed letter to word builder
        addLetter(detectedLetter);
      } else {
        setLandmarks([]);
        setPrediction(null);
        setConfidence(null);

        // No hand detected
        addLetter(null);
      }
    } catch (error) {
      if (error instanceof HttpError && error.statusCode === 404) {
        setPrediction(null); // No hand detected
        setConfidence(null);
        setLandmarks([]);
        addLetter(null);
      } else if (error instanceof NetworkError) {
        // Network connectivity issue - show more helpful message
        console.error("Network error - Cannot reach server:", error.message);
        setPrediction(null);
        setConfidence(null);
        setLandmarks([]);
        addLetter(null);
      } else if (error instanceof Error && error.message === "Failed to capture photo") {
        // Ignore capture errors
      } else {
        console.warn("Capture error:", error);
      }
    }
  };

  // Auto-capture loop
  useEffect(() => {
    if (!permission?.granted || !isFocused) return;
    if (aiModel !== "LSTM" && !alphabetModel) return;

    // Use lower interval for alphabet models (ASL/VGT), higher for LSTM
    const interval = aiModel === "LSTM" ? CAPTURE_INTERVAL : CAPTURE_INTERVAL_ALPHABET;
    
    const captureTimer = setInterval(capture, interval);
    return () => clearInterval(captureTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.granted, alphabetModel, aiModel, isFocused]);

  // Stop preview and clear state when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      cameraRef.current?.pausePreview?.();
      setLandmarks([]);
      setPrediction(null);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!showLandmarksButton) {
      setShowLandmarks(false);
    } else {
      setShowLandmarks(true); // auto-enable landmarks when toggle is on
    }
  }, [showLandmarksButton]);

  
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-4 text-center">Loading camera...</Text>
      </View>
    );
  }

  if (!permission || !permission.granted) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-4 text-center">Camera permission is required</Text>
        <Button onPress={requestPermission} label="Grant permission" />
        <Button onPress={() => router.push("/")} label="Back" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {isFocused && (
        <>
          <CameraView ref={cameraRef} facing={facing} style={{ flex: 1 }} animateShutter={false} />
          <LandmarksOverlay
            landmarks={landmarks}
            visible={showLandmarks}
            mirrored={facing === "front"}
          />
        </>
      )}

      {aiModel === "VGT" && (
        <SafeAreaView
        pointerEvents="box-none"
        className="absolute left-0 right-0 top-4 w-full px-4 sm:top-6 sm:px-6 md:top-4 md:px-8"
      >
        <View className="w-full flex-row justify-end px-4 sm:px-6 md:px-4">
          <TouchableOpacity
            className="rounded-full"
            accessibilityRole="button"
            accessibilityLabel="VGT info"
            onPress={() => router.push("/VGT-photo")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: buttonBg,
              borderColor: colors.border,
              borderWidth: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={
                colorScheme === "light"
                  ? require("../assets/images/info-icon-b.png")
                  : require("../assets/images/info-icon-w.png")
              }
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
              accessibilityIgnoresInvertColors
            />
          </TouchableOpacity>
        </View>
        </SafeAreaView>
      )}

      <SafeAreaView
        pointerEvents="box-none"
        className="absolute inset-x-0 bottom-4 px-4 sm:bottom-6 sm:px-6 md:bottom-8 md:px-8"
      >
        <View className="w-full px-4 sm:px-6 md:px-8">
          {aiModel !== "LSTM" ? (
            <>
              {/* Combined Word + Current Letter */}
              <View
                className="mb-3 w-full max-w-2xl self-center rounded-xl px-4 py-3"
                style={{ borderColor: colors.border, backgroundColor: cardTranslucent }}
              >
                <View className="flex-row items-stretch">
                  {/* Word (2/3) */}
                  <View
                    className="pr-4"
                    style={{ flex: 2.2, borderRightWidth: 1, borderRightColor: colors.text }}
                  >
                    <Text
                      className="mb-1 text-xs font-medium md:text-sm"
                      style={{ color: colors.textMuted }}
                    >
                      Woord
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
                      <Text
                        className="text-2xl font-bold md:text-3xl"
                        style={{ color: colors.text }}
                      >
                        {currentWord || "..."}
                        {letterBuffer && (
                          <Text className="text-blue-500 opacity-60">{letterBuffer}</Text>
                        )}
                      </Text>
                    </ScrollView>
                  </View>

                  {/* Current Letter (1/3) */}
                  <View style={{ flex: 1 }} className="items-center justify-center pl-4">
                    <Text
                      className="mb-1 text-xs font-medium md:text-sm"
                      style={{ color: colors.textMuted }}
                    >
                      Huidige Letter
                    </Text>
                    <Text
                      className="text-center text-2xl font-bold md:text-3xl"
                      style={{ color: colors.text }}
                    >
                      {prediction || "..."}
                    </Text>
                  </View>
                </View>
              </View>

          {/* Word Controls */}
          <View className="mb-3 w-full max-w-2xl self-center">
            <View className="flex-row items-center justify-between gap-2 md:gap-3">
              <Button
                label="⌫ Delete"
                className="h-12 flex-1 rounded-lg sm:h-14 md:h-16"
                style={{
                  borderColor: colors.border,
                  borderWidth: 0,
                  backgroundColor: buttonBg,
                }}
                labelClasses="text-base sm:text-lg md:text-xl font-semibold"
                labelStyle={{ color: colors.text }}
                onPress={deleteLastLetter}
                size="lg"
                variant="secondary"
              />
              <Button
                label="✓ Add"
                className="h-12 flex-1 rounded-lg sm:h-14 md:h-16"
                style={{
                  borderColor: colors.border,
                  borderWidth: 0,
                  backgroundColor: buttonBg,
                }}
                labelClasses="text-base sm:text-lg md:text-xl font-semibold"
                labelStyle={{ color: colors.text }}
                onPress={commitBuffer}
                size="lg"
                variant="secondary"
              />
              <Button
                label="✗ Clear"
                className="h-12 flex-1 rounded-lg sm:h-14 md:h-16"
                style={{
                  borderColor: colors.border,
                  borderWidth: 0,
                  backgroundColor: buttonBg,
                }}
                labelClasses="text-base sm:text-lg md:text-xl font-semibold"
                labelStyle={{ color: colors.text }}
                onPress={clearWord}
                size="lg"
                variant="secondary"
              />
            </View>
          </View>
          </>
          ) : (
            <View
              className="mb-3 w-full max-w-2xl self-center rounded-xl border px-4 py-3"
              style={{ 
                borderColor: colors.border,
                borderWidth: 0,
                backgroundColor: cardTranslucent  
              }}
            >
              <Text
                className="mb-1 text-xs font-medium md:text-sm"
                style={{ color: colors.textMuted }}
              >
                Herkende beweging (LSTM)
              </Text>
              <Text
                className="text-2xl font-bold md:text-3xl"
            style={{ color: colors.text }}
          >
            {prediction ? `${prediction}${confidence ? ` (${(confidence * 100).toFixed(0)}%)` : ""}` : "..."}
          </Text>
        </View>
      )}

          {/* Camera Controls */}
          <View className="w-full max-w-2xl self-center">
            <View className="flex-row items-center justify-between gap-2 md:gap-3">
              <Button
                label="Back"
                className="h-12 flex-1 rounded-lg sm:h-14 md:h-16"
                style={{
                  borderColor: colors.border,
                  borderWidth: 0,
                  backgroundColor: buttonBg,
                }}
                labelClasses="text-base sm:text-lg md:text-xl font-semibold"
                labelStyle={{ color: colors.text }}
                onPress={() => router.push("/")}
                size="lg"
                variant="secondary"
              />
              <Button
                label="Flip"
                className="h-12 flex-1 rounded-lg sm:h-14 md:h-16"
                style={{
                  borderColor: colors.border,
                  borderWidth: 0,
                  backgroundColor: buttonBg,
                }}
                labelClasses="text-base sm:text-lg md:text-xl font-semibold"
                labelStyle={{ color: colors.text }}
                onPress={toggleCameraFacing}
                size="lg"
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}



