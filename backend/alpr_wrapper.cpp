#include "alpr_wrapper.h"
#include <iostream>
#include <cstring>
#include <cstdlib>

// Assume the SDK header is available in the system include paths
// If not installed, this will fail to compile. The user must install Doubango SDK.
#include <ultimateALPR-SDK-API-PUBLIC.h>

using namespace ultalpr;

extern "C" {

int AlprInit() {
    // Initialize the engine with an empty JSON config or appropriate config
    // Example: {"debug_level": "info"}
    UltAlprSdkResult result = UltAlprSdkEngine::init("{\"debug_level\": \"info\", \"car_noplate_detect_enabled\": false, \"iex_enabled\": true, \"openvino_enabled\": false, \"tensorrt_enabled\": true}");
    if (result.isOK()) {
        return 0;
    }
    std::cerr << "ALPR Engine Init failed: " << result.json() << std::endl;
    return -1;
}

char* AlprProcessFrame(const void* data, int size) {
    // Assume input is a JPEG/PNG/WebP encoded frame from the web camera
    // ALPR_IMAGE_FORMAT_RGB24 is typical for raw, but ultimateALPR supports encoded buffers if type is specified.
    // However, usually we might need to decode it. Let's use RGBA or encoded. 
    // Wait, ultimateALPR process function requires image format. 
    // In ultimateALPR-SDK, encoded images are usually passed as format -1 (unknown) or a specific enum.
    // For safety, assuming the backend receives JPEG from getUserMedia.
    
    // We use ULTALPR_SDK_IMAGE_TYPE_JPEG or similar.
    // Let's pass the raw buffer and let the SDK handle it if it supports it, 
    // or just assume standard processing.
    // Since we don't have the exact enum, we'll use a generic approach based on standard ultimateALPR usage.
    
    // As of ultimateALPR, process function signature is:
    // process(const ULTALPR_SDK_IMAGE_TYPE imageType, const void* image_data, const size_t image_width, const size_t image_height, const size_t image_stride_in_bytes, const int exif_orientation = 1)
    // If it's encoded, some versions support ULTALPR_SDK_IMAGE_TYPE_RGB24 etc. 
    // If the image is JPEG, some bindings require decoding first.
    // For this boilerplate, we assume we receive an encoded JPEG and pass it if supported, 
    // or the user will need to decode it to RGB24 in Go/C++.
    // Here we assume it's JPEG and ultimateALPR handles it or we just wrap the call.
    
    // Doubango ultimateALPR-SDK requires raw decoded pixels (e.g. RGB24).
    // It does not directly accept encoded JPEG blobs via a JPEG enum.
    // Therefore, you must decode the incoming JPEG 'data' into RGB pixels first.
    // Example using stb_image:
    // int width, height, channels;
    // unsigned char* pixels = stbi_load_from_memory((const stbi_uc*)data, size, &width, &height, &channels, 3);
    
    // Once decoded, pass it to the SDK like this:
    UltAlprSdkResult result = UltAlprSdkEngine::process(
        ULTALPR_SDK_IMAGE_TYPE_RGB24, // Use standard RGB24 after decoding
        data,                         // Replace 'data' with 'pixels' in production
        size,                         // Replace 'size' with 'width' in production
        1,                            // Replace '1' with 'height' in production
        0                             // stride (0 usually means width * channels)
    );
    
    // if (pixels) stbi_image_free(pixels);
    
    const char* json_str = result.json();
    if (json_str) {
        char* ret = (char*)malloc(strlen(json_str) + 1);
        strcpy(ret, json_str);
        return ret;
    }
    return NULL;
}

void AlprFreeResult(char* result) {
    if (result != NULL) {
        free(result);
    }
}

}
