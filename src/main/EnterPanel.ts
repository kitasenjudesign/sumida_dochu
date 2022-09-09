import { DataManager } from "../data/DataManager";
import { Params } from "../data/Params";

class EnterPanel{

    enterTitle       :HTMLElement;
    enterBtn    :HTMLElement;
    enterBtnImg    :HTMLElement;
    enterBtnText    :HTMLElement;
    enterTitleText   :HTMLElement;
    enterTitleLoading    :HTMLElement;

    enterImgScale:number=1;
    callback:()=>void;
    enterOffsetY:number=0;
    isEnter:boolean=false;
    
    currentMouseX:number=0;
    currentMouseY:number=0;
    isSp:boolean=true;
    isInit:boolean=false;

    init(callback:()=>void){

        this.callback = callback;
        this.initDoms();

        //ローディング終了時に呼ばれるため
        this.enterTitleLoading.style.display="none";
        this.enterTitleLoading.innerText="";
        
    this.enterTitleText.style.display="inline-block";

        this.isSp = DataManager.getInstance().isSp;

        this.enterBtn.style.display="block";
        this.enterBtn.style.position="absolute";
       
        //画面クリック
        DataManager.getInstance().domElement.addEventListener('click', ()=>{
            this.isEnter=true;
            this.enterBtnText.style.visibility="hidden";

            if(this.callback!=null) this.callback();
            this.callback=null;
        });

    }

    initDoms(){

        if(this.isInit)return;
        this.isInit=true;

        this.enterTitle     = document.getElementById(Params.ENTER_TITLE);
        this.enterBtnImg    = document.getElementById(Params.ENTER_BTN_IMG);
        this.enterBtnText   = document.getElementById(Params.ENTER_BTN_TEXT);
        this.enterBtn       = document.getElementById(Params.ENTER_BTN);
        this.enterTitleText = document.getElementById(Params.ENTER_TITLE_TEXT);
        this.enterTitleLoading = document.getElementById(Params.ENTER_TITLE_LOADING);        
    }


    update(){

        if(this.isEnter){
            this.enterOffsetY+=-0.8;
        }
       
        if(!this.isSp){
            this.moveBtn();
        }else{
            this.updateBtnImgScale(this.isEnter?0:1);
        }
        
        this.resize();

    }



    moveTitle(){
        if(this.enterTitle){
            let yy:number =(window.innerHeight/2-this.enterTitle.clientHeight/2+this.enterOffsetY);
            if(yy>-window.innerHeight/2){
                this.enterTitle.style.top    =yy+"px";
            }
        }
    }
    
    moveBtn(){

        if(this.enterBtn){

            let dx = (DataManager.getInstance().mouseX-this.currentMouseX);
            let dy = (DataManager.getInstance().mouseY-this.currentMouseY);

            this.currentMouseX+=dx/20;
            this.currentMouseY+=dy/20;

            let ww:number = this.enterBtn.clientWidth;

            if(!this.isEnter){
                this.enterBtn.style.left= (this.currentMouseX-ww/2)+"px";
                this.enterBtn.style.top = (this.currentMouseY-50)+"px";    
            }

            //console.log(this.enterOffsetY);
            let scale:number = 0.7;

            if(Math.sqrt(dx*dx+dy*dy)<50 && !this.isEnter){
                scale = 1.1;
                this.enterBtnText.style.visibility="visible";
            }else{
                this.enterBtnText.style.visibility="hidden";
            }
            if(this.isEnter){
                scale=0;
            }

            this.updateBtnImgScale(scale);

        }

    }

    updateBtnImgScale(s:number){

        if(this.enterBtnImg && this.enterBtn.style.display!="none"){
            this.enterImgScale+=(s-this.enterImgScale)/10;
            this.enterBtnImg.style.transform = "scale("+ this.enterImgScale+"," + this.enterImgScale +")";

            if(this.enterImgScale<0.001){
                this.enterBtn.style.display = "none";
            }
        }

    }

    resize(){

        this.initDoms();

        if(this.enterTitle){

            let yy:number = (window.innerHeight/2-this.enterTitle.clientHeight/2+this.enterOffsetY);
            let xx:number = (window.innerWidth/2-this.enterTitle.clientWidth/2);

            this.enterTitle.style.position="absolute";
            this.enterTitle.style.zIndex="999";
            
            if(!this.isSp){
                //PC
                this.enterTitle.style.left   =xx+"px"; 
                this.enterTitle.style.top    =yy+"px";

            }else{
                //SP
                this.enterTitle.style.left   =xx+"px"; 
                this.enterTitle.style.top    =(yy-40)+"px";

                xx = (window.innerWidth/2-this.enterBtn.clientWidth/2);

                this.enterBtn.style.left = xx+"px";
                this.enterBtn.style.top = (yy+240)+"px";
                
            }

        }
        
    }
}

export {EnterPanel};