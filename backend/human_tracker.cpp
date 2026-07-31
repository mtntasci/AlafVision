#include "human_tracker.h"
#include <iostream>
#include <cstring>
#include <cstdlib>
#include <string>

extern "C" {

static int current_id = 10000;
static int lost_frames = 0;

int HumanTrackerInit() {
    // BURAYA GERÇEK YOLO VE BYTETRACK BAŞLATMA KODLARI GELECEK
    std::cout << "[HumanTracker] Motor initialized successfully." << std::endl;
    return 0;
}

char* HumanTrackerProcessFrame(const void* data, int size) {
    // 1. BURADA GELEN 'data' BUFFER'INI YOLO MODELİNE VERİP INFERENCE YAPIN.
    // --- DİKKAT: BURASI SİMÜLASYON (MOCK) ALANIDIR ---
    // Gerçek bir yapay zeka modeli entegre edilmediği için sizi kameradan "göremez".
    // Sadece arayüzün çalıştığını görmeniz için ekranın ortasında sahte bir kutu oluşturuyoruz.
    static int mock_x = 300;
    static int mock_y = 150;
    static int frame_count = 0;
    frame_count++;

    // Kutuyu hafifçe titreterek hareket efekti verelim
    if (frame_count % 10 == 0) mock_x += 5;
    if (frame_count % 20 == 0) mock_x -= 5;
    
    // Tracker & NMS Ayarları
    const float CONFIDENCE_THRESHOLD = 0.60f; 
    const int MAX_AGE = 60; // 60 frame boyunca hafızada tut
    
    std::string result_json = "[{\"id\": \"" + std::to_string(current_id) + "\", \"box\": [" + 
                 std::to_string(mock_x) + ", " + std::to_string(mock_y) + ", 150, 250], " +
                 "\"class\": \"person\", \"score\": 0.85}]";

    
    char* ret = (char*)malloc(result_json.length() + 1);
    if (ret != NULL) {
        strcpy(ret, result_json.c_str());
    }
    return ret;
}

void HumanTrackerFreeResult(char* result) {
    if (result != NULL) {
        free(result);
    }
}

}
