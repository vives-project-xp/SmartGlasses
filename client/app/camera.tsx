import { Button } from "@/components/Button";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showTranslation, setShowTranslation] = useState(false);

  // Request permission automatically on mount so camera opens when entering screen
  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission, requestCameraPermission]);

  if (!cameraPermission) {
    // Camera permissions are still loading.
    return <Text>Loading camera...</Text>;
  }

  if (!cameraPermission.granted) {
    return (
      <View
        // camera container: full width square, aspect ratio keeps it square
        className="mb-3 aspect-square w-full rounded-2xl border border-[#B1B1B1] bg-black"
      ></View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View className="flex-1 bg-[#F2F2F2]">
      <View className="flex-1 items-center justify-center px-5">
        {/* camera container: responsive square (max width) and centered */}
        <View className="mb-3 aspect-square w-full self-center rounded-2xl border border-[#B1B1B1] bg-black">
          {/* CameraView fills the square container - wrap in a flex-1 View so layout uses Tailwind */}
          <View className="flex-1">
            <CameraView facing={facing} mode="picture" style={{ flex: 1 }} />
          </View>
        </View>

        {showTranslation && (
          <View className="mb-5 min-h-[200px] w-full rounded-xl border border-[#B1B1B1] bg-white p-6">
            <View className="flex-row items-start justify-between">
              <Text className="text-left text-xl font-semibold text-black">Vertaling</Text>
            </View>
            <Text className="mt-4 text-lg text-gray-700">(translation will appear here)</Text>
          </View>
        )}
      </View>

      {/* bedieningsknoppen */}
      <View pointerEvents="box-none" className="absolute bottom-0 left-0 right-0">
        <View className="flex-row items-center justify-center gap-4 space-x-2 self-stretch bg-white px-4 py-3">
          <Button
            label="Text"
            className="rounded-lg border-2 border-[#B1B1B1] bg-white px-5 py-4"
            labelClasses="text-black text-lg font-semibold"
            onPress={() => setShowTranslation((v) => !v)}
            size="lg"
            variant="secondary"
          />
          <Button
            label="Flip"
            className="rounded-lg border-2 border-[#B1B1B1] bg-white px-10 py-4"
            labelClasses="text-black text-lg font-semibold"
            onPress={toggleCameraFacing}
            size="lg"
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}
