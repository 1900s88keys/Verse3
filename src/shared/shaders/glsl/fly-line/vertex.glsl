attribute vec3 uLineColor;

varying vec2 vUv;
varying vec3 vLineColor;

void main() {
    vUv = uv;
    vLineColor = uLineColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}