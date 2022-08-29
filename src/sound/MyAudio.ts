import * as THREE from 'three';
import { DataManager } from '../data/DataManager';

class MyAudio{

    SMOOTHING:number = 0.5;
    FFT_SIZE:number = 128;
    FFT_MATOME:number=8;
    context:AudioContext;
    analyser:AnalyserNode;
    gain:GainNode;

    source:AudioBufferSourceNode;
    freqs :Uint8Array;
    mFreqs:Uint8Array;
    mSubFreqs:Int8Array;
    mOldFreqs:Uint8Array;
    times :Uint8Array;

    volume:number=0;
    bars:Array<THREE.Mesh>;
    isReady:boolean=false;
    callback:()=>void;

    //fftする
    init(scene:THREE.Scene,callback:()=>void){
        
        this.callback=callback;

        this.context = new AudioContext();
        //let buffer = null;
        this.source = this.context.createBufferSource();

        let request:XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', './sound/seppuku.mp3', true);
        request.responseType = 'arraybuffer';
        request.send();
        
        request.onload = ()=>{
          //start
          var res = request.response;
          this.context.decodeAudioData(res, (buf)=> {
 
            this.source.buffer = buf;
            
            this.analyser = this.context.createAnalyser();
            this.analyser.minDecibels = -140;
            this.analyser.maxDecibels = 0;   
            
            this.source.connect(this.analyser);
            //this.source.connect(this.gain);

            this.freqs = new Uint8Array(this.FFT_SIZE);//this.analyser.frequencyBinCount);
            this.times = new Uint8Array(this.FFT_SIZE);//this.analyser.frequencyBinCount);
            this.mFreqs     = new Uint8Array(this.FFT_SIZE/this.FFT_MATOME);
            this.mSubFreqs  = new Int8Array(this.FFT_SIZE/this.FFT_MATOME);
            this.mOldFreqs  = new Uint8Array(this.FFT_SIZE/this.FFT_MATOME);
            for(let i=0;i<this.mFreqs.length;i++){
              this.mFreqs[i]=0;
              this.mSubFreqs[i]=0;
              this.mOldFreqs[i]=0;
            }
            this.isReady=true;

            let gui = DataManager.getInstance().gui;
            gui.add(this.context,"currentTime").name("currentTime").listen();
      
            this.callback();
          });
        };

        //this.source.connect(this.context.destination);

        this.gain = this.context.createGain();   
        this.source.connect(this.gain);
        this.gain.connect(this.context.destination);        
        this.gain.gain.value=0.1;

        this.bars=new Array<THREE.Mesh>;
        for(let i=0;i<this.FFT_SIZE/this.FFT_MATOME;i++){

          this.bars[i]=new THREE.Mesh(
            new THREE.BoxGeometry(1.5,100,1,1,1,1),
            new THREE.MeshBasicMaterial({color:0xff0000})
          );

          this.bars[i].position.set(
            2*(i),
            0,
            300
          );
          
          scene.add(this.bars[i]);

        }


    }

    play(){
      this.source.start(0);
      this.source.loop=true;
    }

    update(){

      if(this.freqs==null) return;

      this.analyser.smoothingTimeConstant = this.SMOOTHING;
      this.analyser.fftSize = this.FFT_SIZE;
      this.analyser.getByteFrequencyData(this.freqs);
      //this.analyser.getByteTimeDomainData(this.times);

      this.volume=0;
      /*
      for(let i=0;i<this.FFT_SIZE;i++){
        this.volume += this.freqs[i]/this.FFT_SIZE;
        this.bars[i].scale.y = this.freqs[i]/300;
      }*/
      for(let i=0;i<this.FFT_MATOME;i++){
        this.volume += this.mFreqs[i]/this.FFT_MATOME;
        this.bars[i].scale.y = Math.abs(this.mSubFreqs[i])/300;
      }

      //まとめをつくる
      for(let i=0;i<this.FFT_SIZE/this.FFT_MATOME;i++){
        let sum:number=0;
        for(let j=0;j<this.FFT_MATOME;j++){
          sum += this.freqs[i*this.FFT_MATOME+j]/this.FFT_MATOME;
        }

        this.mOldFreqs[i] = this.mFreqs[i];//過去のをいれておく
        this.mSubFreqs[i] =  (sum-this.mFreqs[i]);//現在-過去
        this.mFreqs[i] = Math.floor(sum);//現在

      }

      
      //console.log(
      //  this.mFreqs[3] + "/" + this.mSubFreqs[3] + "/" + this.mOldFreqs[3]
      //);

      //console.log( this.volume );

    }

    update2(){

        /*
        if(this.audio!=null){
            let vol = 1-window.scrollY/500;
            if(vol<0.02)vol=0.02;
            this.audio.volume=vol*0.8;
        }*/

    }


    get currentTime(): number {
      return this.context.currentTime;
    }

    getFFT():number{

      if(this.times==null) return 0;
      return this.volume;

    }

}

export {MyAudio};

//https://codepen.io/ZachSaucier/pen/bBJmbz