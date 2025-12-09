import { Text, View } from "react-native";
import { router } from "expo-router";
import Button from "@/components/buttton";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <Button
        title="Login"
        backgroundColor="#345cb1ff"
        textColor="#fff"
        onPress={() => router.push("/login")}
      />

      <Button
        title="Register"
        backgroundColor="#345cb1ff"
        textColor="#fff"
        onPress={() => router.push("/register")}
      />
    </View>
  );
}
