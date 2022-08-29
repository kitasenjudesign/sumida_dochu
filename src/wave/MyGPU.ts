import * as THREE from 'three';
import { MeshBasicMaterial, MeshPhongMaterial, MeshPhongMaterialParameters } from 'three';
import wave_frag from "../glsl/waveCalc.frag";
import read_frag from "../glsl/read.frag";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { MyAudio } from '../sound/MyAudio';
import { DataManager } from '../data/DataManager'

class MyGPU{

	// Texture width for simulation
	WIDTH:number = 128;

	// Water size in system units
	BOUNDS:number = 512;
	BOUNDS_HALF:number = 512 * 0.5;

    gpuCompute:GPUComputationRenderer;
    heightmapVariable:Variable;
    heightmap0:THREE.DataTexture;
    readWaterLevelShader:THREE.ShaderMaterial;
    readWaterLevelImage:Uint8Array;
    readWaterLevelRenderTarget:THREE.WebGLRenderTarget;

    testMesh:THREE.Mesh;
    testMat:THREE.MeshPhongMaterial;
    
    isFirst:boolean=true;
    isMoriagari:boolean=false;


    attenuation:number=0.99;
    uniforms:any;


    init(){
        this.testMat = new THREE.MeshPhongMaterial();
        this.testMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(100,100,1,1),
            this.testMat
        );
    }


    initWater(renderer:THREE.WebGLRenderer) {

        const geometry = new THREE.PlaneGeometry( 
            this.BOUNDS, 
            this.BOUNDS, 
            this.WIDTH - 1, 
            this.WIDTH - 1
        );

        // Creates the gpu computation class and sets it up
        this.gpuCompute = new GPUComputationRenderer( this.WIDTH, this.WIDTH, renderer );

        //if ( renderer.capabilities.isWebGL2 === false ) {
            this.gpuCompute.setDataType( THREE.HalfFloatType );
        //}

        this.heightmap0 = this.gpuCompute.createTexture();

        //fillTexture( heightmap0 );

        this.heightmapVariable = this.gpuCompute.addVariable( 
            'heightmap', 
            wave_frag,//document.getElementById( 'heightmapFragmentShader' ).textContent, 
            this.heightmap0 
        );

        this.gpuCompute.setVariableDependencies( 
            this.heightmapVariable, [ this.heightmapVariable ] 
        );

        this.uniforms=this.heightmapVariable.material.uniforms;
        this.uniforms[ 'mousePos' ] = { value: new THREE.Vector2( 10000, 10000 ) };
        this.uniforms[ 'mouseSize' ] = { value: 20.0 };
        this.uniforms[ 'viscosityConstant' ] = { value: 0.9 };
        this.uniforms[ 'heightCompensation' ] = { value: 0.5 };
        this.uniforms[ 'attenuation' ] = { value: this.attenuation };
        this.uniforms[ 'amplitude' ] = { value: 0 };//1.28 };
        this.heightmapVariable.material.defines.BOUNDS = this.BOUNDS.toFixed( 1 );

        const error = this.gpuCompute.init();
        if ( error !== null ) {
            console.error( error );
        }

        
        let gui = DataManager.getInstance().gui;
        gui.add(
            this.uniforms[ 'attenuation' ],"value",0.901,0.999
        ).name("attenuation").listen();
        gui.add(
            this.uniforms[ 'mouseSize' ],"value",2,100.0
        ).name("mouseSize").listen();
        gui.add(
            this.uniforms[ 'amplitude' ],"value",0,20.0
        ).name("amplitude").listen();
        // Create compute shader to smooth the water surface and velocity
        //smoothShader = gpuCompute.createShaderMaterial( document.getElementById( 'smoothFragmentShader' ).textContent, { smoothTexture: { value: null } } );

        // Create compute shader to read water level
        this.readWaterLevelShader = this.gpuCompute.createShaderMaterial( 
            read_frag, {
            point1: { value: new THREE.Vector2() },
            levelTexture: { value: null }
        } );
        this.readWaterLevelShader.defines.WIDTH = this.WIDTH.toFixed( 1 );
        this.readWaterLevelShader.defines.BOUNDS = this.BOUNDS.toFixed( 1 );

        // Create a 4x1 pixel image and a render target (Uint8, 4 channels, 1 byte per channel) to read water height and orientation
        this.readWaterLevelImage = new Uint8Array( 4 * 1 * 4 );

        this.readWaterLevelRenderTarget = new THREE.WebGLRenderTarget( 4, 1, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
            depthBuffer: false
        } );

    }

    setAmplitude(a:number){
        this.uniforms['amplitude'].value = a;
    }

    setAttenuation(a:number){
        this.uniforms['attenuation'].value = a;
    }


    startMusic(){
        
        //this.attenuation=0.97;
        //this.isFirst=false;

    }

    startMoriagari(){
        
        /*
        this.attenuation=0.99;

        window.setTimeout(()=>{
            this.isMoriagari = true;            
        },100);
        const uniforms = this.heightmapVariable.material.uniforms;
            uniforms[ 'mousePos' ].value.set(
                1000*(Math.random()-0.5), 
                1000*(Math.random()-0.5)
            );*/
        
    }

    update(audio:MyAudio){

        //console.log(this.attenuation);

        // Set uniforms: mouse interaction
        const uniforms = this.heightmapVariable.material.uniforms;

        //uniforms['attenuation'].value=this.attenuation;

        //if(this.isImpulse){

        //if(this.isFirst || this.isMoriagari){
        if(true){

            let limit:number = this.isFirst ? 0.02 : 0;


            //console.log(audio.isReady);
            //if(audio.isReady) console.log(audio.mSubFreqs[3]>0);


            if(audio.isReady && audio.mSubFreqs[3]>0){
                //uniforms['amplitude'].value = audio.mSubFreqs[3]/10;//1.28;//20*Math.random();//ここの大きさが小さすぎる
                //uniforms['mouseSize'].value = 20;//ここの大きさが小さすぎる
                uniforms[ 'mousePos' ].value.set(
                    1000*(Math.random()-0.5), 
                    1000*(Math.random()-0.5)
                );    
            }else{
                uniforms[ 'mousePos' ].value.set(
                    10000,
                    10000
                );    
            }
        }

        this.testMat.map=
        this.gpuCompute.getCurrentRenderTarget( this.heightmapVariable ).texture;


        // Do the gpu computation
        this.gpuCompute.compute();

        // Get compute output in custom uniform
        //this.waterUniforms[ 'heightmap' ].value = 
        // this.gpuCompute.getCurrentRenderTarget( this.heightmapVariable ).texture;

    }
    
    


}

export {MyGPU};