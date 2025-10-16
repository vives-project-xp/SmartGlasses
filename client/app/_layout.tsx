import { SafeAreaView } from "react-native-safe-area-context";
import "../assets/styles/globals.css";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <SafeAreaView
      edges={["bottom"]}
      className="flex-1"
      // keep only dynamic insets inline; static spacing moved to Tailwind classes
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Welcome",
            headerShown: false,
          }}
          />
        <Stack.Screen
          name="camera"
          options={{
            title: "Camera View",
            headerShown: false,
          }}
          />
        <Stack.Screen
          name="about"
          options={{
            title: "About",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: true,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
