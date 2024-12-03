from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import tensorflow as tf
import numpy as np
import cv2
import base64

router = APIRouter()

TFLITE_MODEL_PATH = "./model_unquant.tflite"

# Load TensorFlow Lite model
try:
    interpreter = tf.lite.Interpreter(model_path=TFLITE_MODEL_PATH)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    class_names = ["confident", "unconfident"]
except Exception as e:
    interpreter = None

@router.websocket("/analyze")
async def analyze_posture(websocket: WebSocket):
    if not interpreter:
        await websocket.close()
        return

    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            image_data = base64.b64decode(data)
            img = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)

            img = cv2.resize(img, (224, 224))
            input_data = np.expand_dims(img, axis=0).astype(np.float32) / 255.0

            interpreter.set_tensor(input_details[0]['index'], input_data)
            interpreter.invoke()
            predictions = interpreter.get_tensor(output_details[0]['index'])[0]
            label = class_names[np.argmax(predictions)]

            await websocket.send_json({"label": label})
    except WebSocketDisconnect:
        pass
