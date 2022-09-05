import { MyAudio } from "../sound/MyAudio";
import { MyGPU } from "./MyGPU";
import { Main } from "../main/Main";
import { DataManager } from "../data/DataManager";

class WaveController{


    public static MODE_AUTO: string = "MODE_AUTO";
    public static MODE_MANUAL: string = "MODE_MANUAL";
    public static MODE_INTRO: string = "MODE_INTRO";
    

    myGPU   :MyGPU;
    myAudio :MyAudio;
    mode:string;

    minInterval:number=100;
    pastTime:number=0;
    hasForceImpulse:boolean=false;
    autoImpulseAmplitude:number=1.0;
    autoImpulseSize=20;

    init(main:Main){
        this.myGPU=main.myGPU;
        this.myAudio=main.audio;
        this.mode=WaveController.MODE_INTRO;
    }

    

    setMode(m:string){
        this.mode=m;
    }

    update(){

        //console.log(this.mode);
        if(this.hasForceImpulse){
            this.hasForceImpulse=false;
            return;
        }

        switch(this.mode){
            
            case WaveController.MODE_INTRO:
                this.updateIntro();
                break;
            case WaveController.MODE_AUTO:
                this.updateAuto();                
                break;
            case WaveController.MODE_MANUAL:
                this.updateManual();
                break;

        }
    }

    addForceImpulse(px:number,py:number,size:number,amplitude:number){
        this.hasForceImpulse=true;
        this.addImpuse(px,py,size,amplitude);
    }

    addImpuse(px:number,py:number,size:number,amplitude:number){
        this.myGPU.setMouseSize(size);
        this.myGPU.setAmplitude(amplitude);
        this.myGPU.addImpulse(
            px,py
        );
    }

    updateIntro(){
        this.myGPU.setAmplitude(1);

        if(Math.random()<0.02){
            if(Math.random()<0.5){
                this.myGPU.addImpulse(
                    Math.random()<0.5 ? -256 : 256,
                    256*(Math.random()-0.5)
                );        
            }else{
                this.myGPU.addImpulse(
                    256*(Math.random()-0.5),
                    Math.random()<0.5 ? -256 : 256
                );        
            }
        }
    }

    updateManual(){

    }

    updateAuto(){
        
        if( this.myAudio.mSubFreqs[3]>0.1 ){
            
            if(Date.now()-this.pastTime>this.minInterval){
                
                this.myGPU.setMouseSize(this.autoImpulseSize);
                this.myGPU.setAmplitude(this.autoImpulseAmplitude);

                this.myGPU.addImpulse(
                    0.9*512*(Math.random()-0.5),
                    0.9*512*(Math.random()-0.5)*window.innerHeight/window.innerWidth
                );
                this.pastTime=Date.now();
                //console.log(this.pastTime);
    
            }

        }

    }

    

}


export {WaveController};