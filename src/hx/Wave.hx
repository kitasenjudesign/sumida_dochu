package;
import mat.MyShaderMat;
import three.Mesh;
import three.MeshPhongMaterial;
import three.PlaneGeometry;
import three.Vector3;

/**
 * ...
 * @author 
 */
class Wave extends Mesh
{

	public static inline var MAX_X:Int = 120;// 100; 
	public static inline var MAX_Y:Int = 120;// 100;
	
	private var _mat:MyShaderMat;
	private var _geo:PlaneGeometry;
	private var _velocity:Array<Array<Float>>;
	
	// 伝播スピード
    private var _k = 0.19;
    
    // 減衰率
    private var _attenuation = 0.975;
	
	private var _mesh2:Mesh;
	
	private var _count:Float = 0;
	
	public function new() 
	{
		//http://jsdo.it/edo_m18/nuZF
		
		_mat = new MyShaderMat();
		_mat.side = Three.FrontSide;
		_geo = new PlaneGeometry(200, 200*MAX_Y/MAX_X, MAX_X-1, MAX_Y-1);
		
		_velocity = [];
		for (i in 0...MAX_X){
			_velocity[i] = [];
			for (j in 0...MAX_Y){
				_velocity[i][j] = 0;
				_geo.vertices[_getIndex( i, j)].z = 2.0;
			}
		}
		
		
		//_geo.vertices[_getIndex( Math.floor(MAX_X/2), Math.floor(MAX_Y/2))].z = 100;
		_geo.verticesNeedUpdate = true;
		
		super( _geo, _mat );
		
		scale.z = 10;
		
		
		this.receiveShadow = true;
		this.castShadow = true;
	
	}
	
	public function update():Void{
		
        // 波動方程式
        // \frac{1}{s^2} \frac{\delta^2 u}{\delta t^2} = \Delta u
		//trace( getNoise(0, 0, _count * 0.001) );
		
		var pos:Array<Vector3> = _geo.vertices;
		
        for ( i in 1...MAX_X - 1 ) {
            for ( j in 1...MAX_Y - 1 ) {
				

				
				//5ten 
				var bottom:Int = _getIndex(i, j-1); // (j - 1) * (MAX_X) + i % (MAX_X);
				var top:Int = _getIndex(i, j+1); //(j+1) * (MAX_X) + i % (MAX_X);
				var left:Int = _getIndex(i-1, j); //j * (MAX_X) + (i-1) % (MAX_X);
				var right:Int = _getIndex(i+1, j); //j * (MAX_X) + (i+1) % (MAX_X);
				var center:Int = _getIndex(i, j); //j * (MAX_X) + i % (MAX_X);
				
				var aa = 0.5 + 0.5 * Math.cos(_count * 0.1 + i * 0.15 + j * 0.15);
				var bb = 1;// 1 - aa;
				
                var accelX:Float = pos[left].z - pos[center].z * 2 + pos[right].z;
				var accelY:Float = pos[bottom].z - pos[center].z * 2 + pos[top].z;
				var accel:Float = aa*accelX + bb* accelY;
				
				
                accel *= _k;// * Math.abs( getNoise(i, j, _count * 0.5) ) * 0.1;
                _velocity[i][j] = (_velocity[i][j] + accel) * _attenuation;//減衰
				
				//_velocity[i][j] += (0 - pos[idxX0Yp].z) / 300;
				//_velocity[i][j] *= 0.9;
				/*
				if (10< i && i < 30 && 50 < j && j < 70 ){
					pos[_getIndex(i, j)].z = 1;
					 _velocity[i][j] = 0;
				}*/
				
            }
        }

        for ( i in 1...MAX_X - 1 ) {
            for ( j in 1...MAX_Y - 1 ) {
				
                pos[_getIndex(i, j)].z += _velocity[i][j];
		
            }
        }
		
		_count += 0.1;

				
				if (Math.random() < 0.008){
					
					var xx:Int = Math.floor(2 + (MAX_X - 4) * Math.random());
					var yy:Int = Math.floor(2 + (MAX_Y - 4) * Math.random());
					var amp:Float = ( 10+8*Math.random() );
					//amp *= (Math.random() < 0.5) ? 1 : -1;
					
					
					if (Math.random() < 1){
						
						//_velocity[xx][yy] += amp;
						
						for ( i in 1...MAX_X - 1 ) {
							for ( j in 1...MAX_Y - 1 ) {
								
								var dx = i - xx;
								var dy = j - yy;
								var dist = 1 + 2 * Math.sqrt( dx * dx + dy * dy );
								
								_velocity[i][j] += amp / Math.pow(dist,2);
						
							}
						}
						
						/*
						pos[_getIndex(xx-1, yy-1)].z = amp * 0.1;//naname
						pos[_getIndex(xx+0, yy-1)].z = amp * 0.2;
						pos[_getIndex(xx+1, yy-1)].z = amp * 0.1;//naname
						
						pos[_getIndex(xx-1, yy)].z = amp * 0.2;
						pos[_getIndex(xx+0, yy)].z = amp * 0.4;
						pos[_getIndex(xx+1, yy)].z = amp * 0.2;
											
						pos[_getIndex(xx-1, yy+1)].z = amp * 0.1;//naname
						pos[_getIndex(xx+0, yy+1)].z = amp * 0.2;
						pos[_getIndex(xx + 1, yy + 1)].z = amp * 0.1;//naname
						*/
						
						
						/*
						pos[_getIndex(xx-1, yy-1)].z = amp * 0.1;//naname
						pos[_getIndex(xx+0, yy-1)].z = amp * 0.2;
						pos[_getIndex(xx+1, yy-1)].z = amp * 0.1;//naname
						
						pos[_getIndex(xx-1, yy)].z = amp * 0.2;
						pos[_getIndex(xx+0, yy)].z = amp * 0.4;
						pos[_getIndex(xx+1, yy)].z = amp * 0.2;
											
						pos[_getIndex(xx-1, yy+1)].z = amp * 0.1;//naname
						pos[_getIndex(xx+0, yy+1)].z = amp * 0.2;
						pos[_getIndex(xx + 1, yy + 1)].z = amp * 0.1;//naname
						*/
						
					}else{
						
						pos[_getIndex(xx + 0, yy)].z = amp;
						
					}
					
				}
		
				
				
				
        _geo.computeVertexNormals();
        _geo.verticesNeedUpdate = true;
        _geo.normalsNeedUpdate  = true;
		
		_mat.update();
    }
	
	private function _getIndex(i:Int, j:Int):Int{
		
		
		
		return j * (MAX_X) + i % (MAX_X);
		
	}
	
	public function getNoise(xx:Float, yy:Float, zz:Float):Float{
		//noise.perlin2(x / 100, y / 100)
		//var f = untyped __js__("noise.perlin3");
		//var n:Float = f(xx, yy, zz);
		//return n;
		
		 var f = untyped __js__('noise.perlin3');
		 return f(xx, yy, zz);
	}
	/*
	 * こんなかんじ
	plane.geometry.verticesNeedUpdate=true;//これを忘れずに書く
	for (var i=0;i<SEGX+1;i++) {
		for (var j=0;j<SEGY+1;j++) {
			//(i,j)のvertexを得る
			var index = j * (SEGX + 1) + i % (SEGX + 1);
			var vertex = plane.geometry.vertices[index];
			//時間経過と頂点の位置によって波を作る
			var amp=100;//振幅
			vertex.z = amp * Math.sin( -i/2 + time*15 );
		}           
	}*/
	
	
	
}

/*
(function () {

    'use strict';

    var MAX_X = 100;
    var MAX_Y = 100;
    
    // 伝播スピード
    var k = 0.2;
    
    // 減衰率
    var attenuation = 0.999;

    var U = [];
    var Vel = [];

    // 初期化
    for (var x = 0; x < MAX_X; x++) {
        U[x]   = [];
        Vel[x] = [];
        for (var y = 0; y < MAX_Y; y++) {
            U[x][y] = 0;
            Vel[x][y] = 0;
        }
    }

    // 最初の波
    U[MAX_X/2][MAX_Y/2] = 10;

    document.addEventListener('click', function () {
        U[MAX_X/2][MAX_Y/2] += 10;
    }, false);

    function updateWave() {
        // 波動方程式
        // \frac{1}{s^2} \frac{\delta^2 u}{\delta t^2} = \Delta u
        for (var x = 1; x < MAX_X - 1; x++) {
            for (var y = 1; y < MAX_Y - 1; y++) {
                var accel = U[x  ][y-1]
                          + U[x  ][y+1]
                          + U[x-1][y  ]
                          + U[x+1][y  ]
                          - U[x  ][y  ] * 4;
                accel *= k;
                Vel[x][y] = (Vel[x][y] + accel) * attenuation;
            }
        }

        for (var x = 1; x < MAX_X - 1; x++) {
            for (var y = 1; y < MAX_Y - 1; y++) {
                U[x][y] += Vel[x][y];
            }
        }

        for (var x = 0; x < MAX_X - 1; x++) {
            for (var y = 0; y < MAX_Y - 1; y++) {
                var idx = x + (MAX_X * y);
                geometry.vertices[idx].z = U[x][y];
            }
        }

        geometry.computeFaceNormals();
        geometry.verticesNeedUpdate = true;
        geometry.normalsNeedUpdate  = true;
        geometry.uvsNeedUpdate      = true;
    }

    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = -30;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var controls = new THREE.OrbitControls(camera); 

    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial({
        color    : 0x4499ff,
        wireframe: true,
        side     : THREE.DoubleSide
    });

    var uvs = [];
    var w = MAX_X - 1;
    var h = MAX_Y - 1;
    for (var i = 0; i < MAX_X; i++) {
        for (var j = 0; j < MAX_Y; j++) {
            geometry.vertices.push(new THREE.Vector3(i, j, 0));
            uvs.push(new THREE.Vector2(i / w, j / h));
        }
    }

    for (var j = 0; j < MAX_Y - 1; j++) {
        for (var i = 0; i < MAX_X - 1; i++) {
            var idx0 = (j * MAX_X) + i;
            var idx1 = idx0 + 1;
            var idx2 = idx0 + MAX_X;

            var idx3 = idx1;
            var idx4 = idx2;
            var idx5 = idx2 + 1;

            geometry.faces.push(new THREE.Face3(idx0, idx1, idx2));
            geometry.faces.push(new THREE.Face3(idx3, idx4, idx5));

            geometry.faceVertexUvs[0].push([
                uvs[idx0],
                uvs[idx1],
                uvs[idx2]
            ]);
            geometry.faceVertexUvs[0].push([
                uvs[idx3],
                uvs[idx4],
                uvs[idx5]
            ]);
        }
    }

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x -= MAX_X / 2;
    mesh.position.y -= MAX_Y / 2;
    scene.add(mesh);

    // light
    var light = new THREE.DirectionalLight(0xfffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    var ambient = new THREE.AmbientLight(0x666666);
    scene.add(ambient);

    var prevTime = Date.now();
    (function loop() {
        renderer.render(scene, camera);

        controls.update();
        updateWave();

        setTimeout(loop, 16);
    }());

}());


*/