#include "human_tracker.h"
#include <iostream>
#include <cstring>
#include <cstdlib>
#include <string>
#include <vector>
#include <opencv2/opencv.hpp>
#include <opencv2/dnn.hpp>

using namespace cv;
using namespace cv::dnn;

static Net net;
static bool net_initialized = false;
static int next_id = 10000;

struct TrackedPerson {
    int id;
    Rect box;
    int lost_frames;
};
static std::vector<TrackedPerson> tracked_persons;

extern "C" {

int HumanTrackerInit() {
    try {
        net = readNetFromDarknet("models/yolov4-tiny.cfg", "models/yolov4-tiny.weights");
        net.setPreferableBackend(DNN_BACKEND_OPENCV);
        net.setPreferableTarget(DNN_TARGET_CPU);
        net_initialized = true;
        std::cout << "[HumanTracker] YOLOv4-tiny initialized successfully via OpenCV DNN." << std::endl;
        return 0;
    } catch (const std::exception& e) {
        std::cerr << "[HumanTracker] Error loading YOLO model: " << e.what() << std::endl;
        return -1;
    }
}

char* HumanTrackerProcessFrame(const void* data, int size) {
    if (!net_initialized) return strdup("[]");

    Mat frame = imdecode(Mat(1, size, CV_8UC1, (void*)data), IMREAD_COLOR);
    if (frame.empty()) return strdup("[]");

    const float CONFIDENCE_THRESHOLD = 0.60f;
    const float NMS_THRESHOLD = 0.40f;
    const int MAX_AGE = 90;
    const int CLASS_PERSON = 0;

    Mat blob = blobFromImage(frame, 1/255.0, Size(416, 416), Scalar(0,0,0), true, false);
    net.setInput(blob);
    
    std::vector<String> outNames = net.getUnconnectedOutLayersNames();
    std::vector<Mat> outs;
    net.forward(outs, outNames);

    std::vector<int> classIds;
    std::vector<float> confidences;
    std::vector<Rect> boxes;

    for (size_t i = 0; i < outs.size(); ++i) {
        float* data_ptr = (float*)outs[i].data;
        for (int j = 0; j < outs[i].rows; ++j, data_ptr += outs[i].cols) {
            Mat scores = outs[i].row(j).colRange(5, outs[i].cols);
            Point classIdPoint;
            double confidence;
            minMaxLoc(scores, 0, &confidence, 0, &classIdPoint);
            
            // Sadece CLASS 0 (İnsan) ve skor > 0.60
            if (confidence > CONFIDENCE_THRESHOLD && classIdPoint.x == CLASS_PERSON) {
                int centerX = (int)(data_ptr[0] * frame.cols);
                int centerY = (int)(data_ptr[1] * frame.rows);
                int width = (int)(data_ptr[2] * frame.cols);
                int height = (int)(data_ptr[3] * frame.rows);
                int left = centerX - width / 2;
                int top = centerY - height / 2;

                classIds.push_back(classIdPoint.x);
                confidences.push_back((float)confidence);
                boxes.push_back(Rect(left, top, width, height));
            }
        }
    }

    // Üst üste binen kutuları filtrele (Non-Maximum Suppression)
    std::vector<int> indices;
    NMSBoxes(boxes, confidences, CONFIDENCE_THRESHOLD, NMS_THRESHOLD, indices);

    std::vector<Rect> current_detections;
    std::vector<float> current_scores;
    for (int idx : indices) {
        current_detections.push_back(boxes[idx]);
        current_scores.push_back(confidences[idx]);
    }

    // Centroid Tracker Mantığı (Mesafe bazlı kimlik atama)
    std::vector<TrackedPerson> new_tracked_persons;
    std::vector<bool> matched_detections(current_detections.size(), false);
    std::vector<bool> matched_trackers(tracked_persons.size(), false);

    for (size_t i = 0; i < current_detections.size(); ++i) {
        Rect det = current_detections[i];
        Point det_centroid(det.x + det.width/2, det.y + det.height/2);
        
        int best_match_idx = -1;
        float min_dist = 150.0f; // Eşleşme için maksimum sapma mesafesi (piksel)
        
        for (size_t j = 0; j < tracked_persons.size(); ++j) {
            if (matched_trackers[j]) continue;
            
            Rect trk = tracked_persons[j].box;
            Point trk_centroid(trk.x + trk.width/2, trk.y + trk.height/2);
            
            float dist = norm(det_centroid - trk_centroid);
            if (dist < min_dist) {
                min_dist = dist;
                best_match_idx = j;
            }
        }
        
        if (best_match_idx != -1) {
            matched_trackers[best_match_idx] = true;
            matched_detections[i] = true;
            
            TrackedPerson tp = tracked_persons[best_match_idx];
            tp.box = det;
            tp.lost_frames = 0; // Bulundu, yaş sıfırlanır
            new_tracked_persons.push_back(tp);
        }
    }

    // Eşleşmeyen yeni insanlara yeni ID ver
    for (size_t i = 0; i < current_detections.size(); ++i) {
        if (!matched_detections[i]) {
            TrackedPerson tp;
            tp.id = next_id++;
            tp.box = current_detections[i];
            tp.lost_frames = 0;
            new_tracked_persons.push_back(tp);
        }
    }

    // Eşleşmeyen eski insanları MAX_AGE sınırına kadar hafızada tut
    for (size_t j = 0; j < tracked_persons.size(); ++j) {
        if (!matched_trackers[j]) {
            TrackedPerson tp = tracked_persons[j];
            tp.lost_frames++;
            if (tp.lost_frames <= MAX_AGE) {
                new_tracked_persons.push_back(tp);
            }
        }
    }

    tracked_persons = new_tracked_persons;

    // JSON Dizisi Oluştur
    std::string json = "[";
    bool first = true;
    for (size_t i = 0; i < current_detections.size(); ++i) {
        if (!first) json += ", ";
        
        int id = -1;
        for (auto& tp : tracked_persons) {
            if (tp.box == current_detections[i] && tp.lost_frames == 0) {
                id = tp.id;
                break;
            }
        }

        Rect b = current_detections[i];
        json += "{\"id\": \"" + std::to_string(id) + "\", ";
        json += "\"box\": [" + std::to_string(b.x) + ", " + std::to_string(b.y) + ", " + 
                std::to_string(b.width) + ", " + std::to_string(b.height) + "], ";
        json += "\"class\": \"person\", \"score\": " + std::to_string(current_scores[i]) + "}";
        
        first = false;
    }
    json += "]";
    
    char* ret = (char*)malloc(json.length() + 1);
    if (ret != NULL) {
        strcpy(ret, json.c_str());
    }
    return ret;
}

void HumanTrackerFreeResult(char* result) {
    if (result != NULL) {
        free(result);
    }
}

}
