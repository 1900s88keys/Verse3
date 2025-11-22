uniform float time;
uniform float flowLength;
uniform float growthDuration;

varying vec3 vLineColor;
varying vec3 vFlowColor;
varying vec2 vUv;
void main() {
    // 计算线段生长的进度（0.0-1.0）
    float growthProgress = clamp(time / growthDuration, 0.0, 1.0);

    // 计算线段生长的末端位置
    float growthEnd = growthProgress;

    // 计算流动效果的位置，确保从线段开始处出现
    // 只有在线段完全生长后（growthProgress >= 1.0），才开始流动效果
    float flowAnimationTime = max(0.0, time - growthDuration);
    float flowOffset = mod(flowAnimationTime, 1.0 + flowLength + flowLength / 10.0) - flowLength;

    // 计算当前UV相对于流动起始位置的偏移
    float offset = vUv.y - flowOffset;

    // 确保offset在0到flowLength范围内，实现从0-1的渐变效果
    // 这样流动效果会从线段开始处出现，并沿线段移动
    // 只有在线段生长范围内且线段完全生长后才显示流动效果
    float alpha = 0.0;
    if(offset >= 0.0 && offset <= flowLength && flowOffset <= 1.0 && vUv.y <= growthEnd && growthProgress >= 1.0) {
        // 线性渐变，从流动起始位置开始到flowLength长度结束，alpha从0线性增加到1
        alpha = offset / flowLength;
    }

    // 给vLineColor设置0.2的透明度，并应用生长效果
    // 只有当vUv.y <= growthEnd时，线段才可见
    float lineAlpha = 0.2;
    if(vUv.y > growthEnd) {
        lineAlpha = 0.0; // 线段未生长到的部分透明
    }
    vec4 uBaseColor = vec4(vLineColor, lineAlpha);
    vec4 gradientColor = vec4(vFlowColor, alpha);

    gl_FragColor = gradientColor + uBaseColor;
}