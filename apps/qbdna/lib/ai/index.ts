// Video generation
export {
  generateVideo,
  enhanceHighlight,
  generateHighlightReel,
  overlayStats,
  generateFromPreset,
  MOTION_PRESETS,
} from "./video";
export type {
  VideoGenerateRequest,
  VideoResult,
  VideoProvider,
  VideoModel,
  VideoAspect,
  MotionPreset,
} from "./video";

// Image generation
export {
  generateImage,
  stylizeAvatar,
  generateCardBackground,
  generateSocialThumbnail,
} from "./image";
export type {
  ImageGenerateRequest,
  ImageResult,
  ImageProvider,
  ImageStyle,
  ImageSize,
} from "./image";
