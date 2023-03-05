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

uniform float leftLighting;
uniform float rightLighting;

void main() {
	float x = vUv.x;
	float lightValue = mix(leftLighting, rightLighting, x);
	gl_FragColor = texture2D(texture1, vUv * repeat) * lightValue;
}
`;

export default {
	vertex: vertex, 
	fragment: fragment
}
