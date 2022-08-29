import { MyAudio } from "../sound/MyAudio";
import { MyGPU } from "../wave/MyGPU";
import { MyWaveMesh } from "../wave/MyWaveMesh";
import { Main } from "./Main"
import { KeyFrame } from "./KeyFrame"
class MyTimeline{

    audio:MyAudio;
    myGPU:MyGPU;
    myWaveMesh:MyWaveMesh;
    frames:Array<KeyFrame>;
    past:number=0;

    init(main:Main){

        this.audio      = main.audio;
        this.myWaveMesh = main.myWaveMesh;
        this.myGPU      = main.myGPU;

        this.frames=[];

        this.frames.push(
            new KeyFrame(10,()=>{this.hoge1(1)}),
            new KeyFrame(20,()=>{this.hoge1(2)}),
            new KeyFrame(30,()=>{this.hoge1(3)}),
            new KeyFrame(46,()=>{this.hoge1(3)})
        );

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

    update(){
        
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