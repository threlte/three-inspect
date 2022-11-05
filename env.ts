export default {
  kit__DIR_TEXTURES: '"/textures/"',
  kit__DIR_AUDIO: '"/audio/"',
  kit__DIR_GLB: '"/glb/"',
  kit__DIR_JSON: '"/json/"',
  kit__DIR_FILE: '"/file/"',

  kit__checkShaderErrors: true,
  kit__physicallyCorrectLights: true,
  kit__RENDERER_ALPHA: false,
  kit__RENDERER_SRGB: true,
  kit__RENDERER_TONEMAPPING: true,
  kit__RENDERER_SHADOWMAP: true,
  kit__RENDERER_SHADOWMAP_SIZE: 2048,
  kit__RENDERER_SHADOWMAP_TYPE: '"basic"',
  kit__RENDERER_DPI: 1.5,

  // Soft shadows
  kit__PCSS: false,
  kit__PCSS_SIZE: 0.005,
  kit__PCSS_FRUSTUM: 3.75,
  kit__PCSS_NEAR: 9.5,
  kit__PCSS_SAMPLES: 10,
  kit__PCSS_RINGS: 3,

  // https://github.com/pmndrs/postprocessing
  kit__POSTPROCESSING: false,
  kit__POST_MULTISAMPLING: 2,
  kit__POST_SMAA: true,
  kit__POST_DEPTH_PASS: false,
  kit__POST_BLOOM: true,
  kit__POST_BLOOM_INTENSITY: 1,
  kit__POST_BLOOM_HEIGHT: 200,
  kit__POST_BLOOM_WIDTH: 200,
  kit__POST_BLOOM_LUMINANCE_THRESHOLD: 0.4,
  kit__POST_BLOOM_LUMINANCE_SMOOTHING: 0.9,

  kit__POST_NOISE: true,
  kit__POST_NOISE_OPACITY: 0.06,

  // https://github.com/Ameobea/three-good-godrays
  kit__POST_GODRAYS: true,

  kit__POST_VIGNETTE: true,
  kit__POST_DOF: false,
  kit__POST_SSR: false,

  kit__CAMERA_PERSPECTIVE: true,
  kit__CAMERA_FOV: 75,
  kit__CAMERA_NEAR: 0.1,
  kit__CAMERA_FAR: 100,
  kit__CAMERA_ORTHO_SIZE: 50,

  kit__CONTROLS: true,
  kit__CONTROLS_KEYBOARD: true,
  kit__CONTROLS_GAMEPAD: true,

  kit__MESH_UI: true,
  kit__MESH_UI_FONT: '"/pixeloid-sans"',

  kit__XR_ENABLED: false,
  kit__XR_BUTTON: false,
}