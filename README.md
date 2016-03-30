# tb-free-draw
Simple canvas allows drawing lines with touchscreen and exports to model as png.

## Example

	<canvas draw-to="yourModel" tb-free-draw></canvas>


Initialize by adding the **tb-free-draw** attribute to a <canvas> tag.

Use **draw-to** attribute to bind controller model.

**$broadcast** the event *tb.freedraw.clear* to clear the directive; 
