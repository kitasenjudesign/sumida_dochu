import { Params } from "../data/Params";

class DOMResizer{


    pastHeight:number=0;

    contents:HTMLElement;
    footer:HTMLElement;

    init(){

        this.contents = document.getElementById(Params.CONTENTS);
        this.footer = document.getElementById(Params.FOOTER);

    }

    checkHeight():boolean{


        if(window.innerHeight!=this.pastHeight){
            return true;
        }

        this.pastHeight = window.innerHeight;

        return false;

    }

    resize(){

        this.contents.style.top=window.innerHeight+"px";
        this.footer.style.height=window.innerHeight+"px";
        //console.log(this.footer.style.height + " / " + window.innerHeight);
    }


}

export {DOMResizer};
