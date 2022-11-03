import { CustomPIXIComponent } from "react-pixi-fiber";
import { Layer } from "@pixi/layers";

const TYPE = "Layer";
const behavior = {
  customDisplayObject: ({ group }) => new Layer(group),
};

export default CustomPIXIComponent(behavior, TYPE);
