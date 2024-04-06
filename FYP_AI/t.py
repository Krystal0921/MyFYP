import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math


def predict_label(image_path):
    detector = HandDetector(maxHands=1)
    classifier = Classifier("Model/keras_model.h5", "Model/labels.txt")
    offset = 20
    imgSize = 300

    img = cv2.imread(image_path)
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

            # Return the label prediction
            return prediction, index

    return None, None


# Example usage
image_path = "testData/E.png"
prediction, index = predict_label(image_path)
if prediction is not None and index is not None:
    labels = ["A", "B", "C", "D", "E", "7", "8", "9", "10"]
    predicted_label = labels[index]
    print(f"Prediction: {predicted_label}")
    print(f"Prediction: {prediction}, Index: {index}")
else:
    print("No hand detected in the image.")