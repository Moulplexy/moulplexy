Plexy customization model

- model.png: the real photographic product model used by the website.
- layers/material_mask.png: ONLY the Plexy plate area that may change color.
- layers/material.png: transparent cutout of that editable Plexy area.
- layers/fixed_details.png: fixed pixels (background, gold writing/flower, edges, stand, reflections).

The website never recolors the complete photo. It recolors only material_mask.png and keeps the rest of model.png unchanged.
