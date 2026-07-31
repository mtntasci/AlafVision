#include "human_tracker.h"
#include <iostream>
#include <cstring>
#include <cstdlib>
#include <string>

extern "C" {

static int current_id = 10000;
static int frame_count = 0;
static int box_x = 100;
static int box_y = 100;
static int lost_frames = 0;

int HumanTrackerInit() {
    // Initialize the YOLO / ByteTrack engine here in the future.
    std::cout << "[HumanTracker] Motor initialized successfully." << std::endl;
    return 0;
}

char* HumanTrackerProcessFrame(const void* data, int size) {
    frame_count++;
    
    // Simulate walking person across the screen
    box_x += 10;
    if (box_x > 600) {
        box_x = 50; 
        // Normalde ekran dışına çıkınca yeni kişi gelmeli. Test amaçlı aynı kişiyi koruyoruz.
    }

    // Tracker Ayarları (SORT / ByteTrack Parametreleri)
    const float CONFIDENCE_THRESHOLD = 0.80f;
    const int MAX_AGE = 60; // 60 frame boyunca hafızada tut
    
    float current_score = 0.85f;
    
    // Modelin zorlandığı (örneğin kameranın bulanıklaştığı) 2-3 karelik bir an simüle edelim
    if (frame_count % 50 == 0 || frame_count % 51 == 0) {
        current_score = 0.45f; // Eşiğin altında (False Negative durumu)
    }

    std::string mockup = "[]"; 
    
    if (current_score >= CONFIDENCE_THRESHOLD) {
        // Kişi yüksek güvenilirlikle tespit edildi. Tracker süresi sıfırlanır.
        lost_frames = 0;
        mockup = "[{\"id\": \"" + std::to_string(current_id) + "\", \"box\": [" + 
                 std::to_string(box_x) + ", " + std::to_string(box_y) + ", 120, 240], " +
                 "\"class\": \"person\", \"score\": " + std::to_string(current_score) + "}]";
    } else {
        // Kişi tespit edilemedi. Ancak MAX_AGE bitene kadar ID'yi (current_id) öldürmüyoruz.
        lost_frames++;
        if (lost_frames > MAX_AGE) {
            // max_age aşıldıysa kişi tamamen kaybedilmiş sayılır, yeni biri gelince ID değişir
            current_id++;
            lost_frames = 0;
        }
        // Not: ByteTrack kaybolan kişileri (coasting) tahmin edip döndürebilir ama mock'ta doğrudan gizliyoruz.
    }
    
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
