import { GUI } from 'lil-gui'

 class DataManager {

    private static instance: DataManager;
    
    public gui:GUI;
    public isSp:boolean;
    public mouseX:number=0;
    public mouseY:number=0;
    public domElement:HTMLElement;
    private isInit:boolean=false;
    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    public init(){

        if(this.isInit) return;
        this.isInit=true;

        this.gui = new GUI();
        //this.gui.domElement.style.display="none";

        this.isSp = this.isSmartPhone();

        window.onmousemove = (event)=>{
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        }
 
    }

    private isSmartPhone():boolean {
        if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
            return true;
        } else {
            return false;
        }
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
            DataManager.instance.init();
        }

        return DataManager.instance;
    }

}


export {DataManager};