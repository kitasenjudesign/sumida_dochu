import * as THREE from 'three';
import { MeshPhongMaterial, MeshPhongMaterialParameters } from 'three';
import hoge_frag from "./glsl/hoge.frag";
import hoge_vert from "./glsl/hoge.vert";
import { MyMat } from "./MyMat";

class MyMesh{
    
    mesh:THREE.Mesh;
    material:THREE.Material;
    geo:THREE.PlaneGeometry;

	MAX_X:number = 120;// 100; 
	MAX_Y:number = 120;// 100;

    velocity    :Array<number>;
    positions   :Array<number>;
    _k:number=0.1;
    _attenuation:number = 0.98;


    constructor() {

        const myMat = new MyMat();
        myMat.init();

        const material = myMat.material;


        // 上記のボックスジオメトリとマテリアルを使ってメッシュを生成
        this.geo                   = new THREE.PlaneBufferGeometry(
            700, 
            700, 
            this.MAX_X-1, 
            this.MAX_Y-1
        );
        this.mesh                  = new THREE.Mesh( 
            this.geo, 
            material
        );
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = false;
        //this.material = new THREE.MeshBasicMaterial();

        //console.log(this.geo);


        this.velocity = [];
        this.positions = []
        for(let i=0;i<this.MAX_X*this.MAX_Y;i++){
            this.velocity[i] = 0;
            this.positions[i] = 0;
        }



    }

	_getIndex(i:number, j:number):number{
		
		return j * (this.MAX_X) + i % (this.MAX_X);
		
	}

    update(){


        for ( let i=1; i<this.MAX_X - 1; i++ ) {
            for ( let j=1; j<this.MAX_Y - 1; j++ ) {
				
				//5ten 
				var bottom:number = this._getIndex(i, j-1); // (j - 1) * (MAX_X) + i % (MAX_X);
				var top:number =this. _getIndex(i, j+1); //(j+1) * (MAX_X) + i % (MAX_X);
				var left:number = this._getIndex(i-1, j); //j * (MAX_X) + (i-1) % (MAX_X);
				var right:number = this._getIndex(i+1, j); //j * (MAX_X) + (i+1) % (MAX_X);
				var center:number = this._getIndex(i, j); //j * (MAX_X) + i % (MAX_X);
				
				var aa = 0.9 + 0.1 * Math.cos(i * 0.15 + j * 0.15);
				var bb = 0.9 + 0.1 * Math.cos(i * 0.15 + j * 0.15);

				//位置のラプラシアンから加速度を計算します
                var accelX:number = this.positions[left] - this.positions[center] * 2 + this.positions[right];
				var accelY:number = this.positions[bottom] - this.positions[center] * 2 + this.positions[top];
				var accel:number = aa*accelX + bb* accelY;
				
				//加速度の摩擦的要素です
                accel *= this._k;// * Math.abs( getNoise(i, j, _count * 0.5) ) * 0.1;

                //速度を計算します
                this.velocity[center] = (this.velocity[center] + accel) * this._attenuation;//減衰
				
            }
        }


        if (Math.random() < 0.04){
					
            let xx:number = Math.floor(2 + (this.MAX_X - 4) * Math.random());
            let yy:number = Math.floor(2 + (this.MAX_Y - 4) * Math.random());
            let amp:number = ( 608*(Math.random()-0.5) );
            if(Math.random()<0.5) amp=38*(Math.random()-0.5);
            //amp *= (Math.random() < 0.5) ? 1 : -1;            
            
            let ww:number = 0.5+0.5*Math.random();

            if (Math.random() < 1){
                
                for ( let i=1;i<this.MAX_X - 1;i++ ) {
                    for ( let j=1;j<this.MAX_Y - 1;j++ ) {
                        
                        var dx = i - xx;
                        var dy = j - yy;
                        var dist = 1 + ww * Math.sqrt( dx * dx + dy * dy );
                        
                        this.velocity[this._getIndex(i,j)] += amp / Math.pow(dist,2);
                
                    }
                }                
                
            }else{
                
                //this.positions[this._getIndex(xx, yy)].z = amp;
                
            }
            
        }

        //位置に対して速度をたします
        const count: number = this.geo.attributes.position.count;
        for (let i = 0; i < count; i++) {
            
            this.positions[i] += this.velocity[i];
            this.geo.attributes.position.setZ(i, this.positions[i]);

        }


        this.geo.computeVertexNormals();
        this.geo.attributes.position.needsUpdate = true;
        
    }

}

export {MyMesh};
