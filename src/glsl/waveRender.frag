#define PHONG
#define USE_MAP
#define USE_UV
#define USE_ENVMAP

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform float counter;
uniform float offsetY;
uniform float noise;
uniform vec4 glitch;
uniform vec3 offsetCol;
uniform vec3 colDisplace;
uniform sampler2D map2;
//uniform samplerCube envMap2;

varying vec3 vPos;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;// + 

	#include <logdepthbuf_fragment>

	/*#include <map_fragment>*/
    
    /*vec4 sampledDiffuseColor = texture2D( map, vUv+vec2(0,vPos.z*0.001) );*/
    //vUv.y=vUv.y+counter;
    //vUv.y=fract(vUv.y);
	vec2 newUV0 = vUv.xy+vec2(0.0,-offsetY-counter*0.01); 
    vec2 newUV = vUv.xy+vec2(0.0,-offsetY-counter*0.01);
    if(newUV.y>0.0)newUV.y=0.0;
	newUV.y = fract( newUV.y );

	//glitch displacement
	float gx = glitch.z;//分割数
	vec2 displace = vec2(0.0,0.0);
	float rad = glitch.y;//;

	//座標を回転
	//float nx = newUV.x * cos(-rad) - newUV.y * sin(-rad);
	//float ny = newUV.x * sin(-rad) + newUV.y * cos(-rad);
	float nx = newUV0.x * cos(-rad) - newUV0.y * sin(-rad);
	float ny = newUV0.x * sin(-rad) + newUV0.y * cos(-rad);

	//開店した座標に応じて、短冊を切る
	float nn = floor((ny)*gx);
	//float amp = glitch.x * (random(vec2(nn/gx,0.0))-0.5);
	float amp = glitch.x * mod(nn,3.0);


	displace.x = amp * cos(rad);//-3.1415/2.);
	displace.y = amp * sin(rad);//-3.1415/2.);
	//displace.x += ( (random( vec2(floor(newUV.y*gx)/gx,0.0) )-0.5) * glitch.x );
	//displace.y += ( -random( vec2(floor((newUV.x+newUV.y)*gx)/gx,0.0) ) * glitch.x );

	newUV.xy += displace;
	newUV.x = fract( newUV.x );
	newUV.y = fract( newUV.y );


    vec4 aa = texture2D( map, (newUV+vNormal.xy*colDisplace.x) );//0.02
    vec4 bb = texture2D( map, (newUV+vNormal.xy*colDisplace.y) );//0.03
    vec4 cc = texture2D( map, (newUV+vNormal.xy*colDisplace.z) );//0.04

	//色を変えている
	if( mod(nn,2.0) == 0.0 ){
		float ratio =smoothstep(0.1,0.2,abs(amp)*10.0);//,0.0,1.0);
		//aa = mix(aa,texture2D( map2,(newUV+vNormal.xy*colDisplace.x)),ratio);//0.02
		//bb = mix(bb,texture2D( map2,(newUV+vNormal.xy*colDisplace.y)),ratio);
		//cc = mix(cc,texture2D( map2,(newUV+vNormal.xy*colDisplace.z)),ratio);
		aa = mix(aa,aa+0.02,ratio);//0.02
		bb = mix(bb,bb+0.04,ratio);
		cc = mix(cc,cc+0.09,ratio);
	}



    vec4 sampledDiffuseColor = vec4(aa.r,bb.g,cc.b,1.0);
    
	
	float zz = 1.0-dot( vNormal.xyz, vec3(0.0,0.0,1.0) );
	//sampledDiffuseColor.x += zz*abs( snoise(vec3(vUv.xy+vNormal.xy*1.6,0.5)) );
	//sampledDiffuseColor.y += zz*abs( snoise(vec3(vUv.xy+vNormal.xy*1.9,1.8)) );
	//sampledDiffuseColor.z += zz*abs( snoise(vec3(vUv.xy+vNormal.xy*1.8,0.9)) );


//	sampledDiffuseColor.xyz += vNormal.xyz*0.8;
	sampledDiffuseColor.xy+=vNormal.xy*0.1;
	
	

	sampledDiffuseColor.xyz += offsetCol.xyz;

    diffuseColor *= sampledDiffuseColor;
    //diffuseColor += random(vUv.xy+vec2(counter*0.1,counter))*0.1;
    
	//https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderChunk


	//env

	//vec3 cameraToFrag1 = normalize( vWorldPosition - cameraPosition );
	//vec3 reflectVec1 = vNormal;//, 0.99 );
	//vec4 envColor1 = textureCube( envMap2, vec3( 0.2,0.1,1.0 ) );
	//diffuseColor.xyz += envColor1.xyz;



	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
		
	outgoingLight.xyz += (noise*(random(vUv.xy)-0.5));

	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}