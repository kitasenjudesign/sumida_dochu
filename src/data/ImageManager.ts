import * as THREE from 'three';
import { DataManager } from './DataManager';

interface ImageData {
    url     : string;
    texture : THREE.Texture;
}

class ImageManager {
    
    private static instance: ImageManager;
    images:ImageData[];
    index:number=0;
    
    callback:()=>void;

    public static imgPC1:string = "./topimg/imgPC1.png";
    public static imgPC2:string = "./topimg/imgPC2.png";
    public static imgEnv:string = "./topimg/env.jpg";
    
    public static imgSP1:string = "./topimg/imgSP1.png";
    public static imgSP2:string = "./topimg/imgSP2.png";
    
    public static getInstance(): ImageManager {
        if (!ImageManager.instance) {
            ImageManager.instance = new ImageManager();
        }

        return ImageManager.instance;
    }

    public loadImages(callback:()=>void){

        this.callback = callback;

        let dataManager:DataManager = DataManager.getInstance();

        if( !dataManager.isSp ){

            this.images = [
                {
                    url:ImageManager.imgPC1,
                    texture:null
                },
                {
                    url:ImageManager.imgPC2,
                    texture:null
                }/*,
                {
                    url:ImageManager.imgEnv,
                    texture:null
                }*/
            ];
        }else{

            this.images = [
                {
                    url:ImageManager.imgSP1,
                    texture:null
                },
                {
                    url:ImageManager.imgSP2,
                    texture:null
                }
            ];

        }

        this.index=0;
        this.loadImg1();
    }

    loadImg1(){

        let loader = new THREE.TextureLoader();
        loader.load(
            this.images[this.index].url as string, (texture:THREE.Texture)=>{
                
                console.log("load img " + this.index);
                //console.log(texture);
                this.images[this.index].texture=texture;
                this.images[this.index].texture.magFilter = THREE.LinearFilter;
                this.images[this.index].texture.minFilter = THREE.NearestFilter;

                this.onLoadImg1();

            }
        );

    }

    onLoadImg1(){
        this.index++;
        if(this.index>=this.images.length){
            this.callback();
        }else{
            this.loadImg1();
        }
    }

}


export {ImageManager};