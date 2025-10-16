import { Button } from "@/components/Button";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";

export default function Index() {
  const handleGetStarted = () => {
    router.push("/camera");
  };

  const handleAbout = () => {
    router.push("/about");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#F2F2F2] p-5">
      <View className="max-w-[300px] items-center">
        <Image source={require("../assets/images/Handsymbol.png")} className="h-24 w-24" />

        <Text className="mb-5 text-center text-4xl font-bold text-[#333333]">Smartglasses</Text>
        <Text className="mb-10 text-center text-base leading-6 text-[#666666]">
          Gestures to text & speech
        </Text>

        <View className="mb-5 self-stretch">
          <Button
            size="lg"
            className=" w-full rounded-lg bg-black"
            label="Start detection"
            labelClasses="text-white text-lg font-semibold"
            onPress={handleGetStarted}
          />
        </View>

        <View className="flex-row gap-3 self-stretch">
          <Button
            label="About"
            className=" flex-1 rounded-lg border-2 border-[#B1B1B1] bg-white px-8"
            labelClasses="text-black text-lg font-semibold"
            onPress={handleAbout}
            size="default"
            variant="secondary"
          />
          <Button
            label="Settings"
            className="flex-1 rounded-lg border-2 border-[#B1B1B1] bg-white px-8"
            labelClasses="text-black text-lg font-semibold"
            onPress={handleSettings}
            size="default"
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
}
