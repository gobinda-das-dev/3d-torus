const ChromaticAberrationShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'amount': { value: 0.005 },
    },

    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float amount;
      varying vec2 vUv;
  
      void main() {
        vec2 offset = amount * vec2(0.05, 0.05);
        vec4 color = vec4(
          texture2D(tDiffuse, vUv + offset).r,
          texture2D(tDiffuse, vUv).g,
          texture2D(tDiffuse, vUv - offset).b,
          1.0
        );
        gl_FragColor = color;
      }
    `
};

export { ChromaticAberrationShader };
