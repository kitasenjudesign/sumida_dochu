#define PHONG
#define USE_MAP
#define USE_UV

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform float counter;
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
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>

	/*#include <map_fragment>*/
    
    /*vec4 sampledDiffuseColor = texture2D( map, vUv+vec2(0,vPos.z*0.001) );*/
    //vUv.y=vUv.y+counter;
    //vUv.y=fract(vUv.y);
    vec2 newUV = vUv.xy+vec2(0.0,-counter*0.01);
    if(newUV.y>0.0)newUV.y=0.0;
	newUV.y = fract( newUV.y );

    vec4 aa = texture2D( map, (newUV+vNormal.xy*0.02) );
    vec4 bb = texture2D( map, (newUV+vNormal.xy*0.03) );
    vec4 cc = texture2D( map, (newUV+vNormal.xy*0.04) );

    vec4 sampledDiffuseColor = vec4(aa.r,bb.g,cc.b,1.0);
    
	sampledDiffuseColor.xyz += vNormal.xyz*0.4;

    diffuseColor *= sampledDiffuseColor;
    //diffuseColor += random(vUv.xy+vec2(counter*0.1,counter))*0.1;
    

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
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}