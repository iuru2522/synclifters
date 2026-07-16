import { Pressable, Text } from "react-native";
import { Link, type Href } from "expo-router";
import { globalStyles } from "@/styles/global";

type AuthSkipLinkProps = {
  href?: Href;
};

export function AuthSkipLink({ href = "/sign-in" }: AuthSkipLinkProps) {
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
