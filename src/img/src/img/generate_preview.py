import os
import glob

def generate_html():
    # Assuming we are running in src/img
    bg_files = glob.glob("Механик_*_Background.png")
    bg_file = bg_files[0] if bg_files else None

    # Find layers - sort by filename to keep order (0000, 0001, etc)
    # The files are named Механик_0000_Layer 1.png, etc.
    layer_files = sorted(glob.glob("Механик_*_Layer *.png"))

    html = []
    html.append('<!DOCTYPE html>')
    html.append('<html lang="ru">')
    html.append('<head>')
    html.append('    <meta charset="UTF-8">')
    html.append('    <meta name="viewport" content="width=device-width, initial-scale=1.0">')
    html.append('    <title>Mechanic Animation Preview</title>')
    html.append('    <link rel="stylesheet" href="mechanic_animation.css">')
    html.append('    <style>')
    html.append('        body { background: #222; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }')
    html.append('        .preview-wrapper { width: 100%; max-width: 800px; border: 1px solid #444; box-shadow: 0 0 20px rgba(0,0,0,0.5); }')
    html.append('        /* Ensure the background image behaves as a layer too */')
    html.append('        .mechanic-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 0; }')
    html.append('    </style>')
    html.append('</head>')
    html.append('<body>')
    html.append('    <div class="preview-wrapper">')
    html.append('        <div class="mechanic-container">')

    if bg_file:
        html.append(f'            <img src="{bg_file}" class="mechanic-bg" alt="Background">')
    
    for f in layer_files:
        # Extract layer number for class and z-index
        # Example: Механик_0000_Layer 1.png
        try:
            # Split by underscore, get part with "Layer", then extract number
            # It's safer to look for "Layer " in the string
            name_part = f.rsplit('Layer ', 1)[1] # "1.png"
            layer_num = name_part.replace('.png', '') # "1"
            
            class_name = f"mech-layer-{layer_num}"
            # z-index: Layer 1 is bottom, Layer 17 is top
            z_index = int(layer_num)
        except Exception as e:
            print(f"Error parsing filename {f}: {e}")
            class_name = ""
            z_index = 1
        
        html.append(f'            <img src="{f}" class="mechanic-layer {class_name}" style="z-index: {z_index};" alt="Layer {layer_num}">')

    html.append('        </div>')
    html.append('    </div>')
    html.append('</body>')
    html.append('</html>')

    with open('preview.html', 'w', encoding='utf-8') as f:
        f.write('\n'.join(html))
    
    print(f"Preview HTML generated: {os.path.abspath('preview.html')}")

if __name__ == "__main__":
    generate_html()
