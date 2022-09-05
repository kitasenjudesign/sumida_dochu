import { MyAudio } from "../sound/MyAudio";
import { MyGPU } from "../wave/MyGPU";
import { MyWaveMesh } from "../wave/MyWaveMesh";
import { Main } from "./Main"
import { KeyFrame } from "./KeyFrame"
import { DataManager } from "../data/DataManager";
import { WaveController } from "../wave/WaveController";
class MyTimeline{

    audio:MyAudio;
    myGPU:MyGPU;
    waveCon:WaveController;
    myWaveMesh:MyWaveMesh;
    frames:Array<KeyFrame>;
    past:number=0;


    init(main:Main){


        //20 てんてけ
        //43 てぃんてぃんー
        //65 いっせーのっせ
        
        this.waveCon    = new WaveController();
        this.waveCon.init(main);
        this.audio      = main.audio;
        this.myWaveMesh = main.myWaveMesh;
        this.myGPU      = main.myGPU;

        DataManager.getInstance().gui.add(
            this,"reset"
        );

        this.frames=[];

        this.frames.push(
            new KeyFrame(0.2,()=>{this.first()}),

            new KeyFrame(1,()=>{this.firstDon()}),//ドン４
            new KeyFrame(3.8,()=>{this.firstDon()}),//ドン４
            new KeyFrame(6.5,()=>{this.firstDon()}),
            new KeyFrame(9,()=>{this.firstDon()}),
            new KeyFrame(11.5,()=>{this.firstDon()}),
            new KeyFrame(14.5,()=>{this.firstDon()}),
            new KeyFrame(17,()=>{this.firstDon()}),
            new KeyFrame(20,()=>{this.firstDon()}),

            //チンチンチチチン
            new KeyFrame(21.2,()=>{this.firstGlitch(0.1,4);this.myWaveMesh.blink();}),
            new KeyFrame(21.5,()=>{this.firstGlitch(0.1,8)}),
            new KeyFrame(21.8,()=>{this.firstGlitch(0.2,16)}),
            new KeyFrame(22.0,()=>{this.firstGlitch(0.3,32)}),
            new KeyFrame(22.2,()=>{this.firstGlitch(0.4,64);}),

            new KeyFrame(22.4,()=>{this.moriagariA()}),
//            new KeyFrame(30.0,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(33.0,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(35.0,()=>{this.moriagariForceImpulse(20,5)}),

            new KeyFrame(43.0,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(47.0,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(49.0,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(51.0,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(53.0,()=>{this.moriagariForceImpulse(20,5)}),

            //いっせーのっせ
            new KeyFrame(63.0,()=>{this.firstGlitch(0.10,3);this.myWaveMesh.changeTex();}),
            new KeyFrame(63.4,()=>{this.firstGlitch(0.25,6);this.myWaveMesh.changeTex();}),
            new KeyFrame(63.8,()=>{this.firstGlitch(0.50,32);}),
            new KeyFrame(64.2,()=>{this.resetGlitch();this.myWaveMesh.changeTex();}),
            

//            new KeyFrame(65.0,()=>{this.moriagariB()}),
//            new KeyFrame(65.5,()=>{this.firstDon()}),
//            new KeyFrame(66.0,()=>{this.firstDon()}),

            
            new KeyFrame(75.1,()=>{this.firstGlitch(0.1,3);this.myWaveMesh.changeTex();}),
            //new KeyFrame(75.4,()=>{this.firstGlitch(0.3,6);}),
            new KeyFrame(75.7,()=>{this.firstGlitch(0.5,12);}),
            //new KeyFrame(76.0,()=>{this.firstGlitch(1,24);}),
            new KeyFrame(76.4,()=>{this.firstGlitch(2,48);}),

            new KeyFrame(77.4,()=>{this.firstGlitch(2,48);}),
            
            new KeyFrame(79,()=>{this.firstGlitch(1,24);}),
            //new KeyFrame(79.4,()=>{this.firstGlitch(0.5,12);}),
            new KeyFrame(79.8,()=>{this.firstGlitch(0.5,36);}),

            new KeyFrame(80.4,()=>{this.resetGlitch();this.myWaveMesh.changeTex();}),
           


            //new KeyFrame(80.0,()=>{this.moriagariForceImpulse(20,5)}),
            //new KeyFrame(83.0,()=>{this.moriagariForceImpulse(20,5)}),
            
            
            //new KeyFrame(120.0,()=>{this.moriagariForceImpulse(20,5)}),
            
            new KeyFrame(
                130,
                ()=>{this.reset()})
        );

    }

    first(){
        //強さはどうにかする
        console.log("first");
        this.myGPU.setAmplitude(0);
        this.waveCon.setMode(WaveController.MODE_MANUAL);
    }

    firstDon(){
        //this.myGPU.setMouseSize(30);
        //this.myGPU.setAmplitude(1);
        this.waveCon.addImpuse(
            200*(Math.random()-0.5),
            200*(Math.random()-0.5),
            30,
            1
        );
    }

    //
    firstGlitch(n:number,s:number){
        this.myWaveMesh.glitch(n,s);
    }

    resetGlitch(){
        this.myWaveMesh.blink();
        this.myWaveMesh.glitchTween();
    }

    moriagariA(){
        this.myWaveMesh.blink();
        this.myWaveMesh.glitchTween();
        this.myGPU.setMouseSize(20);
        this.myGPU.setAmplitude(1);
        
        this.waveCon.setMode(WaveController.MODE_AUTO);
    }

    moriagariForceImpulse(size:number,amplitude:number){
        this.waveCon.addForceImpulse(
            200*(Math.random()-0.5),
            200*(Math.random()-0.5),
            size,
            amplitude
        );
    }

    moriagariB(){
        this.myWaveMesh.blink();
    }

    hoge1(index:number){

        console.log(">>>>>>" + index);
        this.myGPU.setAmplitude(index);
        this.myWaveMesh.changeTex();
    }


    start(){
        
        this.audio.play();
        this.myWaveMesh.startScroll();

    }

    reset(){

        for(let i=0;i<this.frames.length;i++){
            this.frames[i].reset();
        }
        //全て終わったらリセットする

    }


    update(){
        
        this.waveCon.update();

        let currentTime = this.audio.currentTime;
        if(currentTime==0)return;

        for(let i=0;i<this.frames.length;i++){
            let t = this.frames[i].time;
            if( this.past<t && t<=currentTime){
                this.frames[i].doCallback();
            }
        }
        //keyframeチェック
        this.past = this.audio.currentTime;

        //this.audio.currentTime

    }

}

export {MyTimeline};