import { GUI } from 'lil-gui'
import * as THREE from 'three';
import { Main } from '../main/Main';
import { Params } from './Params';

 class DataManager {

    private static instance: DataManager;
    
    public gui:GUI;
    public isSp:boolean;
    public mouseX:number=0;
    public mouseY:number=0;
    public isTouch:boolean=false;
    public domElement:HTMLElement;
    public main:Main;
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

        this.gui = new GUI();
        this.gui.close();
        
        this.domElement = this.main.renderer.domElement;
        this.gui.add(window,"innerHeight").listen();

        this.gui.add(this,"mouseX").listen();
        this.gui.add(this,"mouseY").listen();
        this.gui.add(this,"isTouch").listen();

        //隠す
        this.gui.domElement.style.display="none";

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
                    if(this.gui.domElement.style.display=="none"){
                        this.gui.domElement.style.display="block";
                    }else{
                        this.gui.domElement.style.display="none";
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