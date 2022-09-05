import * as THREE from 'three';
import waveRender_vert from "../glsl/waveRender.vert";
import waveRender_frag from "../glsl/waveRender.frag";
import { TextureFilter } from 'three';
import simplexNoise from "../glsl/simplexNoise.frag";
import { DataManager } from '../data/DataManager';
import gsap from "gsap";
import { Params } from '../data/Params';
import { ImageManager } from '../data/ImageManager';


class MyWaveMesh{

	// Texture width for simulation
	WIDTH:number = 128;

	// Water size in system units
	BOUNDS:number = 512;
	BOUNDS_HALF:number = 512 * 0.5;
    waterMesh:THREE.Mesh;
    material:THREE.ShaderMaterial;
    counter:number=0;
    isStart:boolean=false;
    
    texture:THREE.Texture;
    texture2:THREE.Texture;
    envMap:THREE.Texture;
    texFlag:boolean=false;

    init(){

        const materialColor = 0x0040C0;

        const geometry = new THREE.PlaneGeometry( 
            this.BOUNDS, 
            this.BOUNDS,
            
            this.WIDTH - 1, 
            this.WIDTH - 1
        );

        let imgManager:ImageManager = ImageManager.getInstance();

        this.texture = imgManager.images[0].texture;
        this.texture2= imgManager.images[1].texture;

        /*
        const loader3 = new THREE.TextureLoader();
        this.envMap = loader3.load( './topimg/img3.png' );
        this.envMap.mapping = THREE.EquirectangularReflectionMapping;
        this.envMap.encoding = THREE.sRGBEncoding;        
        */
        
        //console.log(THREE.ShaderLib[ 'phong' ].uniforms);


        // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
        this.material = new THREE.ShaderMaterial( {
            uniforms: THREE.UniformsUtils.merge( [
                THREE.ShaderLib[ 'phong' ].uniforms,
                {
                    'heightmap': { value: null },
                    'diffuse':{value: new THREE.Color( 0xffffff ) },
                    'specular':{value: new THREE.Color( 0x222222 ) },//ハイライト
                    'emissive':{value: new THREE.Color( 0x000000 ) },
                    'shininess':{value: 30},
                    'map':{value: this.texture},
                    //'envMap':{value: this.envMap},
                    'counter':{value: 0},
                    'offsetY':{value: this.getOffsetY()},
                    'glitch':{value: new THREE.Vector4(0,0,10,10)},
                    'offsetCol':{value: new THREE.Color(0x000000)},
                    'colDisplace':{value: new THREE.Vector3(0.02,0.03,0.04)}
                }
            ] ),
            vertexShader: waveRender_vert,//ここ
            fragmentShader: simplexNoise+waveRender_frag//THREE.ShaderChunk[ 'meshphong_frag' ]

        } );
        this.material.lights = true;

        //let m:MyMat = new MyMat();
        //m.init();
        //this.material = m.material;

        let uniform = this.material.uniforms;
        DataManager.getInstance().gui?.add(
            uniform["offsetY"],"value",0,1
        ).name("offsetY");
        DataManager.getInstance().gui?.addColor(
            uniform["offsetCol"],"value"
        ).name("color").listen();
        DataManager.getInstance().gui?.add(
            this,"blink"
        );
        DataManager.getInstance().gui?.add(
            uniform["glitch"].value,"x",0,5
        ).name("glitchX");
        DataManager.getInstance().gui?.add(
            uniform["glitch"].value,"z",1,100
        ).name("glitchZ");

        DataManager.getInstance().gui?.add(
            uniform["colDisplace"].value,"x",0,0.2
        ).name("colDispX");
        DataManager.getInstance().gui?.add(
            uniform["colDisplace"].value,"y",0,0.2
        ).name("colDispY");
        DataManager.getInstance().gui?.add(
            uniform["colDisplace"].value,"z",0,0.2
        ).name("colDispZ");


    
        this.material.defines.WIDTH = this.WIDTH.toFixed( 1 );
        this.material.defines.BOUNDS = this.BOUNDS.toFixed( 1 );

        this.waterMesh = new THREE.Mesh( geometry, this.material );
        this.waterMesh.visible          =true;
        this.waterMesh.receiveShadow    =true;
        this.waterMesh.castShadow       =true;

    }


    glitch(dx:number,split:number){
        let uniform = this.material.uniforms;
        uniform["glitch"].value.x = dx;//2 * (Math.random()-0.5);
        uniform["glitch"].value.z = split;//Math.floor( 10+20*(Math.random()) );        
    }

    glitchTween(){
        let uniform = this.material.uniforms;
        uniform["glitch"].value.x = uniform["glitch"].value.x/8;
        gsap.to(uniform["glitch"].value, {
            duration: 1,
            x: 0
        });
    }


    blink(){
        let uniform = this.material.uniforms;
        uniform["offsetCol"].value.r=0.5;
        uniform["offsetCol"].value.g=0.5;
        uniform["offsetCol"].value.b=0.5;
        gsap.to(uniform["offsetCol"].value, {
            duration: 0.5,
            r: 0,
            g: 0,
            b: 0,
          });
    }

    startScroll(){
        this.isStart=true;
    }

    changeTex(){
        this.texFlag=!this.texFlag;
        this.material.uniforms['map'].value = this.texFlag ? this.texture2 : this.texture;
    }


    update(tex:THREE.Texture){

        if(this.isStart) this.counter+=0.06;
        //else this.counter-=0.06;
        this.material.uniforms['heightmap'].value   = tex;
        this.material.uniforms['counter'].value     = this.counter + window.scrollY*0.06;
        
    }

    getOffsetY():number{
        //スケールも加味する

        let w = window.innerHeight/window.innerWidth;
        return (1-w)/2*Params.ZOOM;
    }


}

export {MyWaveMesh};