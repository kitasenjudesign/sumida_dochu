package mat;

import js.Browser;
import js.html.Uint8Array;
import shader.SimplexNoise;
import three.Color;
import three.ImageUtils;
import three.ShaderMaterial;
import three.Texture;
import three.UniformsUtils;
import three.Vector3;
import three.WebGLShaders.ShaderLib;


/**
 * ...
 * @author watanabe
 */
class MyShaderMat extends ShaderMaterial
{


	private var vv:String = SimplexNoise.glsl + "
		#define PHONG

		varying vec3 vViewPosition;
		
		varying vec3 vPos;
		varying vec2 uvv;
		
		#ifndef FLAT_SHADED

			varying vec3 vNormal;

		#endif

		#include <common>
		#include <uv_pars_vertex>
		#include <uv2_pars_vertex>
		#include <displacementmap_pars_vertex>
		#include <envmap_pars_vertex>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <morphtarget_pars_vertex>
		#include <skinning_pars_vertex>
		#include <shadowmap_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		void main() {

			#include <uv_vertex>
			#include <uv2_vertex>
			#include <color_vertex>

			#include <beginnormal_vertex>
			#include <morphnormal_vertex>
			#include <skinbase_vertex>
			#include <skinnormal_vertex>
			#include <defaultnormal_vertex>

		#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

			vNormal = normalize( transformedNormal );

		#endif

			#include <begin_vertex>
			vPos = position;
			uvv = uv;
			
			#include <morphtarget_vertex>
			#include <skinning_vertex>
			#include <displacementmap_vertex>
			#include <project_vertex>
			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>

			vViewPosition = - mvPosition.xyz;

			#include <worldpos_vertex>
			#include <envmap_vertex>
			#include <shadowmap_vertex>
			#include <fog_vertex>

		}	
	";
	
	
	private var ff:String = SimplexNoise.glsl + "
	
		#define PHONG

		uniform vec3 diffuse;
		uniform vec3 emissive;
		uniform vec3 specular;
		uniform float shininess;
		uniform float opacity;
		uniform float counter;
		uniform sampler2D texture1;
		varying vec3 vPos;
		varying vec2 uvv;
		
		#include <common>
		#include <packing>
		#include <dithering_pars_fragment>
		#include <color_pars_fragment>
		#include <uv_pars_fragment>
		#include <uv2_pars_fragment>
		#include <map_pars_fragment>
		#include <alphamap_pars_fragment>
		#include <aomap_pars_fragment>
		#include <lightmap_pars_fragment>
		#include <emissivemap_pars_fragment>
		#include <envmap_pars_fragment>
		#include <gradientmap_pars_fragment>
		#include <fog_pars_fragment>
		#include <bsdfs>
		#include <lights_pars>
		#include <lights_phong_pars_fragment>
		#include <shadowmap_pars_fragment>
		#include <bumpmap_pars_fragment>
		#include <normalmap_pars_fragment>
		#include <specularmap_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		float rand1(vec2 co){
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
		}		
		
		void main() {

			#include <clipping_planes_fragment>
			#include <logdepthbuf_fragment>
			#include <map_fragment>

			vec4 diffuseColor = vec4( diffuse, opacity );
			ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
			vec3 totalEmissiveRadiance = emissive;
			
			//diffuseColor.x = 0.33*(diffuseColor.x+diffuseColor.y+diffuseColor.z);
			//diffuseColor.y = 0.33*(diffuseColor.x+diffuseColor.y+diffuseColor.z);
			//diffuseColor.z = 0.33 * (diffuseColor.x + diffuseColor.y + diffuseColor.z);
			//diffuseColor.xyz = texture2D(texture1, uvv - vec2(pow(vNormal.x, 1.0) * 0.05, pow(vNormal.y, 1.0) * 0.05) ).xyz + diffuseColor.xyz * 0.15;
			
			diffuseColor.x = texture2D(texture1, uvv - vPos.z * vec2(pow(vNormal.x, 1.0) * 0.05, pow(vNormal.y, 1.0) * 0.04) ).x;
			diffuseColor.y = texture2D(texture1, uvv - vPos.z * vec2(pow(vNormal.x, 1.0) * 0.08, pow(vNormal.y, 1.0) * 0.07) ).y;
			diffuseColor.z = texture2D(texture1, uvv - vPos.z * vec2(pow(vNormal.x, 1.0) * 0.03, pow(vNormal.y, 1.0) * 0.06) ).z;
			
			//diffuseColor.xyz += vPos.z * snoiseVec3( vec3(vPos.x * 0.01, vPos.y * 0.01, vPos.z * 30.2 + counter) );
			
			//diffuseColor.x = abs( 1.0 * diffuseColor.z + 0.7 ) + sin( vPos.z * 0.2 );
			//diffuseColor.y = abs( 0.8 * diffuseColor.y + 0.5 ) + sin( vPos.z * 0.1 );
			//diffuseColor.z = abs( 0.2 * diffuseColor.z + 0.7 ) + sin( vPos.z * 0.05 );
			//diffuseColor.x = mix(1.00,diffuseColor.x, smoothstep(0.0, 0.1, abs(vPos.z)) );
			//diffuseColor.y = mix(0.97,diffuseColor.y, smoothstep(0.0, 0.1, abs(vPos.z)) );
			//diffuseColor.z = mix(0.85,diffuseColor.z, smoothstep(0.0, 0.1, abs(vPos.z)) );
			

			#include <color_fragment>
			#include <alphamap_fragment>
			#include <alphatest_fragment>
			#include <specularmap_fragment>
			#include <normal_fragment>
			#include <emissivemap_fragment>

			// accumulation
			#include <lights_phong_fragment>
			#include <lights_template>

			// modulation
			#include <aomap_fragment>

			vec3 outgoingLight = reflectedLight.directDiffuse + 
			reflectedLight.indirectDiffuse + reflectedLight.directSpecular + 
			reflectedLight.indirectSpecular + totalEmissiveRadiance;

			#include <envmap_fragment>

			vec3 vv = vec3(0.15 * rand1(diffuseColor.xy * 100.0 + counter));
			//outgoingLight.xyz += vv;			
			
			gl_FragColor = vec4( outgoingLight, diffuseColor.a );

			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>
			#include <dithering_fragment>

		}
	
	";
	
	
		private var tex1:Dynamic;
		private var tex2:Dynamic;
		private var flag:Bool = false;
	/**
	 * new
	 * @param	tt
	 * @param	t2
	 */
	public function new(deform:Float = 1) 
	{
		//texture
		
		var phongShader:Dynamic = ShaderLib.phong;
		var unif:Dynamic = UniformsUtils.clone( phongShader.uniforms );
		
		//Tracer.info( phongShader.uniforms );
		this.tex1 = ImageUtils.loadTexture("textures/a.jpg");
		this.tex2 = ImageUtils.loadTexture("textures/b.jpg");
		
		unif.counter = { type:"f", value: 0 };
		unif.texture1 = { type:"t", value: tex1 };
		//unif.map = { type:"t", value: ImageUtils.loadTexture("textures/a.jpg") };
		
		unif.specular.value = new Color(0x888888);
		unif.emissive.value = new Color(0x222222);
		//unif.deform1 = { type:"f", value: deform };
		//Tracer.info( uniforms );
		
		super({
		  uniforms: unif,
		  vertexShader:vv,
		  fragmentShader:ff,
		  lights:true
		});
		
		
		//this.map = true;
		this.vertexColors = false;
		this.side = Three.DoubleSide;
		//this.wireframe = true;
		//this.transparent = true;
		//this.blending = Three.SubtractiveBlending;
		/*
		var texture1:Texture = new Texture();.
		
		super({
				vertexShader: vv,
				fragmentShader: ff,
				uniforms: {
					texture: { type: 't', 		value: texture1 },
					counter: { type: "f",		value: 0 }
				}
		});
		*/
		//this.wireframe = true;
		Browser.window.onclick = function(){
			this.flag = !this.flag;
			this.uniforms.texture1.value = (this.flag) ? this.tex2 : this.tex1;
		}
	}
	
	//ここをやる
	
	
	public function update():Void {
		//
		//Tracer.log( uniforms.counter.value );
		uniforms.counter.value += 0.005;
		//trace( uniforms.counter.value );
		//this.attributes
	}
	
}