uniform sampler2D customTexture;
uniform vec2 canvasAspectRatio;
uniform float time;

varying vec2 newUV;

void main(){
  vec4 outputTexture = texture( customTexture, newUV );
  vec3 gradientColor = vec3( newUV, 1.0 );
  vec3 changingColor = vec3( newUV, abs(sin(time)));
  gl_FragColor = vec4(changingColor, 1.0);
}