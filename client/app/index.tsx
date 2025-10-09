import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/Button";

export default function Index() {
  const handleGetStarted = () => {
    router.push("/camera");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">Welcome to Nativewind!</Text>
      <Button label="Button" />
      <Button label="Button" variant="secondary" />
      <Button label="Button" variant="destructive" />
    </View>
  );
}
