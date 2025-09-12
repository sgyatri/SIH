"""import cv2
import numpy as np
from tensorflow.keras.models import load_model

# 1️⃣ Load the trained ASL model
model = load_model('asl_alphabet_cnn.keras')

# 2️⃣ Define class labels (29 classes)
class_labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
                'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
                'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']

# 3️⃣ Start webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # 4️⃣ Preprocess frame for model
    roi = cv2.resize(frame, (64, 64))           # resize to model input
    roi = cv2.cvtColor(roi, cv2.COLOR_BGR2RGB) # convert to RGB
    roi = roi / 255.0                           # normalize
    roi = np.expand_dims(roi, axis=0)           # shape (1,64,64,3)

    # 5️⃣ Predict
    pred = model.predict(roi)
    class_index = np.argmax(pred)
    predicted_class = class_labels[class_index]

    # 6️⃣ Display prediction on frame
    cv2.putText(frame, f'Prediction: {predicted_class}', (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)
    cv2.imshow("ASL Webcam", frame)

    # 7️⃣ Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
"""
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from collections import deque, Counter

# 1️⃣ Load the trained model
model = load_model('asl_alphabet_cnn.keras')

# 2️⃣ Class labels (29 classes)
class_labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
                'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
                'U', 'V', 'W', 'X', 'Y', 'Z', 'del', 'nothing', 'space']

# 3️⃣ Start webcam
cap = cv2.VideoCapture(0)

# 4️⃣ Prediction smoothing (last 5 frames)
pred_queue = deque(maxlen=5)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # 5️⃣ Flip frame horizontally for natural interaction
    frame = cv2.flip(frame, 1)

    # 6️⃣ Define ROI (green box)
    x1, y1, x2, y2 = 150, 100, 450, 400  # adjust size as needed
    roi = frame[y1:y2, x1:x2]

    # 7️⃣ Preprocess ROI
    roi_resized = cv2.resize(roi, (64, 64))
    roi_rgb = cv2.cvtColor(roi_resized, cv2.COLOR_BGR2RGB)
    roi_normalized = roi_rgb / 255.0
    roi_input = np.expand_dims(roi_normalized, axis=0)

    # 8️⃣ Predict
    pred = model.predict(roi_input)
    class_index = np.argmax(pred)
    pred_queue.append(class_index)

    # 9️⃣ Get most common prediction in last 5 frames
    if len(pred_queue) > 0:
        most_common_index = Counter(pred_queue).most_common(1)[0][0]
        predicted_class = class_labels[most_common_index]
    else:
        predicted_class = ""

    # 10️⃣ Draw ROI and prediction
    cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)
    cv2.putText(frame, f'Prediction: {predicted_class}', (10, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255,0), 2)

    cv2.imshow("ASL Real-Time", frame)

    # 11️⃣ Exit on 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
