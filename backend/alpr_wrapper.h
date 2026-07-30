#ifndef ALPR_WRAPPER_H
#define ALPR_WRAPPER_H

#ifdef __cplusplus
extern "C" {
#endif

// Initialize the ALPR Engine
int AlprInit();

// Process a video frame (JPEG/PNG or raw blob) and return JSON result.
// Note: The caller must free the returned string using AlprFreeResult() if it's dynamically allocated.
char* AlprProcessFrame(const void* data, int size);

// Free the JSON string returned by AlprProcessFrame
void AlprFreeResult(char* result);

#ifdef __cplusplus
}
#endif

#endif // ALPR_WRAPPER_H
