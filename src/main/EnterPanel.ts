class EnterPanel{

    enter:HTMLElement;
    callback:()=>void;
    enterOffsetY:number=0;
    

    init(callback:()=>void){

        this.callback = callback;
        this.enter = document.getElementById("enter");
        this.enter.onclick = ()=>{
            //this.playSound();
            this.callback();
        };

        /*
        if(this.isStart){
            this.enterOffsetY-=1;
            this.enter.style.top=
            (window.innerHeight/2-this.enter.clientHeight/2+this.enterOffsetY)+"px"
        }*/

    }

    update(){

    }

    resize(){

        this.enter.style.cursor='pointer';
        this.enter.style.position="absolute"
        this.enter.style.zIndex="999";
        this.enter.style.top    =(window.innerHeight/2-this.enter.clientHeight/2+this.enterOffsetY)+"px"
        this.enter.style.left   =(window.innerWidth/2-this.enter.clientWidth/2)+"px"
        
    }
}

export {EnterPanel};