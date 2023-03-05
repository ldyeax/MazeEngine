let vertex = `
precision mediump float;

varying vec2 vUv;
varying vec4 worldCoord;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
	worldCoord = modelMatrix * vec4( position, 1.0 );
}
`;

let fragment = `
precision mediump float;

uniform sampler2D texture1;
uniform vec2 repeat;
uniform float lightMapValue;

varying vec2 vUv;

void main() {
	gl_FragColor = texture2D(texture1, vUv * repeat) * lightMapValue;
	gl_FragColor.w = 1.0;
}
`;

export default {
	vertex: vertex, 
	fragment: fragment
}
