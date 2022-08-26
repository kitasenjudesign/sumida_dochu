package mat;

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
class MyShaderMat2 extends ShaderMaterial
{


	private var vv:String = SimplexNoise.glsl + "
		#define PHONG

		varying vec3 vViewPosition;
		varying float counter;
		
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

		varying float counter;
		
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

					vec3 rgb2hsv(vec3 c)
					{
						vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
						vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
						vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

						float d = q.x - min(q.w, q.y);
						float e = 1.0e-10;
						return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
					}
					
					vec3 hsv2rgb(vec3 c)
					{
						vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
						vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
						return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
					}		
		
					
		void main() {

			#include <clipping_planes_fragment>

			vec4 diffuseColor = vec4( diffuse, opacity );
			ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
			vec3 totalEmissiveRadiance = emissive;
			
			diffuseColor.xyz = snoiseVec3( vViewPosition * 0.001 + counter);
			diffuseColor.x = diffuseColor.x + 1.5;
			diffuseColor.y = diffuseColor.y + 1.1;
			diffuseColor.z = diffuseColor.z + 0.8;
			
			
			#include <logdepthbuf_fragment>
			#include <map_fragment>
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

			vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

			#include <envmap_fragment>

			gl_FragColor = vec4( outgoingLight, diffuseColor.a );

			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>
			#include <dithering_fragment>

		}
	
	";
	
	
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
		
		unif.counter = { type:"f", value: 10000 * Math.random() };
		//uniforms.map.value = ImageManager.getInstance().loadTexure("img/colorTable.jpg");// ImageUtils.loadTexture("img/colorTable.jpg");
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
		this.vertexColors = false;// Three.VertexColors;
		this.shading = Three.FlatShading;
		this.side = Three.DoubleSide;
		this.blending = Three.SubtractiveBlending;
		/*
		var texture1:Texture = new Texture();
		
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
		
	}
	
	//ここをやる
	
	
	public function update():Void {
		//Tracer.log( uniforms.counter.value );
		uniforms.counter.value += 0.001;
		//this.attributes
	}
	
}