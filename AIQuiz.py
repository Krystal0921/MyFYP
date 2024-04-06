from flask import Flask, request, jsonify
import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
import base64
from PIL import Image
import io

app = Flask(__name__)

def calculate_accuracy(prediction):
    max_prob = max(prediction)
    total_sum = sum(prediction)
    accuracy = (max_prob / total_sum) * 100
    return accuracy


def predict_label(base64_image):
    detector = HandDetector(maxHands=1)
    classifier = Classifier("Model/keras_model.h5", "Model/labels.txt")
    offset = 20
    imgSize = 300

    # Decode the base64 image data
    image_bytes = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(image_bytes))
    img = np.array(image)
    imgOutput = img.copy()
    hands, img = detector.findHands(img)
    if hands:
        hand = hands[0]
        x, y, w, h = hand['bbox']

        imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255
        imgCrop = img[y - offset: y + h + offset, x - offset: x + w + offset]

        # Check if the cropped hand region has valid dimensions
        if imgCrop.shape[0] > 0 and imgCrop.shape[1] > 0:
            expectRatio = h / w

            if expectRatio > 1:
                k = imgSize / h
                wCal = math.ceil(k * w)
                imgResize = cv2.resize(imgCrop, (wCal, imgSize))
                imgResizeShape = imgResize.shape
                wGap = math.ceil((imgSize - wCal) / 2)
                imgWhite[:, wGap: wCal + wGap] = imgResize
                prediction, index = classifier.getPrediction(imgWhite, draw=False)
                print(prediction, index)
            else:
                k = imgSize / w
                hCal = math.ceil(k * h)
                imgResize = cv2.resize(imgCrop, (imgSize, hCal))
                imgResizeShape = imgResize.shape
                hGap = math.ceil((imgSize - hCal) / 2)
                imgWhite[hGap:hCal + hGap, :] = imgResize
                prediction, index = classifier.getPrediction(imgWhite, draw=False)

            # Calculate accuracy
            accuracy = calculate_accuracy(prediction)

            # Return the label prediction if accuracy is above 80%
            if accuracy > 80:
                labels = ["A", "B", "C", "D", "E", "7", "8", "9", "10"]
                predicted_label = labels[index]
                return predicted_label

    return None


@app.route('/predict', methods=['POST'])
def predict():
    try:
        req_data = request.get_json()
        base64_image = req_data['image']
        predicted_label = predict_label(base64_image)
        if predicted_label is not None:
            return jsonify({'predicted_label': predicted_label})
        else:
            return jsonify({'predicted_label': None})
    except Exception as e:
        print("Error: " + str(e))
        return jsonify({'predicted_label': None})


if __name__ == '__main__':
    app.run()