import { BlurTargetView } from "expo-blur";
import { type RefObject } from "react";
import { View } from "react-native";
import Video from "react-native-video";
import { globalStyles } from "@/styles/global";

const backgroundVideo = require("../../../assets/videos/background.mov");

type AuthVideoBackgroundProps = {
  blurTargetRef: RefObject<View | null>;
};

export function AuthVideoBackground({ blurTargetRef }: AuthVideoBackgroundProps) {
  return (
    <BlurTargetView ref={blurTargetRef} style={globalStyles.authVideoBackground} pointerEvents="none">
      <Video
        source={backgroundVideo}
        style={globalStyles.authVideo}
        resizeMode="cover"
        repeat
        muted
        paused={false}
        controls={false}
        playInBackground={false}
        playWhenInactive
        ignoreSilentSwitch="obey"
        disableFocus
      />
    </BlurTargetView>
  );
}
