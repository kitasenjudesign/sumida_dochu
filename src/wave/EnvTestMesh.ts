import * as THREE from 'three';
import { MeshPhongMaterial } from 'three';


class EnvTestMesh{


    mesh        :THREE.Mesh;
    material    :THREE.MeshPhongMaterial;

    init(scene:THREE.Scene){


        return;
        
        const loader = new THREE.CubeTextureLoader();
        loader.setPath( './topimg/' );
        let envMap = loader.load( [ 'a.png', 'a.png', 'a.png', 'a.png', 'a.png', 'a.png' ] );
        envMap.encoding = THREE.sRGBEncoding;
        envMap.mapping = THREE.CubeReflectionMapping;

        this.material = new MeshPhongMaterial({color:0x888888,envMap:envMap});

        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry( 100, 128, 128 ),
            this.material
        );
        

        scene.add(this.mesh);

    }

}

export {EnvTestMesh};