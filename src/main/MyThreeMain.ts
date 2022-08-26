import * as THREE from 'three';
import { MyMesh } from "../MyMesh";
import { MyGPU } from "../MyGPU";
import { MyWaveMesh } from "../MyWaveMesh";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'

class MyThreeMain{


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
    audio:HTMLAudioElement;

    init(){

       

        this.enter = document.getElementById("enter");
        this.enter.onclick = ()=>{
            this.playSound();
        };


        let phongShader = THREE.ShaderLib.phong;

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);
       
         this.renderer = new THREE.WebGLRenderer({
             canvas: document.querySelector('#webgl')
         });
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
         this.myWaveMesh = new MyWaveMesh();
         this.myWaveMesh.init();
         this.scene.add( this.myWaveMesh.waterMesh );
       
         //GUI
         //const gui = new GUI();
         //const cubeFolder = gui.addFolder('Cube');
         //gui.add(this.myWaveMesh,"changeTex");
         //cubeFolder.add(this, 'isDebug')
         //cubeFolder.add(myMesh.mesh.rotation, 'y', 0, Math.PI * 2)
         //cubeFolder.add(myMesh.mesh.rotation, 'z', 0, Math.PI * 2)
         //cubeFolder.open();
       
         //光
         const light:THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
         light.position.set(5,-10,10);
         this.scene.add(light); 
         const light2:THREE.AmbientLight = new THREE.AmbientLight(0x444444);
         this.scene.add(light2);
       
       
         //const controls = new OrbitControls(this.camera, this.renderer.domElement);
       
        

         document.getElementById("contents").style.display = "none";

       
         // 毎フレーム更新関数を実行
         this.tick();
       
         window.addEventListener('resize', ()=>{
            this.onWindowResize();
         }, false)
         this.onWindowResize();
    }

    playSound(){
        this.audio = new Audio('./sound/sound.mp3');
        this.audio.play();  // 再生
        this.audio.currentTime=18;
        //this.enter.style.visibility='hidden';
        this.myWaveMesh.startIntro();
        this.isStart=true;
        document.getElementById("contents").style.display = "block";
        
        
        this.myGPU.startMusic();
        window.setTimeout(()=>{
            this.myGPU.startMoriagari();
        },20000);

    }


    tick(){

        // キューブの回転を変更
        //myMesh.update();
        this.myGPU.update();
        this.myWaveMesh.update(this.myGPU.testMat.map);
    
        // 描画
        this.renderer.render(this.scene, this.camera);
        this.stats.update();

        if(this.audio!=null){
            let vol = 1-window.scrollY/500;
            if(vol<0.02)vol=0.02;
            this.audio.volume=vol*0.8;
        }

        //
        if(this.isStart){
            this.enterOffsetY-=1;
            this.enter.style.top=(window.innerHeight/2-this.enter.clientHeight/2+this.enterOffsetY)+"px"
        }


        //loop
        window.requestAnimationFrame(()=>{
            this.tick();
        });        
    }


    onWindowResize(){

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.enter.style.cursor='pointer';
        this.enter.style.position="absolute"
        this.enter.style.zIndex="999";
        this.enter.style.top    =(window.innerHeight/2-this.enter.clientHeight/2+this.enterOffsetY)+"px"
        this.enter.style.left   =(window.innerWidth/2-this.enter.clientWidth/2)+"px"
        
    }

}

export {MyThreeMain};