import { Button } from "@/components/Button";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showTranslation, setShowTranslation] = useState(false);

  // 🔧 vereenvoudigde permission check (sneller & stabieler)
  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission]);

  if (!cameraPermission) {
    return <Text>Loading camera...</Text>;
  }

  if (!cameraPermission.granted) {
    return (
      <View
        // camera container: full width square, aspect ratio keeps it square
        className="mb-3 w-full rounded-2xl border border-[#B1B1B1] bg-black aspect-square"
      ></View>
    );
  }

  return (
    <View className="flex-1 bg-[#F2F2F2]">
      <View className="flex-1 items-center justify-center px-5">
        {/* camera container: responsive square (max width) and centered */}
        <View className="rounded-2xl mb-3 w-full self-center border border-[#B1B1B1] bg-black aspect-square">
          {/* CameraView fills the square container - wrap in a flex-1 View so layout uses Tailwind */}
          <View className="flex-1">
            <CameraView facing={facing} mode="picture" style={{ flex: 1 }} />
          </View>
        </View>

        {showTranslation && (
          <View className="mb-5 w-full rounded-xl border border-[#B1B1B1] bg-white p-6 min-h-[200px]">
            <View className="flex-row items-start justify-between">
              <Text className="text-left text-xl font-semibold text-black">Vertaling</Text>
            </View>
            <Text className="mt-4 text-lg text-gray-700">(translation will appear here)</Text>
            </View>
        )}
      </View>

      {/* bedieningsknoppen */}
      <View pointerEvents="box-none" className="absolute bottom-0 left-0 right-0">
        <View className="flex-row items-center justify-center space-x-2 self-stretch bg-white px-4 py-3 gap-4">
          <Button
            label="Text"
            className="rounded-lg border-2 border-[#B1B1B1] bg-white px-4 py-2"
            labelClasses="text-black text-base font-semibold"
            onPress={() => setShowTranslation(true)}
          />
          <Button
            label="Flip"
            className="rounded-lg border-2 border-[#B1B1B1] bg-white px-4 py-2"
            labelClasses="text-black text-base font-semibold"
            onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
          />
          <Button
                label="Close translation"
                onPress={() => setShowTranslation(false)}
                className="mx-0.5 rounded-lg border-2 border-[#B1B1B1] bg-white px-4 py-2"
                labelClasses="text-black text-base font-semibold"
              />
        </View>
      </View>
    </View>
  );
}
