COLOR CUSTOMIZATION ASSET SYSTEM

The customization system is layer-based. The photographic model is always the base image. Only dedicated material masks are recolored.

Folders:
- plexy_colors/                  -> Plexy only
- 3od_colors/                    -> wood only
- 3od_plexy_colors_different/    -> Plexy + wood, separate colors
- 3od_plexy_colors_uniform/      -> Plexy + wood, one shared color

Each model uses model.png plus 700x700 masks in layers/. The masks were made for the exact model.png they belong to.

Fixed elements such as the background, writing, flower, gold decoration, stand and reflections are never recolored.

Mirror colors are rendered by script.js only inside the corresponding material masks; old flat mirror JPG mockups are not used by the customization preview.
