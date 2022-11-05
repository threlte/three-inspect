varying vec2 vUv;

uniform vec3 color1;
uniform vec3 color2;

void main () {
  gl_FragColor = vec4(mix(color1, color2, vUv.x), 1.0);
}