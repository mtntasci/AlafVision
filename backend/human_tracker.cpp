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

    // COCO Class ID Filtrelemesi: Sadece Person (0) kabul edilecek
    const int CLASS_PERSON = 0;
    int detected_class = 0; // Simülasyon: Algılanan sınıf (0=İnsan, 62=TV/Monitor vb.)
    
    // Rastgele sahte tespit (Monitor) simülasyonu
    if (frame_count % 75 == 0) {
        detected_class = 62; // 62: TV/Monitor
    }

    // Tracker & NMS Ayarları
    const float CONFIDENCE_THRESHOLD = 0.60f; // Esnetilmiş eşik (Küçük insanlar için)
    // float NMS_IOU_THRESHOLD = 0.45f; // Gerçek motorda Non-Maximum Suppression eşiği
    const int MAX_AGE = 60; // 60 frame boyunca hafızada tut
    
    float current_score = 0.85f;
    
    // Modelin zorlandığı (örneğin kameranın bulanıklaştığı) 2-3 karelik bir an simüle edelim
    if (frame_count % 50 == 0 || frame_count % 51 == 0) {
        current_score = 0.45f; // Eşiğin altında (False Negative durumu)
    }

    std::string mockup = "[]"; 
    
    // Adım 1: Sadece İnsan (0) sınıfı
    // Adım 2: Güvenilirlik eşiği >= 0.60
    // Adım 3: (Gerçek motor entegre edildiğinde burada NMS filtrelemesi uygulanır)
    if (detected_class == CLASS_PERSON && current_score >= CONFIDENCE_THRESHOLD) {
        // Kişi yüksek güvenilirlikle tespit edildi. Tracker süresi sıfırlanır.
        lost_frames = 0;
        mockup = "[{\"id\": \"" + std::to_string(current_id) + "\", \"box\": [" + 
                 std::to_string(box_x) + ", " + std::to_string(box_y) + ", 120, 240], " +
                 "\"class\": \"person\", \"score\": " + std::to_string(current_score) + "}]";
    } else {
        // Kişi tespit edilemedi veya sınıf insan değil (Örn: Monitor). 
        // Ancak MAX_AGE bitene kadar ID'yi öldürmüyoruz.
        lost_frames++;
        if (lost_frames > MAX_AGE) {
            current_id++;
            lost_frames = 0;
        }
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
