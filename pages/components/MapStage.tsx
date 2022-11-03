import { Sprite, Stage } from "@inlet/react-pixi";
import { Texture } from "pixi.js";
import React from "react";
import { Tilemap, useTilemapLoader } from "react-pixi-tilemap";

const tilemap = "stages/map.tmx";

const MapStage = (props: any) => {
  const map = useTilemapLoader(tilemap);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{ resizeTo: window }}
    >
      <Tilemap map={map} />
    </Stage>
  );
};

export default MapStage;
