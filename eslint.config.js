// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "tests/**", "vitest.config.*", "android/**", "ios/**"],
  },
  {
    rules: {
      // Data hooks intentionally fetch on mount via useEffect(() => void refresh()).
      "react-hooks/set-state-in-effect": "off",
      // Reanimated shared values are mutated via `.value =` by design.
      "react-hooks/immutability": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);
