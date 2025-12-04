import os
import glob
import random
from PIL import Image

# Configuration
CANVAS_WIDTH = 1952
CANVAS_HEIGHT = 2208
OUTPUT_CSS = "mechanic_animation.css"

def generate_final_css():
    # Pattern to match all full mechanic layer files
    full_files = sorted(glob.glob("Механик_*_Layer *.png"))
    
    css_output = []
    
    # Base CSS
    css_output.append("/* Generated Mechanic Animation CSS */")
    css_output.append(".mechanic-container {")
    css_output.append("    position: relative;")
    css_output.append("    width: 100%;")
    css_output.append(f"    aspect-ratio: {CANVAS_WIDTH} / {CANVAS_HEIGHT};")
    css_output.append("    overflow: hidden;")
    css_output.append("}")
    css_output.append("")
    css_output.append(".mechanic-bg {")
    css_output.append("    position: absolute;")
    css_output.append("    top: 0;")
    css_output.append("    left: 0;")
    css_output.append("    width: 100%;")
    css_output.append("    height: 100%;")
    css_output.append("    object-fit: contain;")
    css_output.append("    z-index: 0;")
    css_output.append("}")
    css_output.append("")
    css_output.append(".mechanic-layer {")
    css_output.append("    position: absolute;")
    css_output.append("    pointer-events: none;")
    css_output.append("    will-change: transform;")
    css_output.append("}")
    css_output.append("")

    print(f"Processing {len(full_files)} layers...")

    for filepath in full_files:
        try:
            # Extract layer number: "Механик_0001_Layer 18.png" -> "18"
            layer_num_str = filepath.rsplit('Layer ', 1)[1].replace('.png', '')
            layer_num = int(layer_num_str)
            class_name = f"mech-layer-{layer_num}"
            
            with Image.open(filepath) as img:
                bbox = img.getbbox()
            
            if not bbox:
                print(f"Skipping Layer {layer_num}: Empty image")
                continue

            # Calculate percentages
            x, y, right, bottom = bbox
            w = right - x
            h = bottom - y
            
            left_pct = (x / CANVAS_WIDTH) * 100
            top_pct = (y / CANVAS_HEIGHT) * 100
            width_pct = (w / CANVAS_WIDTH) * 100
            
            css_output.append(f"/* Layer {layer_num} */")
            css_output.append(f".{class_name} {{")
            css_output.append(f"    left: {left_pct:.4f}%;")
            css_output.append(f"    top: {top_pct:.4f}%;")
            css_output.append(f"    width: {width_pct:.4f}%;")
            css_output.append(f"    height: auto;")
            css_output.append(f"    z-index: {layer_num};")

            # Determine Animation Type
            # Rotation layers: 2, 18, 5, 16
            # 2 & 18 are gears (opposite directions)
            
            if layer_num == 2:
                # Gear 1: Rotate Clockwise
                css_output.append(f"    animation: rotate-cw 12s linear infinite;")
            elif layer_num == 18:
                # Gear 2: Rotate Counter-Clockwise
                css_output.append(f"    animation: rotate-ccw 12s linear infinite;")
            elif layer_num == 5:
                # Rotate CW
                css_output.append(f"    animation: rotate-cw 15s linear infinite;")
            elif layer_num == 16:
                # Rotate CCW
                css_output.append(f"    animation: rotate-ccw 20s linear infinite;")
            else:
                # Standard Levitation (Slower)
                duration = random.uniform(6.0, 9.0) # Slower
                delay = random.uniform(0.0, -6.0)
                amplitude_px = random.uniform(10, 20)
                
                css_output.append(f"    animation: float-{layer_num} {duration:.2f}s ease-in-out infinite;")
                css_output.append(f"    animation-delay: {delay:.2f}s;")

            css_output.append(f"}}")
            
            # Keyframes
            if layer_num not in [2, 18, 5, 16]:
                css_output.append(f"@keyframes float-{layer_num} {{")
                css_output.append(f"    0%, 100% {{ transform: translateY(0); }}")
                css_output.append(f"    50% {{ transform: translateY(-{amplitude_px:.1f}px); }}")
                css_output.append(f"}}")
            
            css_output.append("")

        except Exception as e:
            print(f"Error processing {filepath}: {e}")

    # Add Shared Rotation Keyframes
    css_output.append("/* Rotation Keyframes */")
    css_output.append("@keyframes rotate-cw {")
    css_output.append("    from { transform: rotate(0deg); }")
    css_output.append("    to { transform: rotate(360deg); }")
    css_output.append("}")
    css_output.append("@keyframes rotate-ccw {")
    css_output.append("    from { transform: rotate(0deg); }")
    css_output.append("    to { transform: rotate(-360deg); }")
    css_output.append("}")

    with open(OUTPUT_CSS, 'w', encoding='utf-8') as f:
        f.write("\n".join(css_output))
    
    print(f"CSS written to {OUTPUT_CSS}")

if __name__ == "__main__":
    generate_final_css()