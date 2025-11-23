attribute vec3 uPosition;
attribute vec3 color;

varying vec3 vColor;

void main() {
    // 先计算顶点的局部位置
    vec4 localPosition = modelMatrix * vec4(position, 1.0);

    // 然后将顶点的局部位置与粒子的世界位置相加
    vec4 worldPosition = vec4(uPosition.xyz + localPosition.xyz, 1.0);

    // 最后应用视图投影变换
    gl_Position = projectionMatrix * viewMatrix * worldPosition;

    // 传递颜色给片段着色器
    vColor = color;
}