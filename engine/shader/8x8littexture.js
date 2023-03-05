let vertex = `
precision mediump float;

varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

let fragment = `
precision mediump float;

uniform sampler2D texture1;
uniform vec2 repeat;

varying vec2 vUv;

uniform float topLeftLighting;
uniform float topRightLighting;
uniform float bottomLeftLighting;
uniform float bottomRightLighting;

// float topLeftLighting = 1.0;
// float topRightLighting = 0.0;
// float bottomLeftLighting = 0.0;
// float bottomRightLighting = 0.0;

void main() {
	float x = vUv.x;
	float y = 1.0 - vUv.y;

	vec2 v1 = vec2(1.0 - x, x);
	mat2 lightingMatrix = mat2(
		topLeftLighting,
		topRightLighting,
		bottomLeftLighting,
		bottomRightLighting
	);
	vec2 v2 = vec2(1.0 - y, y);

	float lightValue = dot(v1, lightingMatrix * v2);

	gl_FragColor = texture2D(texture1, vUv * repeat) * lightValue;
}
`;

export default {
	vertex: vertex, 
	fragment: fragment
}
