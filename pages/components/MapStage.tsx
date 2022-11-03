import { Container, Stage } from "react-pixi-fiber";
import React, { useMemo } from "react";
import { Tilemap, useTilemapLoader } from "react-pixi-tilemap";
import Character from "./Character";
import LayerStage from "./LayerStage";
import { Group } from "@pixi/layers";
import Layer from "./Layer";

const tilemap = "stages/map.tmx";

const MapStage = (props: any) => {
  const map = useTilemapLoader(tilemap);
  const options = useMemo(
    () => ({
      resizeTo: window,
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    []
  );

  const playerGroup = new Group(2, false);
  const mapGroup = new Group(-1, false);

  return (
    <Stage options={options}>
      <LayerStage enableSort>
        <Layer group={playerGroup} />
        <Layer group={mapGroup} />
      </LayerStage>
      <Container>
        <Tilemap map={map} />
      </Container>
      <Container>
        <Character />
      </Container>
    </Stage>
  );
};

export default MapStage;
