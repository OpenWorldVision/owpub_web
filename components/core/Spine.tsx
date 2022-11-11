import * as PIXI from "pixi.js";
import { Spine } from "pixi-spine";
import { CustomPIXIComponent } from "react-pixi-fiber";

export default CustomPIXIComponent(
  {
    customDisplayObject: (props: any) => {
      return new Spine(props.path);
    },
  },
  "AnimationSpine"
);
