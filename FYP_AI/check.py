import cv2
import numpy as np
import math
import base64
import io
from PIL import Image
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier


def predict_label(base64_image):
    detector = HandDetector(maxHands=1)
    classifier = Classifier("Model/keras_model.h5", "Model/labels.txt")
    offset = 20
    imgSize = 300

    image_data = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(image_data))
    img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
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
                labels = ["A", "B", "C", "D", "E", "7", "8", "9", "10"]
                predicted_label = labels[index]
                return predicted_label

    return "No hand detected in the image."
