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
    isSP:boolean=false;
    footer:HTMLElement;
    dataManager:DataManager;

    init(){

        this.dataManager = DataManager.getInstance();

        this.footer = document.getElementById(Params.FOOTER_CENTER);
        this.isSP = DataManager.getInstance().isSp;
        this.setFooterTextColor();

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
        const loader = new THREE.CubeTextureLoader();
        loader.setPath( './topimg/' );
        this.envMap = loader.load( [ 'a.jpg', 'a.jpg', 'a.jpg', 'a.jpg', 'a.jpg', 'a.jpg' ] );
        //this.envMap.encoding = THREE.sRGBEncoding;
        this.envMap.mapping = THREE.CubeReflectionMapping;
            */
        //this.envMap = imgManager.images[2].texture;
        //this.envMap.mapping = THREE.EquirectangularReflectionMapping;
        //this.envMap.encoding = THREE.sRGBEncoding;

        // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
        this.material = new THREE.ShaderMaterial( {
            uniforms: THREE.UniformsUtils.merge( [
                THREE.ShaderLib[ 'phong' ].uniforms,
                {
                    'heightmap': { value: null },
                    'diffuse':{value: new THREE.Color( 0xffffff ) },
                    'specular':{value: new THREE.Color( 0x222222 ) },//ハイライト
                    'emissive':{value: new THREE.Color( 0x000000 ) },
                    'shininess':{value: this.isSP ? 60 : 50 },
                    'map':{value: this.texture},
                    'map2':{value: this.texture2},
                    'noise':{value: this.isSP ? 0.08 : 0.24},
                    //'envMap':{value: this.envMap},
                    //'reflectivity':{value: 1.0},
                    //'refractionRatio':{value: 0.98},

                    'counter':{value: 0},
                    'offsetY':{value: this.getOffsetY()},
                    'glitch':{value: new THREE.Vector4(0,-3.1415/4,10,10)},
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

        this.initGUI();

        this.material.defines.WIDTH = this.WIDTH.toFixed( 1 );
        this.material.defines.BOUNDS = this.BOUNDS.toFixed( 1 );

        this.waterMesh = new THREE.Mesh( geometry, this.material );
        this.waterMesh.visible          =true;
        this.waterMesh.receiveShadow    =true;
        this.waterMesh.castShadow       =true;

    }

    initGUI(){
        let uniform = this.material.uniforms;
        let gui = DataManager.getInstance().gui;

        if(gui==null)return;

        gui.add(
            uniform["offsetY"],"value",0,1
        ).name("offsetY");
        gui.addColor(
            uniform["offsetCol"],"value"
        ).name("color").listen();
        gui.add(
            this,"blink"
        );
        gui.add(
            uniform["glitch"].value,"x",0,5
        ).name("glitchX");
        gui.add(
            uniform["glitch"].value,"y",0,5
        ).name("glitchY");
        gui.add(
            uniform["glitch"].value,"z",1,100
        ).name("glitchZ");

        gui.add(
            uniform["colDisplace"].value,"x",0,0.2
        ).name("colDispX");
        gui.add(
            uniform["colDisplace"].value,"y",0,0.2
        ).name("colDispY");
        gui.add(
            uniform["colDisplace"].value,"z",0,0.2
        ).name("colDispZ");
        gui.add(
            uniform["shininess"],"value",20,200
        ).name("shininess");
    }


    glitch(dx:number,split:number,rad:number=-3.1415/4){
        let uniform = this.material.uniforms;
        uniform["glitch"].value.x = dx;//2 * (Math.random()-0.5);
        uniform["glitch"].value.y = rad;
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

    glitchTweenFinal(d:number){
        let uniform = this.material.uniforms;
        //uniform["glitch"].value.x = uniform["glitch"].value.x/8;
        gsap.to(uniform["glitch"].value, {
            duration: d,
            x: 0
        });
    }


    blink(value:number=0.5){
        let uniform = this.material.uniforms;
        uniform["offsetCol"].value.r = value;
        uniform["offsetCol"].value.g = value;
        uniform["offsetCol"].value.b = value;
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
        this.material.uniforms['map2'].value = !this.texFlag ? this.texture2 : this.texture;

        this.setFooterTextColor();

    }

    setFooterTextColor(){

        if(this.footer){            
            if(this.dataManager.isSp){
                //this.footer.style.color=this.texFlag ? "#ffffff" : "#111144";
                this.footer.style.color="#fff";
                this.footer.style.textShadow="0 0 6px #00469b";

            }else{
                this.footer.style.color=!this.texFlag ? "#ffffff" : "#111144";
                
                

            }            
        }

    }

    update(tex:THREE.Texture){

        if(this.isStart){
            this.counter+=0.06;
        }else{
            this.material.uniforms['offsetY'].value+=
            (this.getOffsetY()-this.material.uniforms['offsetY'].value)/2;
        }
        
        //else this.counter-=0.06;
        this.material.uniforms['heightmap'].value   = tex;
        this.material.uniforms['counter'].value     = this.counter + window.scrollY*0.06;
        
    }

    getOffsetY():number{
        //スケールも加味する
        if(window.innerHeight<window.innerWidth){
            let w = window.innerHeight/window.innerWidth;//横長
            return (1-w)/2*Params.ZOOM;
        }else{
            return 0;

        }
        return 0;
    }


}

export {MyWaveMesh};