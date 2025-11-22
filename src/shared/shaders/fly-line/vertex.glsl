attribute vec3 uLineColor;
attribute vec3 uFlowColor;

varying vec2 vUv;
varying vec3 vLineColor;
varying vec3 vFlowColor;

void main() {
    vUv = uv;
    vLineColor = uLineColor;
    vFlowColor = uFlowColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}