import { useTheme } from "@/lib/theme";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const vgtAlphabet = require("../assets/images/VGT Alfabet.png");

export default function VGTPhoto() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={vgtAlphabet}
          resizeMode="contain"
          style={{
            width: "100%",   // schermbreedte
            height: "100%",  // vult de hoogte
          }}
        />
      </View>
    </SafeAreaView>
  );
}
