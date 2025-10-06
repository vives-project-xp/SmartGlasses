import cv2 as cv
import mediapipe.python.solutions.hands as mp_hands
import mediapipe.python.solutions.drawing_utils as drawing
import mediapipe.python.solutions.drawing_styles as drawing_styles
import numpy as np
import os
import json

# Initialize the Hands model
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=1,
    model_complexity=1,
    min_detection_confidence=0.75,
    )

# Folder of images to process
IMAGE_FOLDER = './images/dataset'

# Add padding to the bottom of the image
def pad_bottom(image, pad):
    return cv.copyMakeBorder(image, 0, pad, 0, 0, cv.BORDER_REPLICATE)

# Enlarge the image if its smallest side is less than min_side
def ensure_min_size(image, min_side):
    h, w = image.shape[:2]
    scale = max(1.0, min_side / max(h, w))
    if scale == 1.0: return image
    return cv.resize(image, (int(w*scale), int(h*scale)), interpolation=cv.INTER_LINEAR)

# Indices for Metacarpophalangeal joints and fingertip landmarks
MCP = [5, 9, 13, 17]
TIPS = [4, 8, 12, 16, 20]

# Function to check if the wrist position is plausible
def wrist_plausible(lms, W, H, tol=0.55):
    pts = np.array([[lm.x*W, lm.y*H] for lm in lms])
    wrist = pts[0]
    mcp = pts[MCP]
    tips = pts[TIPS]
    hand_span = np.linalg.norm(pts[5]-pts[17])
    
    # Space between MCP index and pinky
    if hand_span < 1e-6: 
        return False
    # Wrist should have some distance from MCPs
    if np.mean(np.linalg.norm(mcp - wrist, axis=1))/hand_span < tol:
        return False
    # Wrist should be below the MCPs
    if not (wrist[1] > np.percentile(tips[:,1], 60)):
        return False
    
    return True

# Try variants for each image to improve hand detection
def variants_selector(image):
    yield image, "orig"
    yield cv.flip(image, 1), "flip"
    for ang in (-15, 15):
        M = cv.getRotationMatrix2D((image.shape[1]/2, image.shape[0]/2), ang, 1.0)
        yield cv.warpAffine(image, M, (image.shape[1], image.shape[0])), f"rot{ang}"

for root, dirs, files in os.walk(IMAGE_FOLDER):
    for file in files:
        if not file.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        file_path = os.path.join(root, file)
        img = cv.imread(file_path)
        if img is None:
            print(f"[ERR] cannot read {file_path}")
            continue

        img = ensure_min_size(pad_bottom(img, 40), 512)

        picked = None
        for var_img, tag in variants_selector(img):
            H, W = var_img.shape[:2]
            results = hands.process(cv.cvtColor(var_img, cv.COLOR_BGR2RGB))
            if not results.multi_hand_landmarks:
                continue
            hand_landmarks = results.multi_hand_landmarks[0]
            if wrist_plausible(hand_landmarks.landmark, W, H):
                picked = (var_img, hand_landmarks, tag)
                break

        if not picked:
            print(f"[WARN] no hand detected in any variant for {file_path}")
            continue

        var_img, hand_landmarks, tag = picked

        # Draw hand landmarks on the image.
        annotated_image = var_img.copy()
        drawing.draw_landmarks(
            annotated_image,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS,
            landmark_drawing_spec=drawing_styles.get_default_hand_landmarks_style(),
            connection_drawing_spec=drawing_styles.get_default_hand_connections_style())

        # Extract and append landmarks info to a JSON file in the same folder as the image
        landmark_list = [{'x': lm.x, 'y': lm.y, 'z': lm.z} for lm in hand_landmarks.landmark]
        # Save JSON in the same directory as the image
        json_path = os.path.join(root, 'landmarks_all.json')
        entry = {
            'image': os.path.relpath(file_path, root),
            'variant': tag,
            'landmarks': landmark_list
        }
        # Load existing data if file exists
        if os.path.exists(json_path):
            with open(json_path, 'r') as json_file:
                data = json.load(json_file)
        else:
            data = []
        data.append(entry)
        with open(json_path, 'w') as json_file:
            json.dump(data, json_file, indent=2)
        print(f"[INFO] appended landmarks to {json_path} (variant: {tag})")

        # # Optionally save the annotated image
        # annotated_path = os.path.splitext(file_path)[0] + f'_annotated_{tag}.jpg'
        # cv.imwrite(annotated_path, annotated_image)
        # print(f"[INFO] saved annotated image to {annotated_path}")