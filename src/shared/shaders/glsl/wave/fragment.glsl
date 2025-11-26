uniform float currentTime;
varying vec3 vColor;
varying vec2 vUV;

void main() {
    float per1 = fract(currentTime);
    float per2 = fract(currentTime - 0.03);
    float per3 = fract(currentTime - 0.06);
    float dis = distance(vUV, vec2(0.5, 0.5));

    vec4 color1 = vec4(vColor, 1.0);
    vec4 color2 = vec4(vColor, 1.0);
    vec4 color3 = vec4(vColor, 1.0);
    //step函数当dis大于per1的时候返回1，小于就返回0，
    float pass1 = step(per1, dis) == 0.0 ? color1.a * dis / per1 : 0.0;
    float pass2 = step(per2, dis) == 0.0 ? color2.a * dis / per2 : 0.0;
    float pass3 = step(per3, dis) == 0.0 ? color3.a * dis / per3 : 0.0;
    pass1 = pass1 * (1.0 - per1) * 2.0;
    pass2 = pass2 * (1.0 - per2) * 2.0;
    pass3 = pass3 * (1.0 - per3) * 2.0;
    color1.a = pass1;
    color2.a = pass2;
    color3.a = pass3;
    gl_FragColor = color1 + color2 + color3;
}