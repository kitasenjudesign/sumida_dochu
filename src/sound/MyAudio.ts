import * as THREE from 'three';
import { DataManager } from '../data/DataManager';
import { Params } from '../data/Params';

class MyAudio{

    SMOOTHING:number = 0.5;
    FFT_SIZE:number = 128;
    FFT_MATOME:number=8;

    //maxValue:number=0.1;
    context:AudioContext;
    analyser:AnalyserNode;
    gain:GainNode;

    source:AudioBufferSourceNode;
    freqs :Uint8Array;
    mFreqs:Uint8Array;
    mSubFreqs:Int8Array;
    mOldFreqs:Uint8Array;
    times :Uint8Array;

    waveVolume:number=0;
    bars:Array<THREE.Mesh>;
    isReady:boolean=false;

    volumeTarget:number=0;

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
            gui.add(this,"currentTime").name("currentTime").listen();
            gui.add(this.source.buffer,"duration");
            gui.add(this,'pause');
            gui.add(this,'resume');
            gui.add(Params,"SOUND_OFFSET",0,120);
            
            this.callback();

          });
        };

        //this.source.connect(this.context.destination);

        this.gain = this.context.createGain();   
        this.source.connect(this.gain);
        this.gain.connect(this.context.destination);        
        this.gain.gain.value=0;

        this.context.suspend();


        //////

        this.bars=new Array<THREE.Mesh>;
        for(let i=0;i<this.FFT_SIZE/this.FFT_MATOME;i++){

          this.bars[i]=new THREE.Mesh(
            new THREE.BoxGeometry(13,300,1,1,1,1),
            new THREE.MeshBasicMaterial({color:0xff0000})
          );

          this.bars[i].position.set(
            14*(i),
            0,
            300
          );
          
          //scene.add(this.bars[i]);

        }
        
    }

    play(){
      this.source.start(0,Params.SOUND_OFFSET);
      this.volume = Params.MAX_VOLUME;
      this.source.loop = true;
      this.context.resume();
    }

    set volume(v:number){
      this.gain.gain.value=v;
    }

    updateVolumeByScroll(){

      if( window.scrollY < 200 ){
        this.volumeTarget+=(Params.MAX_VOLUME-this.volumeTarget)/10;
        
      }else{
        this.volumeTarget+=(Params.MIN_VOLUME-this.volumeTarget)/10;

      }

      this.volume=this.volumeTarget;

    }

    update(){

      if(this.freqs==null) return;

      this.updateVolumeByScroll();

      this.analyser.smoothingTimeConstant = this.SMOOTHING;
      this.analyser.fftSize = this.FFT_SIZE;
      this.analyser.getByteFrequencyData(this.freqs);
      //this.analyser.getByteTimeDomainData(this.times);

      this.waveVolume=0;
      /*
      for(let i=0;i<this.FFT_SIZE;i++){
        this.volume += this.freqs[i]/this.FFT_SIZE;
        this.bars[i].scale.y = this.freqs[i]/300;
      }*/
      for(let i=0;i<this.FFT_MATOME;i++){
        this.waveVolume += this.mFreqs[i]/this.FFT_MATOME;
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

    }

    
    pause(){
      this.context.suspend();
    }

    resume(){
      this.context.resume();
    }


    reset(){
      
      this.source.loopEnd=0.01;
      setTimeout(()=>{
        this.source.loopEnd=this.source.buffer.duration;
      },10);

    }

    get currentTime(): number {

      if(this.source==null)return 0;
      if(this.source.buffer==null) return 0;
      if(this.context==null)return 0;

      let currentTime:number = this.context.currentTime+Params.SOUND_OFFSET;
      let total:number = this.source.buffer.duration;// + Params.SOUND_OFFSET;

      return currentTime % total;
    }

    get duration():number{
      if(this.source==null)return 0;
      if(this.source.buffer==null) return 0;
      if(this.context==null)return 0;      
      return this.source.buffer.duration;
    }

    getFFT():number{
      if(this.times==null) return 0;
      return this.waveVolume;
    }

}

export {MyAudio};

//https://codepen.io/ZachSaucier/pen/bBJmbz