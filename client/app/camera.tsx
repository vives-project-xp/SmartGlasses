import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

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
      <View>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestCameraPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // Always attempt to show the camera (permission is requested automatically)
  return (
    <View className="flex-1 bg-black">
      <CameraView facing={facing} className="absolute inset-0 h-full w-full" />

      {/* Overlay controls */}
      <View pointerEvents="box-none" className="absolute inset-0 justify-end">
        <View className="flex-row items-center justify-between bg-black/30 px-4 py-6">
          <TouchableOpacity
            onPress={toggleCameraFacing}
            className="rounded-full bg-white/20 px-4 py-2"
          >
            <Text className="text-white">Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full bg-white/20 px-4 py-2"
          >
            <Text className="text-white">Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
