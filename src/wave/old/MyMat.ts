import * as THREE from 'three';
import { MeshPhongMaterial, MeshPhongMaterialParameters } from 'three';
import hoge_frag from "./glsl/hoge.frag";
import hoge_vert from "./glsl/hoge.vert";

class MyMat{

    material:THREE.ShaderMaterial;

    init(){

        const loader = new THREE.TextureLoader();
        const texture = loader.load('./img/img.png');

        const param:MeshPhongMaterialParameters = {};
        let phongShader:THREE.Shader = THREE.ShaderLib.phong;
        let uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
        
        uniforms.map = {
            type: "t",
            value: texture
        };
        uniforms.shininess = {
            type: "f",
            value: 130
        };

        //console.log(phongShader.fragmentShader);

        this.material = new THREE.ShaderMaterial({
            uniforms:       uniforms,
            vertexShader:   hoge_vert,//phongShader.vertexShader,
            fragmentShader: hoge_frag,//phongShader.fragmentShader,
            lights:true//ライトの影響を受けられるように
        });

    }

}


export {MyMat};