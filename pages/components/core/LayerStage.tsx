import { CustomPIXIComponent } from "react-pixi-fiber";
import { Stage } from "@pixi/layers";
const TYPE = "LayeredStage";
const behavior = {
  customDisplayObject: ({ enableSort = false }) => {
    const stage = new Stage();
    stage.sortableChildren = true;
    return stage;
  },
  customDidAttach: (instance) => {
    const updateStage = () => {
      instance.updateStage();
      instance._updateStageRafId = window.requestAnimationFrame(updateStage);
    };
    updateStage();
  },
  customWillDetach: (instance) => {
    window.cancelAnimationFrame(instance._updateStageRafId);
    instance.destroy();
  },
};

export default CustomPIXIComponent(behavior, TYPE);
