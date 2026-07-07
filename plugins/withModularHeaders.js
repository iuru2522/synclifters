// Google Sign-In + Firebase iOS pods require module maps for Swift interop.
const { withPodfile, createRunOncePlugin } = require('expo/config-plugins');
const {
  mergeContents,
  removeContents,
} = require('@expo/config-plugins/build/utils/generateCode');

const TAG = 'synclifters-modular-headers';
const ANCHOR = /^prepare_react_native_project!/m;

function addModularHeadersToPodfile(src) {
  try {
    return mergeContents({
      src,
      newSrc: 'use_modular_headers!',
      tag: TAG,
      anchor: ANCHOR,
      offset: -1,
      comment: '#',
    });
  } catch (error) {
    if (error.code === 'ERR_NO_MATCH') {
      throw new Error(
        'Cannot add use_modular_headers! to the Podfile: anchor not found. The Expo/RN Podfile template may have changed.'
      );
    }
    throw error;
  }
}

function removeModularHeadersFromPodfile(src) {
  return removeContents({ src, tag: TAG });
}

function withModularHeaders(config) {
  return withPodfile(config, (config) => {
    const result = addModularHeadersToPodfile(config.modResults.contents);
    if (result.didMerge || result.didClear) {
      config.modResults.contents = result.contents;
    }
    return config;
  });
}

module.exports = createRunOncePlugin(
  withModularHeaders,
  'synclifters-with-modular-headers',
  '1.0.0'
);
module.exports.addModularHeadersToPodfile = addModularHeadersToPodfile;
module.exports.removeModularHeadersFromPodfile = removeModularHeadersFromPodfile;
