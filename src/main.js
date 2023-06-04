import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

import t1 from './assets/1.jpg';

class Option {
  constructor(){
    this.cameraType = "perspective"; // Default camera type
    this.orbitControlEnabled = true;
  }

  setCamera( type ){
    this.cameraType = type;
  }

  setOrbitControl( state ){
    this.orbitControlEnabled = state 
  }

  createCamera( width, height ){
    if(this.cameraType === "perspective"){
      return new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    } else if (this.cameraType === "orthographic"){
      return new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000);
    } else {
      throw new Error(`Invalid camera type: ${this.cameraType}`);
    }
  }

  createOrbitControl( camera, renderer ){
    if (this.orbitControlEnabled){
      return new OrbitControls(camera, renderer.domElement)
    }
  }

}

class Sketch {
  constructor() {
    this.canvasContainer = document.querySelector("#canvas-container");
    this.canvasWidth = this.canvasContainer.offsetWidth;
    this.canvasHeight = this.canvasContainer.offsetHeight;

    this.option = new Option();
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");
    
    this.camera = this.option.createCamera(this.canvasWidth, this.canvasHeight); // Use perspective camera by default
    this.camera.position.z = 1;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.querySelector("canvas") });
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    
    this.option.createOrbitControl(this.camera, this.renderer);

    this.addObject();
  }

  addObject() {
    this.planeWidth = 1;
    this.planeHeight = 1;

    this.planeGeometry = new THREE.PlaneGeometry( this.planeWidth, this.planeHeight );
    
    this.shaderMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        canvasAspectRation: { value : new THREE.Vector2( this.canvasWidth, this.canvasHeight )},
        customTexture: { value: new THREE.TextureLoader().load( t1 ) },
        time : { value : 0.0 },
      }
    })

    const mainObject = new THREE.Mesh(
      this.planeGeometry,
      this.shaderMaterial
    );

    this.scene.add(mainObject);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const elapsedTime = performance.now() / 1000;
    this.shaderMaterial.uniforms.time.value = elapsedTime;
    this.renderer.render(this.scene, this.camera);
  }
}

const sketch = new Sketch();
console.log(sketch.shaderMaterial.uniforms.time)
sketch.animate();
