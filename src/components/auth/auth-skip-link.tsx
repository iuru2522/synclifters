import { Pressable, Text } from "react-native";
import { Link, type Href } from "expo-router";
import { globalStyles } from "@/styles/global";

type AuthSkipLinkProps = {
  href?: Href;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
};

export function AuthSkipLink({ href = "/sign-in", onPress, disabled = false }: AuthSkipLinkProps) {
  if (onPress) {
    return (
      <Pressable
        style={globalStyles.authSkipLink}
        accessibilityRole="button"
        accessibilityLabel="Skip"
        disabled={disabled}
        onPress={() => {
          if (disabled) {
            return;
          }

          void onPress();
        }}
      >
        <Text style={globalStyles.authSkipLinkText}>Skip</Text>
      </Pressable>
    );
  }

  return (
    <Link href={href} asChild>
      <Pressable
        style={globalStyles.authSkipLink}
        accessibilityRole="link"
        accessibilityLabel="Skip"
      >
        <Text style={globalStyles.authSkipLinkText}>Skip</Text>
      </Pressable>
    </Link>
  );
}
