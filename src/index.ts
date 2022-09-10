// three.jsライブラリのインポート
import * as THREE from 'three';
import { MyGPU } from "./wave/MyGPU";
import { Main } from "./main/Main";
import { MyWaveMesh } from "./wave/MyWaveMesh";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'


window.addEventListener('DOMContentLoaded', () => {
 //
    const main = new Main();
    main.init();

});



