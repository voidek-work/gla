import os
import glob

def generate_html():
    # Current directory contains the images
    bg_files = glob.glob("Механик_*_Background.png")
    bg_file = bg_files[0] if bg_files else None

    # Find layers
    layer_files = sorted(glob.glob("Механик_*_Layer *.png"))

    if not layer_files:
        print("WARNING: No layer files found in current directory!")
        print(f"Current dir: {os.getcwd()}")
        # Debug listing
        # print(os.listdir('.'))

    html = []
    html.append('<!DOCTYPE html>')
    html.append('<html lang="ru">')
    html.append('<head>')
    html.append('    <meta charset="UTF-8">')
    html.append('    <meta name="viewport" content="width=device-width, initial-scale=1.0">')
    html.append('    <title>Mechanic Animation Preview</title>')
    html.append('    <link rel="stylesheet" href="mechanic_animation.css">')
    html.append('    <style>')
    html.append('        body { background: #222; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; overflow: hidden; }')
    html.append('        .preview-wrapper { width: 100%; max-width: 800px; position: relative; }')
    html.append('        .mechanic-container { position: relative; width: 100%; aspect-ratio: 1952 / 2208; }')
    html.append('        .mechanic-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 0; }')
    html.append('        .mechanic-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; }')
    html.append('    </style>')
    html.append('</head>')
    html.append('<body>')
    html.append('    <div class="preview-wrapper">')
    html.append('        <div class="mechanic-container">')

    if bg_file:
        html.append(f'            <img src="{bg_file}" class="mechanic-bg" alt="Background">')
    
    for f in layer_files:
        try:
            # Extract layer number
            # format: Механик_0000_Layer 1.png
            name_part = f.rsplit('Layer ', 1)[1]
            layer_num = name_part.replace('.png', '')
            
            class_name = f"mech-layer-{layer_num}"
            z_index = int(layer_num)
        except:
            class_name = ""
            z_index = 1
        
        html.append(f'            <img src="{f}" class="mechanic-layer {class_name}" style="z-index: {z_index};" alt="Layer">')

    html.append('        </div>')
    html.append('    </div>')
    html.append('</body>')
    html.append('</html>')

    with open('preview.html', 'w', encoding='utf-8') as f:
        f.write('\n'.join(html))
    
    print(f"Preview HTML generated with {len(layer_files)} layers.")

if __name__ == "__main__":
    generate_html()
