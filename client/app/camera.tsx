import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HandScreen from "./hand";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  // Request permission automatically on mount so camera opens when entering screen
  useEffect(() => {
    if (!cameraPermission || !cameraPermission.granted) {
      // calling requestPermission will prompt the user on first run
      requestCameraPermission();
    }
  }, [cameraPermission, requestCameraPermission]);

  if (!cameraPermission) {
    // Camera permissions are still loading.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading camera...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestCameraPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // Always attempt to show the camera (permission is requested automatically)

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      {/* Overlay landmarks and UI: absolutely positioned on top of the CameraView */}
      <View pointerEvents="none" style={styles.overlay}>
        <HandScreen cameraRef={cameraRef} />
      </View>

      <View style={styles.buttonContainer} pointerEvents="box-none">
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  backButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
