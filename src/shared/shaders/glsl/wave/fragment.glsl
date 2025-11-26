uniform float uTime;
uniform float waveCount;
uniform float waveThickness;
varying vec3 vColor;
varying vec2 vUV;
void main() {
    if(distance(vUV, vec2(0.5, 0.5)) > 0.5)
        discard;
    float dist = fract((distance(vUV, vec2(0.5, 0.5)) / 0.707 - uTime) * waveCount);
    float alpha = step(waveThickness, dist);
    gl_FragColor = vec4(vColor, alpha) + vec4(0.0, 0.0, 0.0, 0.2);
}
