#version 450

layout(set = 0, binding = 0) uniform sampler2D samplerLighting;
layout(set = 0, binding = 1) uniform sampler2D samplerLighting1;
layout(set = 0, binding = 2) uniform sampler2D samplerAlbedo2;
layout(set = 0, binding = 3) uniform sampler2D samplerGbufferDepth;
layout(set = 0, binding = 4) uniform sampler2D samplerGbuffer1Depth;
layout(set = 0, binding = 5) uniform sampler2D samplerGbuffer2Depth;
layout(set = 0, binding = 6) uniform usampler2D samplerSegmentation0;
layout(set = 0, binding = 7) uniform usampler2D samplerSegmentation1;

layout(location = 0) in vec2 inUV;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outDepthLinear;
layout(location = 2) out uvec4 outSegmentation;
layout(location = 3) out vec4 outSegmentationView0;
layout(location = 4) out vec4 outSegmentationView1;

layout(set = 1, binding = 0) uniform CameraBuffer {
  mat4 viewMatrix;
  mat4 projectionMatrix;
  mat4 viewMatrixInverse;
  mat4 projectionMatrixInverse;
  mat4 prevViewMatrix;
  mat4 prevViewMatrixInverse;
  float width;
  float height;
} cameraBuffer;

vec4 colors[60] = {
  vec4(0.8,  0.4,  0.4 , 1 ),
  vec4(0.8,  0.41, 0.24, 1 ),
  vec4(0.8,  0.75, 0.32, 1 ),
  vec4(0.6,  0.8,  0.4 , 1 ),
  vec4(0.35, 0.8,  0.24, 1 ),
  vec4(0.32, 0.8,  0.51, 1 ),
  vec4(0.4,  0.8,  0.8 , 1 ),
  vec4(0.24, 0.63, 0.8 , 1 ),
  vec4(0.32, 0.37, 0.8 , 1 ),
  vec4(0.6,  0.4,  0.8 , 1 ),
  vec4(0.69, 0.24, 0.8 , 1 ),
  vec4(0.8,  0.32, 0.61, 1 ),
  vec4(0.8,  0.32, 0.32, 1 ),
  vec4(0.8,  0.64, 0.4 , 1 ),
  vec4(0.8,  0.74, 0.24, 1 ),
  vec4(0.56, 0.8,  0.32, 1 ),
  vec4(0.4,  0.8,  0.44, 1 ),
  vec4(0.24, 0.8,  0.46, 1 ),
  vec4(0.32, 0.8,  0.8 , 1 ),
  vec4(0.4,  0.56, 0.8 , 1 ),
  vec4(0.24, 0.3,  0.8 , 1 ),
  vec4(0.56, 0.32, 0.8 , 1 ),
  vec4(0.8,  0.4,  0.76, 1 ),
  vec4(0.8,  0.24, 0.58, 1 ),
  vec4(0.8,  0.24, 0.24, 1 ),
  vec4(0.8,  0.61, 0.32, 1 ),
  vec4(0.72, 0.8,  0.4 , 1 ),
  vec4(0.52, 0.8,  0.24, 1 ),
  vec4(0.32, 0.8,  0.37, 1 ),
  vec4(0.4,  0.8,  0.68, 1 ),
  vec4(0.24, 0.8,  0.8 , 1 ),
  vec4(0.32, 0.51, 0.8 , 1 ),
  vec4(0.48, 0.4,  0.8 , 1 ),
  vec4(0.52, 0.24, 0.8 , 1 ),
  vec4(0.8,  0.32, 0.75, 1 ),
  vec4(0.8,  0.4,  0.52, 1 ),
  vec4(0.8,  0.52, 0.4 , 1 ),
  vec4(0.8,  0.58, 0.24, 1 ),
  vec4(0.7,  0.8,  0.32, 1 ),
  vec4(0.48, 0.8,  0.4 , 1 ),
  vec4(0.24, 0.8,  0.3 , 1 ),
  vec4(0.32, 0.8,  0.66, 1 ),
  vec4(0.4,  0.68, 0.8 , 1 ),
  vec4(0.24, 0.46, 0.8 , 1 ),
  vec4(0.42, 0.32, 0.8 , 1 ),
  vec4(0.72, 0.4,  0.8 , 1 ),
  vec4(0.8,  0.24, 0.74, 1 ),
  vec4(0.8,  0.32, 0.46, 1 ),
  vec4(0.8,  0.46, 0.32, 1 ),
  vec4(0.8,  0.76, 0.4 , 1 ),
  vec4(0.69, 0.8,  0.24, 1 ),
  vec4(0.42, 0.8,  0.32, 1 ),
  vec4(0.4,  0.8,  0.56, 1 ),
  vec4(0.24, 0.8,  0.63, 1 ),
  vec4(0.32, 0.66, 0.8 , 1 ),
  vec4(0.4,  0.44, 0.8 , 1 ),
  vec4(0.35, 0.24, 0.8 , 1 ),
  vec4(0.7,  0.32, 0.8 , 1 ),
  vec4(0.8,  0.4,  0.64, 1 ),
  vec4(0.8,  0.24, 0.41, 1 )
};


void main() {
  float d0 = texture(samplerGbufferDepth, inUV).x;
  float d1 = texture(samplerGbuffer1Depth, inUV).x;
  float d2 = texture(samplerGbuffer2Depth, inUV).x;

  vec4 outColor0 = texture(samplerLighting, inUV);
  vec4 outColor1 = texture(samplerLighting1, inUV);
  vec4 outColor2 = texture(samplerAlbedo2, inUV);

  // depth composite for 0 and 2
  float factor = step(d0, d2);
  outColor0 = outColor0 * factor + outColor2 * (1 - factor);

  // blend for 02 and 1
  vec3 blend = outColor1.a * outColor1.rgb + (1 - outColor1.a) * outColor0.rgb;
  factor = step(min(d0, d2), d1);
  outColor = vec4((1 - factor)* blend + factor * outColor0.rgb, 1.f);

  outColor = pow(outColor, vec4(1/2.2, 1/2.2, 1/2.2, 1));

  vec4 csPosition = cameraBuffer.projectionMatrixInverse * (vec4(inUV * 2 - 1, min(d0, d1), 1));
  outDepthLinear = vec4(vec3(-csPosition.z / csPosition.w), 1.);

  uvec4 seg0 = texture(samplerSegmentation0, inUV);
  uvec4 seg1 = texture(samplerSegmentation1, inUV);
  outSegmentation = d0 < d1 ? seg0 : seg1;

  outSegmentationView0 = mix(vec4(0,0,0,1), colors[outSegmentation.x % 60], sign(outSegmentation.x));
  outSegmentationView1 = mix(vec4(0,0,0,1), colors[outSegmentation.y % 60], sign(outSegmentation.y));
}
