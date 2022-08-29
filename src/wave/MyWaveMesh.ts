import * as THREE from 'three';
import waveRender_vert from "../glsl/waveRender.vert";
import waveRender_frag from "../glsl/waveRender.frag";
import { TextureFilter } from 'three';
import simplexNoise from "../glsl/simplexNoise.frag";
import { DataManager } from '../data/DataManager';

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

        const loader = new THREE.TextureLoader();
        const filename = window.innerWidth > window.innerHeight ? './topimg/img.png' : './topimg/img2.png';
        this.texture = loader.load(filename);

        const loader2 = new THREE.TextureLoader();
        this.texture2=loader2.load("./topimg/img3.png");

        this.texture.magFilter = THREE.LinearFilter;
        this.texture.minFilter = THREE.NearestFilter;
        this.texture2.magFilter = THREE.LinearFilter;
        this.texture2.minFilter = THREE.NearestFilter;
        
        const loader3 = new THREE.TextureLoader();
        this.envMap = loader3.load( './topimg/img3.png' );
        this.envMap.mapping = THREE.EquirectangularReflectionMapping;
        this.envMap.encoding = THREE.sRGBEncoding;        

        
        console.log(THREE.ShaderLib[ 'phong' ].uniforms);


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
                    'envMap':{value: this.envMap},
                    'counter':{value: 0},
                    'offsetY':{value: this.getOffsetY()}
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
        DataManager.getInstance().gui.add(
            uniform["offsetY"],"value",0,1
        ).name("offsetY");
    
        this.material.defines.WIDTH = this.WIDTH.toFixed( 1 );
        this.material.defines.BOUNDS = this.BOUNDS.toFixed( 1 );

        this.waterMesh = new THREE.Mesh( geometry, this.material );
        this.waterMesh.visible          =true;
        this.waterMesh.receiveShadow    =true;
        this.waterMesh.castShadow       =true;

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
        return (1-w)/2*1.2;
    }


}

export {MyWaveMesh};