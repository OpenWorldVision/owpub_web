import { CustomPIXIComponent } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

export default CustomPIXIComponent(
  {
    customDisplayObject: function (props: any) {
      return new PIXI.AnimatedSprite(props.textures, props.autoupdate);
    },
  },
  "AnimatedSprite"
);
