import { CustomPIXIComponent } from "react-pixi-fiber";
import { Layer } from "@pixi/layers";

const TYPE = "Layer";
const behavior = {
  // @ts-ignore
  customDisplayObject: ({ group }) => new Layer(group),
};

export default CustomPIXIComponent(behavior, TYPE);
