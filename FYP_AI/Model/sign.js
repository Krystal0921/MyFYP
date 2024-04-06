// import { Camera, CameraType } from "expo-camera";
// import { useState } from "react";
// import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export default function App() {
//   const [type, setType] = useState(CameraType.back);
//   const [permission, requestPermission] = Camera.useCameraPermissions();

//   if (!permission) {
//     // Camera permissions are still loading
//     return <View />;
//   }

//   if (!permission.granted) {
//     // Camera permissions are not granted yet
//     return (
//       <View style={styles.container}>
//         <Text style={{ textAlign: "center" }}>
//           We need your permission to show the camera
//         </Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   function toggleCameraType() {
//     setType((current) =>
//       current === CameraType.back ? CameraType.front : CameraType.back
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera style={styles.camera} type={type}>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
//             <Text style={styles.text}>Flip Camera</Text>
//           </TouchableOpacity>
//         </View>
//       </Camera>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   camera: {
//     alignItems: "center",
//     justifyContent: "center",
//     width: 300,
//     height: 500,
//     margin: 64,
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "transparent",
//     margin: 64,
//   },
//   button: {
//     flex: 1,
//     alignSelf: "flex-end",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
// });
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";

const TensorCamera = cameraWithTensors(Camera);

function CameraScreen() {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    setupCamera();
    loadModel();
  }, []);

  async function setupCamera() {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      setIsCameraReady(true);
    } else {
      alert("Camera permission not granted");
    }
  }

  async function loadModel() {
    try {
      await tf.ready();
      const modelJson = require("./assets/Model/model.json");
      const model = await tf.loadGraphModel(
        bundleResourceIO(modelJson, "model.json")
      );
      setModel(model);
    } catch (e) {
      console.log("Error loading model:", e);
    }
  }

  async function processCameraFrame(images, updatePreview, gl) {
    const imageTensor = images.next().value;

    // Preprocess the image (if needed) before passing it to the model
    const preprocessedImage = preprocessImage(imageTensor);

    // Run inference on the preprocessed image
    const predictions = await runInference(preprocessedImage);

    // Update the UI with the predictions
    setPredictions(predictions);

    // Dispose the image tensor to release memory
    tf.dispose(imageTensor);

    // Call the updatePreview function to render the processed frame on the screen
    updatePreview();
  }

  function preprocessImage(imageTensor) {
    // Perform any preprocessing steps required by your model
    // For example, resizing the image, normalizing pixel values, etc.
    // Modify this function based on your specific preprocessing requirements

    const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const normalizedImage = resizedImage.div(255.0);
    return normalizedImage;
  }

  async function runInference(imageTensor) {
    // Run your trained model on the input image tensor
    // Modify this function based on your specific model and prediction logic

    const predictions = await model.predict(imageTensor);
    return predictions;
  }

  async function takePicture() {
    if (isCameraReady) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImageUri(photo.uri);
    }
  }

  async function saveImageToCache() {
    if (capturedImageUri) {
      const filename = capturedImageUri.split("/").pop();
      const destinationUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.moveAsync({
        from: capturedImageUri,
        to: destinationUri,
      });
      alert(`Image saved to cache: ${destinationUri}`);
    }
  }

  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        cameraTextureHeight={1200}
        cameraTextureWidth={1600}
        resizeHeight={640}
        resizeWidth={480}
        resizeDepth={3}
        onReady={handleCameraReady}
        autorender={true}
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
        onTensorGenerated={processCameraFrame}
      />
      {capturedImageUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Preview:</Text>
          <Image
            style={styles.previewImage}
            source={{ uri: capturedImageUri }}
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveImageToCache}
          >
            <Text style={styles.saveButtonText}>Save to Cache</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    aspectRatio: 1,
  },
  previewContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  previewText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default CameraScreen;
