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

    rotN:number = -Math.PI/4;
    rotV:number = Math.PI/2;
    rotH:number = 0;//Math.PI/4;

    init(main:Main){
        
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

            //最初のドン、どどん
            new KeyFrame(1,()=>{this.firstDon()}),//ドン４
            new KeyFrame(3.8,()=>{this.firstDon()}),//ドン４
            new KeyFrame(6.64,()=>{this.firstDon()}),
            new KeyFrame(9.13,()=>{this.firstDon()}),
            new KeyFrame(11.9,()=>{this.firstDon()}),
            new KeyFrame(14.4,()=>{this.firstDon()}),
            new KeyFrame(17.3,()=>{this.firstDon()}),
            new KeyFrame(19.7,()=>{this.firstDon()}),

            //チンチンチチチン
            new KeyFrame(21.2,()=>{this.firstGlitch(0.2,3,this.rotN);this.myWaveMesh.blink();}),
            new KeyFrame(21.5,()=>{this.firstGlitch(0.3,6,this.rotN)}),
            new KeyFrame(21.8,()=>{this.firstGlitch(0.4,12,this.rotN)}),
            new KeyFrame(22.0,()=>{this.firstGlitch(0.5,24,this.rotN)}),
            new KeyFrame(22.2,()=>{this.firstGlitch(0.6,48,this.rotN);}),


            new KeyFrame(22.3,()=>{this.moriagariA()}),
            new KeyFrame(22.4,()=>{this.moriagariForceImpulse(20,5)}),

//            new KeyFrame(30.0,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(33.0,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(35.0,()=>{this.moriagariForceImpulse(20,5)}),

            new KeyFrame(46.12,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(48.74,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(51.29,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(53.86,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(56.71,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(59.38,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(61.92,()=>{this.moriagariForceImpulse(20,5)}),

            //いっせーのっせ
            new KeyFrame(63.1,()=>{this.firstGlitch(0.2,4,-this.rotN);this.myWaveMesh.changeTex();}),
            new KeyFrame(63.6,()=>{this.firstGlitch(0.4,8,-this.rotN);this.myWaveMesh.changeTex();}),
            new KeyFrame(63.95,()=>{this.firstGlitch(0.8,16,-this.rotN);}),
            new KeyFrame(64.2,()=>{this.resetGlitch();this.myWaveMesh.changeTex();}),
            
            //トリッキー
            new KeyFrame(75.09,()=>{this.moriagariForceImpulse(20,5)}),
                                  
            new KeyFrame(79.1,()=>{this.firstGlitch(1,24,20);}),
            new KeyFrame(79.5,()=>{this.firstGlitch(0.5,36,20);}),
            new KeyFrame(79.8,()=>{this.resetGlitch();this.myWaveMesh.changeTex();}),
            //おい
            new KeyFrame(80.26,()=>{this.moriagariForceImpulse(20,5)}),  
           

            //トリッキー
            new KeyFrame(90.59,()=>{this.moriagariForceImpulse(20,5)}),

            new KeyFrame(94.7,()=>{this.firstGlitch(1,24,80);}),
            new KeyFrame(95.0,()=>{this.firstGlitch(0.5,36,80);}),
            new KeyFrame(95.3,()=>{this.resetGlitch();this.myWaveMesh.changeTex();}),
            //おい
            new KeyFrame(95.8,()=>{this.moriagariForceImpulse(20,5)}),


            //トリッキー
            new KeyFrame(105.0,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(110.0,()=>{this.moriagariForceImpulse(20,5)}),

            new KeyFrame(110.2,()=>{this.firstGlitch(1,24,0);}),
            new KeyFrame(110.5,()=>{this.firstGlitch(0.5,36,0);}),
            new KeyFrame(110.8,()=>{this.resetGlitch();this.myWaveMesh.changeTex();}),
            
            //おい
            new KeyFrame(111.25,()=>{this.moriagariForceImpulse(20,5)}),
            new KeyFrame(116.71,()=>{this.moriagariForceImpulse(20,5)}),


            new KeyFrame(116.4,()=>{this.startFinal();this.firstGlitch(1,24,Math.PI/3);})
        );

    }

    first(){
        //強さはどうにかする
        console.log("first");        
        this.myWaveMesh.glitchTween();
        this.myGPU.setAmplitude(0);
        this.waveCon.setAutoImpulse(1);
        this.waveCon.setMode(WaveController.MODE_MANUAL);
    }

    firstDon(){
        //this.myGPU.setMouseSize(30);
        //this.myGPU.setAmplitude(1);
        this.waveCon.setMode(WaveController.MODE_MANUAL);
        this.waveCon.addImpuse(
            200*(Math.random()-0.5),
            200*(Math.random()-0.5),
            30,
            1.5
        );
    }

    //
    firstGlitch(n:number,s:number,rad:number){
        this.myWaveMesh.glitch(n,s,rad);
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

    startFinal(){
        this.waveCon.setAutoImpulse(3);
        this.myWaveMesh.glitchTweenFinal(20);
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

        console.log("RESET");

        for(let i=0;i<this.frames.length;i++){
            this.frames[i].reset();
        }
        //全て終わったらリセットする

    }

    update(){
        
        this.waveCon.update();

        let currentTime = this.audio.currentTime;

        //すごく大きい値が変化してたら、曲が頭に戻ったということなのでリセット
        if(this.past-currentTime>this.audio.duration*0.9){
            this.reset();
        }else{
            if(currentTime==0)return;
        }


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