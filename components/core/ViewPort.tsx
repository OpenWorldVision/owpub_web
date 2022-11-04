import { CustomPIXIComponent } from "react-pixi-fiber";
import { Viewport } from "pixi-viewport";

export default CustomPIXIComponent(
  {
    customDisplayObject: function (props: any) {
      return new Viewport({
        screenWidth: props.innerWidth,
        screenHeight: props.innerHeight,
        worldWidth: props.worldWidth,
        worldHeight: props.worldHeight,
        interaction: props.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
      });
    },
  },
  "ViewPort"
);
