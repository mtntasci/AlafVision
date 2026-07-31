#ifndef HUMAN_TRACKER_H
#define HUMAN_TRACKER_H

#ifdef __cplusplus
extern "C" {
#endif

// Initialize the Human Tracker Engine
int HumanTrackerInit();

// Process a video frame and return JSON result for human tracking.
// Example Output: [{"id": "human_1", "box": [100, 100, 50, 120], "class": "person"}]
char* HumanTrackerProcessFrame(const void* data, int size);

// Free the JSON string returned by HumanTrackerProcessFrame
void HumanTrackerFreeResult(char* result);

#ifdef __cplusplus
}
#endif

#endif // HUMAN_TRACKER_H
