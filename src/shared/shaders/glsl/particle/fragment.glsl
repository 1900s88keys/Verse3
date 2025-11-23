varying vec3 vColor;

void main() {
    // 使用从顶点着色器传递的颜色
    gl_FragColor = vec4(vColor, 1.0);
}