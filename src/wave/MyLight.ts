import * as THREE from 'three';
import { DataManager } from '../data/DataManager';

class MyLight{


    light:THREE.DirectionalLight;

    init(s:THREE.Scene){


        this.light = new THREE.DirectionalLight(0xffffff);
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
                
                this.light.position.x = 5+gamma;
                this.light.position.y = -10+beta;
                this.light.position.z = 10;

            }, true);

        }

    }



}

export {MyLight};