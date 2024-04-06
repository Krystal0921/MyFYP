import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
import tensorflowjs as tfjs


cap = cv2.VideoCapture(0)
detector = HandDetector(maxHands=1)
classifier = None  # Placeholder for the classifier model
offset = 20
imgSize = 300

# Save dataset to this location
folder = "Data/C"
counter = 0
labels = ["A", "B", "C", "D", "E", "7", "8", "9", "10"]

# Load the model from model.json and weights.bin
model = tfjs.converters.load_keras_model("Model/model.json")
model.load_weights("Model/weights.bin")
classifier = Classifier(model, labels)

while True:
    success, img = cap.read()
    imgOutput = img.copy()
    hands, img = detector.findHands(img)
    if hands:
        hand = hands[0]
        x, y, w, h = hand['bbox']

        # Make all the imgCrop resize within the imgWhite
        imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255

        # Crop the size of the hand
        imgCrop = img[y - offset: y + h + offset, x - offset: x + w + offset]
        
        imgCropShape = imgCrop.shape
    
        expectRatio = h / w

        # Adjust the width ratio of the image to show 
        if expectRatio > 1:
            k = imgSize / h
            wCal = math.ceil(k * w)
            imgResize = cv2.resize(imgCrop, (wCal, imgSize))
            imgResizeShape = imgResize.shape
            wGap = math.ceil((imgSize - wCal) / 2)
            imgWhite[:, wGap: wCal + wGap] = imgResize
            prediction, index = classifier.getPrediction(imgWhite, draw=False)
            print(prediction, index)
            
        # Adjust the height ratio of the image to show 
        else:
            k = imgSize / w
            hCal = math.ceil(k * h)
            imgResize = cv2.resize(imgCrop, (imgSize, hCal))
            imgResizeShape = imgResize.shape
            hGap = math.ceil((imgSize - hCal) / 2)
            imgWhite[hGap:hCal + hGap, :] = imgResize
            prediction, index = classifier.getPrediction(imgWhite, draw=False)

        # Show text of the result
        cv2.putText(imgOutput, labels[index], (x, y - 20), cv2.FONT_HERSHEY_COMPLEX, 2, (255, 0, 255), 2)
        cv2.imshow("ImageCrop", imgCrop)
        cv2.imshow("ImageWhite", imgWhite)

    cv2.imshow("Image", imgOutput)
    cv2.waitKey(1)