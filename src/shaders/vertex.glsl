uniform sampler2D customTexture;
uniform vec2 canvasAspectRatio;
uniform float time;

varying vec2 newUV;
float scale = 1.0;

void main(){
  newUV = uv;
  gl_Position = vec4( projectionMatrix * modelViewMatrix * vec4( position, scale ));
}