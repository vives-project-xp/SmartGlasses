import "../assets/styles/globals.css";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
    </Stack>
  );
}
