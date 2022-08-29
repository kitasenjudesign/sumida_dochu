class KeyFrame{

    time:number;
    flag:boolean=false;
    callback:()=>void;

    constructor(time:number,callback:()=>void){
        this.time = time;
        this.callback = callback;
        this.flag=false;
    }


    doCallback(){
        if(!this.flag)this.callback();
        this.flag=true;
    }

    update(){

    }

    reset(){
        this.flag=false;
    }

}

export {KeyFrame};