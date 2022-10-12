import { GUI } from 'lil-gui'
import * as THREE from 'three';
import { Main } from '../main/Main';
import { Params } from './Params';
import Stats from 'three/examples/jsm/libs/stats.module'

 class DataManager {

    private static instance: DataManager;
    
    public gui:GUI;
    public isSp:boolean;
    public mouseX:number=0;
    public mouseY:number=0;
    public isTouch:boolean=false;
    public domElement:HTMLElement;
    public main:Main;
    public stats:Stats;
    public scrollRatio:number=0;
    public scrollMode:string;
    public allHeight:number=0;
    private isInit:boolean=false;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    public init(m:Main){

        if(this.isInit) return;
        this.isInit=true;

        this.main = m;
        this.scrollMode=Params.MODE_HIGH;

        if( window.location.search == "?debug" ){
            this.gui = new GUI();
            this.stats = Stats();
            document.body.appendChild(this.stats.domElement);
        }

        this.gui?.close();
        
        this.domElement = this.main.renderer.domElement;
        this.gui?.add(window,"innerHeight").listen();

        this.gui?.add(this,"mouseX").listen();
        this.gui?.add(this,"mouseY").listen();
        this.gui?.add(this,"isTouch").listen();

        //隠す
        if(this.gui){
            this.gui.domElement.style.display="none";
        }

        this.isSp = this.isSmartPhone();

        if(!this.isSp){
            //PC
            window.onmousemove = (event)=>{
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
            }
            document.addEventListener('keydown', (event) => {
                const keyName = event.key;
                if(keyName=="d"){
                    if(this.gui){
                        if(this.gui.domElement.style.display=="none"){
                            this.gui.domElement.style.display="block";
                        }else{
                            this.gui.domElement.style.display="none";
                        }    
                    }
                }
            });



        }else{

            window.addEventListener("touchstart", 
                (event)=>{
                    this.isTouch=true;
                    this.mouseX = event.touches[0].clientX;
                    this.mouseY = event.touches[0].clientY;//-window.scrollY;
                }
            )
            /*
            window.addEventListener("touchend", 
                (event)=>{
                    this.isTouch=false;
                    this.mouseX = event.touches[0].clientX;
                    this.mouseY = event.touches[0].clientY;//-window.scrollY;
                }
            )*/

        }

        
        //ここ
        // ウィンドウをフォーカスしたら指定した関数を実行
        window.addEventListener('focus', ()=>{
            console.log('onFOCUS');
            this.main.audio.resume();
        }, false);

        // ウィンドウからフォーカスが外れたら指定した関数を実行
        window.addEventListener('blur', ()=>{
            console.log("onBlur");
            this.main.audio.pause();
        }, false);
        
        //スクロール量
        window.addEventListener('scroll', () => {
            this.allHeight = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
              );

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let mostBottom = this.allHeight - window.innerHeight;
            
            //console.log(
            //    scrollTop + "//"+ window.scrollY + "//" + window.innerHeight 
            //    + "--" + allHeight
            //);

            //console.log(scrollTop+"/"+mostBottom);
            this.scrollRatio = scrollTop/mostBottom;
            if(this.scrollRatio>=1)this.scrollRatio=1;

            //モードもついでに決めよう
            if(scrollTop<window.innerHeight*0.7 || scrollTop>this.allHeight-window.innerHeight*1.4){
                this.scrollMode = Params.MODE_HIGH;
            }else{
                this.scrollMode = Params.MODE_LOW;
            }

            if (scrollTop >= mostBottom) {
                // 最下部に到達したときに実行する処理
                //console.log("一番下");
            }
        });



    }

    startCheckFocus(){

    }


    private isSmartPhone():boolean {
        if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
            return true;
        } else {
            return false;
        }
    }

    public getMouseOnWaveMesh(){

        //if(window.innerWidth/window.innerHeight){
            
        let rx = 2*(this.mouseX/window.innerWidth-0.5);
        let ry = 2*(this.mouseY/window.innerHeight-0.5);

        let aspect = window.innerHeight/window.innerWidth;

        //横
        let xx = rx*(512/2) / Params.ZOOM;
        let yy = ry*(512/2)*aspect / Params.ZOOM;;

        if(window.innerWidth<window.innerHeight){
            aspect=1/aspect;
            xx = rx*(512/2)*aspect / Params.ZOOM;
            yy = ry*(512/2) / Params.ZOOM;;
        }

        return new THREE.Vector3(xx,yy,0);
    }

    public update(){
        this.stats?.update();
    }


    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): DataManager {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
            //DataManager.instance.init();
        }

        return DataManager.instance;
    }

}


export {DataManager};