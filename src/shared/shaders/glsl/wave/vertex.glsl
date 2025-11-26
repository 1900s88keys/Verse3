attribute vec3 color;

varying vec3 vColor;
varying vec2 vUV;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // 传递颜色给片段着色器
    vColor = color;
    // 传递UV给片段着色器
    vUV = uv;
}