// three.jsライブラリのインポート
import * as THREE from 'three';
import { MyMesh } from "./MyMesh";
import { MyGPU } from "./MyGPU";
import { MyThreeMain } from "./main/MyThreeMain";

import { MyWaveMesh } from "./MyWaveMesh";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'


window.addEventListener('DOMContentLoaded', () => {
 //
    const hoge = new MyThreeMain();
    hoge.init();

    window.addEventListener('resize', onWindowResize, false)
    onWindowResize();
    function onWindowResize() {
        document.getElementById("contents").style.top=window.innerHeight+"px";
        document.getElementById("footer").style.top=window.innerHeight+"px";
    }

});



