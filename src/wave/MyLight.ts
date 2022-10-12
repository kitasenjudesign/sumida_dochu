import * as THREE from 'three';
import { DataManager } from '../data/DataManager';

class MyLight{


    light:THREE.DirectionalLight;

    rad:number = 0;
    amp:number = 10;

    init(s:THREE.Scene){


        this.light = new THREE.DirectionalLight(0xffffff,1);
        this.light.position.set(5,-10,10);
        s.add(this.light); 

        const light2:THREE.AmbientLight = new THREE.AmbientLight(0x555555);
        s.add(light2);


        if( DataManager.getInstance().isSp ){

            window.addEventListener("deviceorientation", (event)=>{

                let absolute = event.absolute;
                let alpha    = event.alpha;
                let beta     = event.beta;
                let gamma    = event.gamma;

                //beta	x軸を中心にしたデバイスの動きを表す	値：-180～180の範囲の値による度数
                //gamma	y軸を中心にしたデバイスの動きを表す	値：-90～90の範囲の値による度数
                
                this.rad = gamma/90*2*Math.PI*0.5;

                this.light.position.set(
                    this.amp*Math.cos(this.rad),
                    this.amp*Math.sin(this.rad),
                    this.amp
                );
                
                console.log(this.rad);
                console.log(this.light.position);
//window.alert("hoge");

            }, true);

        }

    }



}

export {MyLight};