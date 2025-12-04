import os
import glob
import random
from PIL import Image

# Configuration
IMAGE_DIR = "."
OUTPUT_CSS = "mechanic_animation.css"
FILE_PATTERN = "Механик_*_Layer *.png"

def generate_css_and_coords():
    files = sorted(glob.glob(os.path.join(IMAGE_DIR, FILE_PATTERN)))
    
    if not files:
        print("No matching files found!")
        return

    css_output = []
    coords_output = []
    
    # Base CSS for container and shared styles
    css_output.append("/* Container should be relative to hold absolute layers */")
    css_output.append(".mechanic-container {")
    css_output.append("    position: relative;")
    css_output.append("    width: 100%;")
    css_output.append("    /* Aspect ratio can be maintained via padding-bottom or aspect-ratio property */")
    css_output.append("    aspect-ratio: 1952 / 2208;")
    css_output.append("}")
    css_output.append("")
    css_output.append(".mechanic-layer {")
    css_output.append("    position: absolute;")
    css_output.append("    top: 0;")
    css_output.append("    left: 0;")
    css_output.append("    width: 100%;")
    css_output.append("    height: 100%;")
    css_output.append("    pointer-events: none; /* Let clicks pass through if needed */")
    css_output.append("}")
    css_output.append("")

    print(f"{'Filename':<40} | {'Bounding Box (L, T, R, B)':<30} | {'Center (X, Y)':<20}")
    print("-" * 95)

    for filepath in files:
        filename = os.path.basename(filepath)
        
        # Extract layer number for class name (e.g., "Layer 1" -> "layer-1")
        try:
            layer_part = filename.split('_')[-1].replace('.png', '') # "Layer 1"
            layer_num = layer_part.replace('Layer ', '')
            class_name = f"mech-layer-{layer_num}"
        except:
            class_name = f"mech-layer-{random.randint(1000, 9999)}"

        # Image Processing
        with Image.open(filepath) as img:
            bbox = img.getbbox()
            if bbox:
                cx = (bbox[0] + bbox[2]) / 2
                cy = (bbox[1] + bbox[3]) / 2
                coords_msg = f"{str(bbox):<30} | ({cx:.1f}, {cy:.1f})"
            else:
                coords_msg = f"{('Empty/Transparent'):<30} | (- , -)"
            
            print(f"{filename:<40} | {coords_msg}")

        # Animation Parameters
        # Randomize to create organic feeling
        duration = random.uniform(3.0, 6.0)
        delay = random.uniform(0.0, 3.0)
        # Amplitude: slightly vary how much they move (e.g., 10px to 20px)
        amplitude = random.uniform(10.0, 20.0) 
        
        # Determine direction (some start going up, some down? No, delay handles offset usually, 
        # but we can define keyframes dynamically if we want distinct patterns. 
        # For simplicity, we use one keyframe definition but apply it differently? 
        # No, to be truly different, let's just use one keyframe but different timing is usually enough.
        # User asked for "slightly different". 
        
        # Let's generate a specific keyframe for each to vary amplitude easily without CSS variables (for wider compat)
        # or use CSS variables. CSS variables are cleaner.
        
        css_output.append(f"/* {filename} */")
        css_output.append(f".{class_name} {{")
        css_output.append(f"    animation: float-{layer_num} {duration:.2f}s ease-in-out infinite;")
        css_output.append(f"    animation-delay: -{delay:.2f}s; /* Negative delay starts immediately at that offset */")
        css_output.append(f"}}")
        css_output.append(f"@keyframes float-{layer_num} {{")
        css_output.append(f"    0%, 100% {{ transform: translateY(0); }}")
        css_output.append(f"    50% {{ transform: translateY(-{amplitude:.1f}px); }}")
        css_output.append(f"}}")
        css_output.append("")

    with open(OUTPUT_CSS, 'w', encoding='utf-8') as f:
        f.write("\n".join(css_output))
    
    print(f"\nCSS written to {OUTPUT_CSS}")

if __name__ == "__main__":
    generate_css_and_coords()
