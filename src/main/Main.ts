import * as THREE from 'three';
import { MyGPU } from "../wave/MyGPU";
import { MyAudio } from "../sound/MyAudio";

import { MyWaveMesh } from "../wave/MyWaveMesh";
import { MyTimeline } from "./MyTimeline";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'
import { EnterPanel } from './EnterPanel';
import { DataManager } from '../data/DataManager';
import { ImageManager } from '../data/ImageManager';
import { Params } from '../data/Params';


class Main{

    renderer:THREE.WebGLRenderer;
    scene:THREE.Scene;
    camera:THREE.PerspectiveCamera;
    myGPU:MyGPU;
    myWaveMesh:MyWaveMesh;

    enter:HTMLElement;
    enterOffsetY:number=0;
    isStart:boolean=false;

    stats:Stats;
    isDebug:boolean;

    audio:MyAudio;
    timeline:MyTimeline;
    enterPanel:EnterPanel;

    init(){
        this.enterPanel = new EnterPanel();
        this.stats = Stats();
        document.body.appendChild(this.stats.dom);
       
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#webgl')
        });

         DataManager.getInstance().init();
         DataManager.getInstance().domElement=this.renderer.domElement;

         this.renderer.setClearColor(new THREE.Color(0x00469b));
         this.renderer.setSize(window.innerWidth,window.innerHeight);
         this.scene = new THREE.Scene();
         this.camera = new THREE.PerspectiveCamera(20, 640/480, 1, 10000);
         this.camera.position.set(0,0,700); 
       
         //const myMesh = new MyMesh();
         //scene.add( myMesh.mesh );
         this.myGPU = new MyGPU();
         this.myGPU.init();
         this.myGPU.initWater(this.renderer);
         //scene.add(myGPU.testMesh);
         
         //光
         const light:THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
         light.position.set(5,-10,10);
         this.scene.add(light); 
         const light2:THREE.AmbientLight = new THREE.AmbientLight(0x555555);
         this.scene.add(light2);
       
       
         //const controls = new OrbitControls(this.camera, this.renderer.domElement);
         if(document.getElementById("contents")!=null){
            document.getElementById("contents").style.display = "none";
         }

         
         
         this.audio = new MyAudio();
         this.audio.init(this.scene,()=>{
             this.onLoadSound();
         });

         
         // 毎フレーム更新関数を実行
         this.tick();
       
         window.addEventListener('resize', ()=>{
            this.onWindowResize();
         }, false)
         this.onWindowResize();
    }

    onLoadSound(){
        
        console.log("ON_LOAD!!!! ");

        ImageManager.getInstance().loadImages(
            ()=>{
                this.onLoadImages();
            }
        );
        this.onWindowResize();
    }

    onLoadImages(){
        
        this.enterPanel.init(()=>{
            this.playSound();
        });
        
        let t = document.getElementById("enterText");
        if(t){
            t.innerText="見る";
        }
        this.onWindowResize();

    }

    playSound(){

        this.myWaveMesh = new MyWaveMesh();
        this.myWaveMesh.init();
        this.scene.add( this.myWaveMesh.waterMesh );
    
        this.timeline = new MyTimeline();
        this.timeline.init(this);
        this.timeline.start();
        
        if(document.getElementById("contents")!=null){
            document.getElementById("contents").style.display = "block";
        }

        this.onWindowResize();

    }


    tick(){

        this.enterPanel?.update();

        if(this.audio!=null){
            this.audio.update();
            this.myGPU.update(this.audio);
        }

        this.myWaveMesh?.update(this.myGPU.testMat.map);
    
        // 描画
        this.renderer.render(this.scene, this.camera);
        this.stats.update();

        //
        //console.log("update");
        this.timeline?.update();

        //loop
        window.requestAnimationFrame(()=>{
            this.tick();
        });        

        
    }


    onWindowResize(){

        const fovRad = (this.camera.fov / 2) * (Math.PI / 180);//角度
        let distance = (window.innerHeight / 2) / Math.tan(fovRad);//距離
        this.camera.position.set(0,0,distance);//距離を指定
        //let scale:number = window.innerHeight/100;//大きさ指定
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if(this.myWaveMesh){

            let scale:number = window.innerWidth/this.myWaveMesh.BOUNDS;//大きさ指定
        
            if(window.innerWidth<window.innerHeight){
                scale = window.innerHeight/this.myWaveMesh.BOUNDS;
            }
            scale *= Params.ZOOM;//1.2;
    
            this.myWaveMesh.waterMesh.scale.set(
                scale,scale,1
            );
    
        }

        

        this.enterPanel?.resize();
        
    }

}

export {Main};