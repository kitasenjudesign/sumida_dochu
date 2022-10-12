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
import { MyLight } from '../wave/MyLight';
import { DOMResizer } from './DOMResizer';
import { EnvTestMesh } from '../wave/EnvTestMesh';


class Main{

    renderer:THREE.WebGLRenderer;
    scene:THREE.Scene;
    camera:THREE.PerspectiveCamera;
    myGPU:MyGPU;
    myWaveMesh:MyWaveMesh;
    myLight:MyLight;
    domResizer:DOMResizer;
    dataManager:DataManager;

    enter:HTMLElement;
    enterOffsetY:number=0;
    isStart:boolean=false;

    stats:Stats;
    isDebug:boolean;
    clock:THREE.Clock;

    audio:MyAudio;
    timeline:MyTimeline;
    enterPanel:EnterPanel;
    isSP:boolean=false;
    oldTime:number=0;
    counter:number=0;
    //mostBottom:number=0;

    init(){
        
        this.domResizer=new DOMResizer();
        this.domResizer.init();

        this.enterPanel = new EnterPanel();
        this.enterPanel.init0();
        //this.stats = Stats();
        //document.body.appendChild(this.stats.dom);
       this.clock = new THREE.Clock(true);
       this.clock.start();
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#webgl'),
            antialias: false
        });

         //DataManager.getInstance().domElement=
        this.dataManager = DataManager.getInstance();
        this.dataManager.init(this);

        this.isSP = this.dataManager.isSp;

        console.log("pixelRatio "+window.devicePixelRatio);
        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(new THREE.Color(0x00469b));
        this.renderer.setSize(window.innerWidth,window.innerHeight);
         
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(20, 640/480, 1, 10000);
        this.camera.position.set(0,0,700); 
       
         this.myGPU = new MyGPU();
         this.myGPU.init();
         this.myGPU.initWater(this.renderer);
         //scene.add(myGPU.testMesh);
         
         //光
         this.myLight = new MyLight();
         this.myLight.init(this.scene);
       
       
         //const controls = new OrbitControls(this.camera, this.renderer.domElement);
         if(document.getElementById(Params.CONTENTS)!=null){
            document.getElementById(Params.CONTENTS).style.display = "none";
         }

        let m = new EnvTestMesh();
        m.init(this.scene);


         // 毎フレーム更新関数を実行
         this.tick();
         this.loadImages();
       
         window.addEventListener('resize', ()=>{
            this.onWindowResize();
         }, false)
         this.onWindowResize();

    }

    //画像をロードする
    loadImages(){
        ImageManager.getInstance().loadImages(
            ()=>{
                this.onLoadImages();
            }
        );
        this.onWindowResize();
    }

    //画像をロードした
    onLoadImages(){
        console.log("onLoadImg");
        
        this.myWaveMesh = new MyWaveMesh();
        this.myWaveMesh.init();
        this.scene.add( this.myWaveMesh.waterMesh );

        this.audio = new MyAudio();
        this.audio.init(this.scene,()=>{
            this.onLoadSound();
        });

        this.timeline = new MyTimeline();
        this.timeline.init(this);//開始する

        this.onWindowResize();


        
        

    }

    //サウンドロード
    onLoadSound(){
        
        console.log("onLoadSound");
        this.enterPanel.show(()=>{
            this.playSound();
        });

        this.onWindowResize();
        
    }

    

    playSound(){

        this.myWaveMesh.blink(0.1);
        this.timeline.start();        
        if(document.getElementById(Params.CONTENTS)!=null){
            document.getElementById(Params.CONTENTS).style.display = "block";
        }
        this.onWindowResize();

    }


    tick(){

        //console.log(this.clock.getDelta());
        //0.0215
        //Main.ts:161 0.0085
        //Main.ts:161 0.017


        if(this.clock.getElapsedTime()-this.oldTime>=1/100){

            this.oldTime=this.clock.getElapsedTime();
            this.dataManager.update();

            if( this.domResizer.checkHeight()){
                this.onWindowResize();
            }
    
            this.enterPanel?.update();
    
            if(this.audio!=null){
                if(this.dataManager.scrollMode==Params.MODE_HIGH){
                    if(this.counter%2==1) this.audio.update();
                }else{
                    if(this.counter%4==1) this.audio.update();
                }
                this.myGPU.update(this.audio);
            }
    
            // 描画
            if(this.dataManager.scrollMode==Params.MODE_HIGH){
                this.renderer.render(this.scene, this.camera);
                this.myWaveMesh?.update(this.myGPU.testMat.map);
            }else{
                if(this.counter%2==0){
                    this.renderer.render(this.scene, this.camera);
                    this.myWaveMesh?.update(this.myGPU.testMat.map);
                }
            }
            
            this.stats?.update();
            this.timeline?.update();
            this.counter++;
        }
        

//resizeチェック

        

        //loop
        window.requestAnimationFrame(()=>{
            this.tick();
        });        

    }


    onWindowResize(){

        this.domResizer?.resize();

        const fovRad = (this.camera.fov / 2) * (Math.PI / 180);//角度
        let distance = (window.innerHeight / 2) / Math.tan(fovRad);//距離
        this.camera.position.set(0,0,distance);//距離を指定
        //let scale:number = window.innerHeight/100;//大きさ指定
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if(this.myWaveMesh){

            //左右に合うようなスケール
            let scale:number = window.innerWidth/this.myWaveMesh.BOUNDS;//大きさ指定
        
            //上下に合うようなスケール
            if(window.innerWidth<window.innerHeight){
                scale = window.innerHeight/this.myWaveMesh.BOUNDS;
            }

            //少し大きくする
            scale *= Params.ZOOM;//1.2;
    
            this.myWaveMesh.waterMesh.scale.set(
                scale,scale,1
            );
    
        }

        this.enterPanel.resize();
        
    }

}

export {Main};