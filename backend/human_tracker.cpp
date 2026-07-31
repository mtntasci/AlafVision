#include "human_tracker.h"
#include <iostream>
#include <cstring>
#include <cstdlib>
#include <string>

extern "C" {

int HumanTrackerInit() {
    // Initialize the YOLO / ByteTrack engine here in the future.
    // For now, we simulate a successful initialization.
    std::cout << "[HumanTracker] Motor initialized successfully." << std::endl;
    return 0;
}

char* HumanTrackerProcessFrame(const void* data, int size) {
    // In the future, pass 'data' to the YOLO inference engine and tracking algorithm.
    // For now, we return a mockup JSON string mimicking a detected person.
    
    // Example Mock JSON as requested: 
    // [{"id": "human_1", "box": [x1, y1, width, height], "class": "person"}]
    
    std::string mockup = "[{\"id\": \"human_1\", \"box\": [100, 100, 50, 120], \"class\": \"person\"}]";
    
    char* ret = (char*)malloc(mockup.length() + 1);
    if (ret != NULL) {
        strcpy(ret, mockup.c_str());
    }
    return ret;
}

void HumanTrackerFreeResult(char* result) {
    if (result != NULL) {
        free(result);
    }
}

}
