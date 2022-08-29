#include <common>

uniform vec2 mousePos;
uniform float mouseSize;
uniform float viscosityConstant;
uniform float heightCompensation;
uniform float attenuation;
uniform float amplitude;

void main()	{

	vec2 cellSize = 1.0 / resolution.xy;

	vec2 uv = gl_FragCoord.xy * cellSize;

	// heightmapValue.x == height from previous frame
	// heightmapValue.y == height from penultimate frame
	// heightmapValue.z, heightmapValue.w not used
	vec4 heightmapValue = texture2D( heightmap, uv );//heightmap value
	//heightmapValue.x += heightmapValue.z;

	// Get neighbours
	vec4 north = texture2D( heightmap, uv + vec2( 0.0, cellSize.y ) );//top
	vec4 south = texture2D( heightmap, uv + vec2( 0.0, - cellSize.y ) );//botm
	vec4 east = texture2D( heightmap, uv + vec2( cellSize.x, 0.0 ) );//right
	vec4 west = texture2D( heightmap, uv + vec2( - cellSize.x, 0.0 ) );//left

	float newHeight = heightmapValue.x;//( ( north.x + south.x + east.x + west.x ) * 0.5 - heightmapValue.y ) * viscosityConstant;

	float accelX = west.x - heightmapValue.x * 2.0 + east.x;
	float accelY = north.x - heightmapValue.x * 2.0 + south.x;
	float aa = 0.9+0.1;//*sin(uv.x*3.1415*4.0);
	float bb = 0.9+0.1;//*sin(uv.y*3.1415*4.0);
	float accel = aa*accelX + bb*accelY;
	
	accel *= 0.1;//k;
    heightmapValue.z = (heightmapValue.z + accel) * attenuation;//減衰
	newHeight += heightmapValue.z;
	//vを計算

	// Mouse influence
	
	float mousePhase = 
	clamp( 
		length( ( uv - vec2( 0.5 ) ) * BOUNDS - vec2( mousePos.x, - mousePos.y ) ) * PI / mouseSize, 
		0.0, 
		PI 
	);
	newHeight += ( cos( mousePhase ) + 1.0 ) * amplitude;//1.28;



	
	heightmapValue.y = heightmapValue.x;//old
	heightmapValue.x = newHeight;//new
	


/*
	var aa = 0.9 + 0.1 * Math.cos(i * 0.15 + j * 0.15);
	var bb = 0.9 + 0.1 * Math.cos(i * 0.15 + j * 0.15);

	var accelX:number = this.positions[left] - this.positions[center] * 2 + this.positions[right];
	var accelY:number = this.positions[bottom] - this.positions[center] * 2 + this.positions[top];
	var accel:number = aa*accelX + bb* accelY;
	
	accel *= this._k;// * Math.abs( getNoise(i, j, _count * 0.5) ) * 0.1;
	this.velocity[center] = (this.velocity[center] + accel) * this._attenuation;//減衰
*/



	gl_FragColor = heightmapValue;

}