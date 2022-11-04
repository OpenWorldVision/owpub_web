import { Sprite, Stage } from "react-pixi-fiber";
import React, { useEffect, useMemo, useRef } from "react";
// @ts-ignore
import { Tilemap, useTilemapLoader, useCollisions } from "react-pixi-tilemap";
import Character from "./Character";
import { Group } from "@pixi/layers";
import ViewPort from "./core/ViewPort";
import { useCallbackRef } from "use-callback-ref";
import JoyStickPixi from "./core/JoystickPixi";
import * as PIXI from "pixi.js";

const tilemap = "stages/map.tmx";
const background = "sprites/backgroundFull.png";

const MapStage = (props: any) => {
  // const map = useTilemapLoader(tilemap);

  const viewportRef = useRef<any>();
  const stageRef = useRef<any>();
  const characterRef = useCallbackRef(null, (ref) =>
    viewportRef?.current?.follow(ref)
  );

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.pinch().wheel().decelerate();
    }
    // if (!PIXI.Loader.shared.resources["outer"]) {
    //   PIXI.Loader.shared
    //     .add("outer", "./sprites/joystick.png")
    //     // .add("inner", "./sprites/joystick-handle.png")
    //     .load();
    // }
  }, []);

  const options = useMemo(
    () => ({
      resizeTo: window,
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    []
  );
  const joystickGroup = new Group(3, false);
  const playerGroup = new Group(2, false);
  const mapGroup = new Group(-1, false);

  return (
    <Stage options={options} ref={stageRef} scale={1}>
      <ViewPort
        ref={viewportRef}
        worldWidth={1470}
        worldHeight={2100}
        screenWidth={window.innerWidth}
        screenHeight={window.innerHeight}
        interaction={stageRef.current?._app.current.renderer}
      >
        {/* <Tilemap map={map}>
          <Character ref={characterRef} />
        </Tilemap> */}
        <Sprite texture={PIXI.Texture.from(background)}>
          <Character ref={characterRef} />
        </Sprite>
        <LayerStage enableSort>
          <Layer group={joystickGroup} />
          <Layer group={playerGroup} />
          <Layer group={mapGroup} />
        </LayerStage>
        <Container>
          <Tilemap map={map} />
        </Container>
        <Container>
          <Character />
        </Container>
        <Container>
          <JoyStickPixi />
        </Container>
      </ViewPort>
    </Stage>
  );
};

export default MapStage;
