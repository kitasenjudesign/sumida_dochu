import * as THREE from 'three';
import waveRender_frag from "./glsl/waveRender.frag";
import waveRender_vert from "./glsl/waveRender.vert";
import { MyMat } from "./MyMat";
import hoge_frag from "./glsl/hoge.frag";
import hoge_vert from "./glsl/hoge.vert";
import { TextureFilter } from 'three';
import { gsap } from "gsap";

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
        
        // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
        this.material = new THREE.ShaderMaterial( {
            uniforms: THREE.UniformsUtils.merge( [
                THREE.ShaderLib[ 'phong' ].uniforms,
                {
                    'heightmap': { value: null },
                    'diffuse':{value: new THREE.Color( 0xffffff ) },
                    'specular':{value: new THREE.Color( 0x222222 ) },
                    'shininess':{value: 30},
                    'map':{value: this.texture},
                    'counter':{value: 0}
                }
            ] ),
            vertexShader: waveRender_vert,//ここ
            fragmentShader: hoge_frag//THREE.ShaderChunk[ 'meshphong_frag' ]

        } );


        //let m:MyMat = new MyMat();
        //m.init();
        //this.material = m.material;


        this.material.lights = true;

        // Material attributes from THREE.MeshPhongMaterial
        
        //material.color = new THREE.Color( materialColor );
        //material.specular = new THREE.Color( 0x111111 );
        //material.shininess = 50;

        // Sets the uniforms with the material values
        //material.uniforms[ 'diffuse' ].value = material.color as any;
        //material.uniforms[ 'specular' ].value = material.specular as any;
        //material.uniforms[ 'shininess' ].value = Math.max( material.shininess, 1e-4 ) as any;
        //material.uniforms[ 'opacity' ].value = material.opacity as any;

        // Defines
        this.material.defines.WIDTH = this.WIDTH.toFixed( 1 );
        this.material.defines.BOUNDS = this.BOUNDS.toFixed( 1 );

//        waterUniforms = material.uniforms;

        this.waterMesh = new THREE.Mesh( geometry, this.material );
        this.waterMesh.visible          =true;
        this.waterMesh.receiveShadow    =true;
        this.waterMesh.castShadow       =false;        
        //scene.add( waterMesh );

    }


    startIntro(){

        this.waterMesh.visible=true;
        this.isStart=true;
        this.counter=0;
        /*
            this.waterMesh.position.set(0,-this.BOUNDS,0);//=new THREE.Vector3(0,-100,0);
            gsap.to(this.waterMesh.position, {
                "duration":30,
                "y":0,
                "ease":"linear"
            });
        */

    }

    changeTex(){
        this.texFlag=!this.texFlag;
        this.material.uniforms['map'].value = this.texFlag ? this.texture2 : this.texture;
    }


    update(tex:THREE.Texture){

        if(this.isStart) this.counter+=0.06;
        else this.counter-=0.06;
        this.material.uniforms['heightmap'].value = tex;
        this.material.uniforms['counter'].value = this.counter+window.scrollY*0.06;
        
        

        //waterUniforms[ 'heightmap' ].value
    }



}

export {MyWaveMesh};