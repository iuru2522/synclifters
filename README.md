# TBA

for ios

```
pnpm expo prebuild --clean
pnpm ios
```

### How to install react native app on ios Virtual device

If `npx expo run:ios` fails with something like:

```
Something went wrong running `pod install` in the `ios` directory.
CocoaPods could not find compatible versions for pod "ExpoImage"
```

the local `ios/Pods` + `ios/Podfile.lock` are out of sync with `node_modules` (common after dependency updates). Fix:

```
rm -rf ios/Pods ios/Podfile.lock
cd ios && pod install --repo-update && cd ..
npx expo run:ios --device
```

for android
```
// native android build takes aroun 22+ mins
//it will automatic run everything needed + open android simulator
pnpm android

// after project complied
pnpm start
```
