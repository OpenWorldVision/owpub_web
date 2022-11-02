import { Stage } from "@inlet/react-pixi";
import React from "react";
import { JsxElement } from "typescript";

const MyStage = (props) => <Stage>{props.children}</Stage>;

export default MyStage;
