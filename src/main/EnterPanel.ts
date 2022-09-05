import { DataManager } from "../data/DataManager";

class EnterPanel{

    enter       :HTMLElement;
    enterBtn    :HTMLElement;

    callback:()=>void;
    enterOffsetY:number=0;
    isEnter:boolean=false;
    
    currentMouseX:number=0;
    currentMouseY:number=0;


    init(callback:()=>void){

        this.callback = callback;

        this.enter = document.getElementById("enter");

        this.enterBtn = document.getElementById("enterBtn");
        this.enterBtn.style.position="absolute";
          
        

        let sp:boolean = DataManager.getInstance().isSp;

        if(sp){
            //this.callback();
        }else{

            DataManager.getInstance().domElement.addEventListener('click', ()=>{
                this.isEnter=true;
                this.enterBtn.style.display="none";

                if(this.callback!=null) this.callback();
                this.callback=null;
            });

            /*
            this.enter.onclick = ()=>{
                //this.playSound();
            };*/
        }

    }

    update(){

        if(this.isEnter){
            this.enterOffsetY+=-0.6;
        }
        if(this.enterBtn){
            this.currentMouseX+=(DataManager.getInstance().mouseX-this.currentMouseX)/10;
            this.currentMouseY+=(DataManager.getInstance().mouseY-this.currentMouseY)/10;

            let ww:number = this.enterBtn.clientWidth;
            this.enterBtn.style.left= (this.currentMouseX-ww/2)+"px";
            this.enterBtn.style.top = (this.currentMouseY-50)+"px";
        }

        //console.log(this.enterOffsetY);
        if(this.enter){
            this.enter.style.top    =
            (window.innerHeight/2-this.enter.clientHeight/2+this.enterOffsetY)+"px";
        }
    }

    resize(){

        if(!this.enter){
            this.enter = document.getElementById("enter");
        }

        this.enter.style.cursor='pointer';
        this.enter.style.position="absolute"
        this.enter.style.zIndex="999";
        this.enter.style.top    =
        (window.innerHeight/2-this.enter.clientHeight/2+this.enterOffsetY)+"px"
        this.enter.style.left   =(window.innerWidth/2-this.enter.clientWidth/2)+"px"
        
    }
}

export {EnterPanel};