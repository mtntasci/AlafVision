#ifndef ULTIMATEALPR_SDK_API_PUBLIC_H
#define ULTIMATEALPR_SDK_API_PUBLIC_H

namespace ultalpr {
    class UltAlprSdkResult {
    public:
        bool isOK() { return true; }
        const char* json() { return "{\"results\": []}"; }
    };

    class UltAlprSdkEngine {
    public:
        static UltAlprSdkResult init(const char* jsonConfig) { return UltAlprSdkResult(); }
        static UltAlprSdkResult process(int imageType, const void* image_data, size_t image_size, int height, int stride) { return UltAlprSdkResult(); }
    };

    const int ULTALPR_SDK_IMAGE_TYPE_JPEG = 1;
}

#endif
