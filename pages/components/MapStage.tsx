import { Container, Stage } from "react-pixi-fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { Tilemap, useTilemapLoader } from "react-pixi-tilemap";
import Character from "./Character";
import LayerStage from "./core/LayerStage";
import { Group } from "@pixi/layers";
import Layer from "./core/Layer";
import ViewPort from "./core/ViewPort";

const tilemap = "stages/map.tmx";

const MapStage = (props: any) => {
  const map = useTilemapLoader(tilemap);
  const viewportRef = useRef<any>();
  const stageRef = useRef<any>();
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.drag().pinch().wheel().decelerate();
    }
  }, []);

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
    <Stage options={options} ref={stageRef}>
      <ViewPort
        ref={viewportRef}
        worldWidth={1600}
        worldHeight={1200}
        screenWidth={window.innerWidth}
        screenHeight={window.innerHeight}
        interaction={stageRef.current?._app.current.renderer}
      >
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
      </ViewPort>
    </Stage>
  );
};

export default MapStage;
