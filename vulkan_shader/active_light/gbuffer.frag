#version 450

layout(set = 0, binding = 0) uniform CameraBuffer {
  mat4 viewMatrix;
  mat4 projectionMatrix;
  mat4 viewMatrixInverse;
  mat4 projectionMatrixInverse;
  mat4 prevViewMatrix;
  mat4 prevViewMatrixInverse;
  float width;
  float height;
} cameraBuffer;

layout(set = 2, binding = 0) uniform MaterialBuffer {
  vec4 baseColor;
  float fresnel;
  float roughness;
  float metallic;
  float transparency;
  int textureMask;
} materialBuffer;

layout(set = 2, binding = 1) uniform sampler2D colorTexture;
layout(set = 2, binding = 2) uniform sampler2D roughnessTexture;
layout(set = 2, binding = 3) uniform sampler2D normalTexture;
layout(set = 2, binding = 4) uniform sampler2D metallicTexture;

layout(location = 0) in vec4 inPosition;
layout(location = 1) in vec4 inPrevPosition;
layout(location = 2) in vec2 inUV;
layout(location = 3) in flat uvec4 inSegmentation;
layout(location = 4) in vec3 objectCoord;
layout(location = 5) in mat3 inTbn;

layout(location = 0) out vec4 outAlbedo;
layout(location = 1) out vec4 outPosition;
layout(location = 2) out vec4 outSpecular;
layout(location = 3) out vec4 outNormal;
layout(location = 4) out uvec4 outSegmentation0;
layout(location = 5) out vec4 outCustom;
layout(location = 6) out vec4 outMotionDirection;

void main() {
  outCustom = vec4(objectCoord, 1);
  outSegmentation0 = inSegmentation;

  outPosition = inPosition;

  vec4 p1 = cameraBuffer.projectionMatrix * inPosition;
  p1 /= p1.w;
  vec2 p1s = p1.xy / p1.z;

  vec4 p2 = cameraBuffer.projectionMatrix * inPrevPosition;
  p2 /= p2.w;
  vec2 p2s = p2.xy / p2.z;

  outMotionDirection = vec4((p1s - p2s)*0.5, 0, 1);

  if ((materialBuffer.textureMask & 1) != 0) {
    outAlbedo = texture(colorTexture, inUV);
  } else {
    outAlbedo = materialBuffer.baseColor;
  }

  if (outAlbedo.a == 0) {
    discard;
  }

  outSpecular.r = materialBuffer.fresnel;

  if ((materialBuffer.textureMask & 2) != 0) {
    outSpecular.g = texture(roughnessTexture, inUV).r;
  } else {
    outSpecular.g = materialBuffer.roughness;
  }

  if ((materialBuffer.textureMask & 8) != 0) {
    outSpecular.b = texture(metallicTexture, inUV).r;
  } else {
    outSpecular.b = materialBuffer.metallic;
  }

  if ((materialBuffer.textureMask & 4) != 0) {
    outNormal = vec4(normalize(inTbn * (texture(normalTexture, inUV).xyz * 2 - 1)), 0);
  } else {
    outNormal = vec4(normalize(inTbn * vec3(0, 0, 1)), 0);
  }
  outNormal = outNormal;
}
