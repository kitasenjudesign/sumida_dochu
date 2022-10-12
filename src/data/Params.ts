import { DataManager } from "./DataManager";

class Params {

    //DOM開始
    public static ENTER_TITLE   :string = "enterTitle";
    public static ENTER_TITLE_TEXT: string = "enterTitleText";
    public static ENTER_TITLE_LOADING: string = "enterTitleLoading";
    public static ENTER_MUSICIAN:string="enterMusician";

    public static ENTER_BTN_IMG   :string = "enterBtnImg";
    public static ENTER_BTN_TEXT   :string = "enterBtnText";
    
    public static ENTER_BTN  :string = "enterBtn";

    public static CONTENTS      :string = "contents";
    public static FOOTER        :string = "footer";
    public static FOOTER_CENTER :string = "footerCenter";
    //DOM終わり


    public static SOUND_OFFSET  :number = 0;
    public static MAX_VOLUME    :number = 0.4;
    public static MIN_VOLUME    :number = 0.0;


    public static MODE_HIGH :string = "MODE_HIGH";
    public static MODE_LOW  :string = "MODE_LOW";
    

    public static ROT30 :number = -Math.PI/6;//30度
    public static ROT45 :number = -Math.PI/4;//４５ど
    public static ROT60 :number = -Math.PI*2/3;//60
    public static ROT90 :number = Math.PI/2;//90do
    public static ROT0  :number = 0;//Math.PI/4;

    public static get ZOOM():number{
        
        if( DataManager.getInstance().isSp ){
            return 1.3;

            //512/1024が良い感じ
            //scaleが１のとき
            //

        }

        return 1.2;

    }   

}

export {Params};