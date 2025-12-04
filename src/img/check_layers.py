from PIL import Image
import os
import glob

def check_correspondence():
    # Full size with transparency
    full_files = sorted(glob.glob("Механик_*_Layer *.png"))
    # Cropped files
    crop_files = sorted(glob.glob("Layer *.png"))
    
    print(f"Found {len(full_files)} full files and {len(crop_files)} cropped files.")

    # Mapping logic: "Механик_0000_Layer 1.png" -> "Layer 1.png"
    for full_path in full_files:
        try:
            # Extract layer number
            name_part = full_path.rsplit('Layer ', 1)[1]
            layer_num = name_part.replace('.png', '')
            
            crop_path = f"Layer {layer_num}.png"
            
            if os.path.exists(crop_path):
                with Image.open(full_path) as full_img:
                    bbox = full_img.getbbox()
                    
                with Image.open(crop_path) as crop_img:
                    crop_size = crop_img.size
                
                print(f"Layer {layer_num}:")
                print(f"  Full BBox: {bbox}")
                print(f"  Crop Size: {crop_size}")
                
                if bbox:
                    w = bbox[2] - bbox[0]
                    h = bbox[3] - bbox[1]
                    if (w, h) == crop_size:
                        print("  -> Match! We can use BBox (left, top) for positioning.")
                    else:
                        print(f"  -> MISMATCH! BBox WxH: {w}x{h} vs Crop: {crop_size}")
            else:
                print(f"Layer {layer_num}: Cropped file '{crop_path}' not found.")

        except Exception as e:
            print(f"Error processing {full_path}: {e}")

if __name__ == "__main__":
    check_correspondence()
