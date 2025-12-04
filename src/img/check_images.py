from PIL import Image
import os

files = ['Механик_0017_Background.png', 'Механик_0009_Layer 10.png']
# We are running inside src/img, so files are in the current directory
base_dir = '.' 

for f in files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        img = Image.open(path)
        print(f"File: {f}, Size: {img.size}, Mode: {img.mode}")
        if 'Layer' in f:
            bbox = img.getbbox()
            print(f"  Bounding Box (left, upper, right, lower): {bbox}")
            if bbox:
                width = bbox[2] - bbox[0]
                height = bbox[3] - bbox[1]
                cx = bbox[0] + width / 2
                cy = bbox[1] + height / 2
                print(f"  Center relative to canvas: ({cx}, {cy})")
    else:
        print(f"File not found: {path}")