import { DataManager } from "./DataManager";

class Params {

    //DOM開始
    public static ENTER_TITLE   :string = "enterTitle";
    public static ENTER_TITLE_TEXT: string = "enterTitleText";
    public static ENTER_TITLE_LOADING: string = "enterTitleLoading";

    public static ENTER_BTN_IMG   :string = "enterBtnImg";
    public static ENTER_BTN_TEXT   :string = "enterBtnText";
    
    public static ENTER_BTN  :string = "enterBtn";

    public static CONTENTS      :string = "contents";
    public static FOOTER      :string = "footer";
    //DOM終わり


    public static SOUND_OFFSET  :number = 0;
    public static MAX_VOLUME    :number = 0.16;
    public static MIN_VOLUME    :number = 0.02;

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