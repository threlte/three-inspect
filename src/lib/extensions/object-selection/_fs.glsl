uniform sampler2D outlinedObjectsTexture;
uniform float lineWidth;
uniform vec3 outlineColor;
uniform float edgeFactor;
varying vec2 vUv;

void main() {
  // screen space derivatives for line width
  vec2 sampleStep = lineWidth * vec2(dFdx(vUv.x), dFdy(vUv.y));
  vec4 currentColor = texture2D(outlinedObjectsTexture, vUv);

  vec4 neighbors[8];
  neighbors[0] = texture2D(outlinedObjectsTexture, vUv + vec2(-sampleStep.x, sampleStep.y)); // Top-Left
  neighbors[1] = texture2D(outlinedObjectsTexture, vUv + vec2(0.0f, sampleStep.y)); // Top
  neighbors[2] = texture2D(outlinedObjectsTexture, vUv + vec2(sampleStep.x, sampleStep.y)); // Top-Right
  neighbors[3] = texture2D(outlinedObjectsTexture, vUv + vec2(sampleStep.x, 0.0f)); // Right
  neighbors[4] = texture2D(outlinedObjectsTexture, vUv + vec2(sampleStep.x, -sampleStep.y)); // Bottom-Right
  neighbors[5] = texture2D(outlinedObjectsTexture, vUv + vec2(0.0f, -sampleStep.y)); // Bottom
  neighbors[6] = texture2D(outlinedObjectsTexture, vUv + vec2(-sampleStep.x, -sampleStep.y)); // Bottom-Left
  neighbors[7] = texture2D(outlinedObjectsTexture, vUv + vec2(-sampleStep.x, 0.0f)); // Left

  float edgeDetectValue = 0.0f;
  for (int i = 0; i < 8; i++) {
    edgeDetectValue += step(edgeFactor, length(currentColor.rgb - neighbors[i].rgb));
  }

  // just outline 
  gl_FragColor = vec4(outlineColor, edgeDetectValue);

  // outline + transparent colorId
  // vec3 finalColor = mix(currentColor.rgb, outlineColor, edgeDetectValue);
  // gl_FragColor = vec4(finalColor, max(edgeDetectValue, currentColor.a * 0.3f));

  // outline + highlight color based on the override material color
  // gl_FragColor = vec4(currentColor.rgb, max(edgeDetectValue, currentColor.a * 0.3f));  
}