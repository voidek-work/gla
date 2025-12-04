import os
import glob

def generate_final_html():
    # Find background
    bg_files = glob.glob("Механик_*_Background.png")
    bg_file = bg_files[0] if bg_files else "background_placeholder.png"

    html = []
    html.append('<!DOCTYPE html>')
    html.append('<html lang="ru">')
    html.append('<head>')
    html.append('    <meta charset="UTF-8">')
    html.append('    <meta name="viewport" content="width=device-width, initial-scale=1.0">')
    html.append('    <title>Mechanic Levitation</title>')
    html.append('    <link rel="stylesheet" href="mechanic_animation.css">')
    html.append('    <style>')
    html.append('        body { background: #1a1a1a; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }')
    html.append('        .preview-wrapper { width: 100%; max-width: 600px; box-shadow: 0 0 30px rgba(0,0,0,0.8); }')
    html.append('    </style>')
    html.append('</head>')
    html.append('<body>')
    html.append('    <div class="preview-wrapper">')
    html.append('        <div class="mechanic-container">')
    html.append(f'            <img src="{bg_file}" class="mechanic-bg" alt="Background">')
    
    # Check for layers up to 20 just to be safe, or find all Layer *.png
    # We want numeric sort
    
    # Get all "Layer *.png" files
    files = glob.glob("Layer *.png")
    
    # Extract numbers and sort
    layer_nums = []
    for f in files:
        try:
            num = int(f.replace('Layer ', '').replace('.png', ''))
            layer_nums.append(num)
        except:
            pass
    
    layer_nums.sort()
    
    for i in layer_nums:
        filename = f"Layer {i}.png"
        html.append(f'            <img src="{filename}" class="mechanic-layer mech-layer-{i}" alt="Layer {i}">')

    html.append('        </div>')
    html.append('    </div>')
    html.append('</body>')
    html.append('</html>')

    with open('preview.html', 'w', encoding='utf-8') as f:
        f.write('\n'.join(html))
    
    print(f"HTML written to preview.html with {len(layer_nums)} layers.")

if __name__ == "__main__":
    generate_final_html()