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

int HumanTrackerInit() {
    // Initialize the YOLO / ByteTrack engine here in the future.
    // For now, we simulate a successful initialization.
    std::cout << "[HumanTracker] Motor initialized successfully." << std::endl;
    return 0;
}

char* HumanTrackerProcessFrame(const void* data, int size) {
    // Simulate walking person across the screen
    box_x += 15;
    
    // Her 40 frame'de bir (yaklaşık 12 saniye) kişi ekrandan çıkar ve yeni kişi gelir
    frame_count++;
    if (frame_count % 40 == 0) {
        box_x = 50;
        current_id++;
    }

    // Güvenilirlik eşiği (Confidence Threshold)
    const float CONFIDENCE_THRESHOLD = 0.65f;
    
    // Gerçek model eklendiğinde bu skor YOLO'dan gelecektir.
    // Şimdilik test amaçlı rastgele dalgalanan bir skor simüle edelim.
    float current_score = 0.85f;
    if (frame_count % 5 == 0) {
        current_score = 0.50f; // Bazen eşiğin altına düşsün (False Positive simülasyonu)
    }

    std::string mockup = "[]"; // Varsayılan olarak boş liste (kimse yok)
    
    // Filtreleme: Yalnızca skoru eşiğin üzerinde olanları JSON'a ekle
    if (current_score >= CONFIDENCE_THRESHOLD) {
        mockup = "[{\"id\": \"" + std::to_string(current_id) + "\", \"box\": [" + 
                 std::to_string(box_x) + ", " + std::to_string(box_y) + ", 120, 240], " +
                 "\"class\": \"person\", \"score\": " + std::to_string(current_score) + "}]";
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
