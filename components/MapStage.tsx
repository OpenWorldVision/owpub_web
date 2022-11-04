import { Sprite, Stage, Container } from "react-pixi-fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore
import { Tilemap, useTilemapLoader, useCollisions } from "react-pixi-tilemap";
import Character from "./Character";
import { Group } from "@pixi/layers";
import ViewPort from "./core/ViewPort";
import { useCallbackRef } from "use-callback-ref";
import JoyStickPixi from "./core/JoystickPixi";
import * as PIXI from "pixi.js";
import LayerStage from "./core/LayerStage";
import Layer from "./core/Layer";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../constants";

const tilemap = "stages/map.tmx";
const background = "sprites/backgroundFull.png";

const MapStage = (props: any) => {
  // const map = useTilemapLoader(tilemap);
  const [joystickLoaded, setJoystickLoaded] = useState(false);

  const viewportRef = useRef<any>();
  const stageRef = useRef<any>();
  const joystickRef = useRef<any>();
  const characterRef = useCallbackRef(null, (ref: any) =>
    viewportRef?.current?.follow(ref)
  );

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.pinch().wheel().decelerate().setZoom(0.4);
    }
    console.log(joystickRef.current);
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
        worldWidth={WORLD_WIDTH}
        worldHeight={WORLD_HEIGHT}
        screenWidth={window.innerWidth}
        screenHeight={window.innerHeight}
        interaction={stageRef.current?._app.current.renderer}
      >
        <LayerStage enableSort>
          <Layer group={joystickGroup} />
          <Layer group={playerGroup} />
          <Layer group={mapGroup} />
        </LayerStage>
        <Container>
          {joystickLoaded && <JoyStickPixi ref={joystickRef} />}
        </Container>
        <Container />
        <Container>
          <Sprite texture={PIXI.Texture.from(background)}>
            <Character
              ref={characterRef}
              defaultPosition={`${window.innerWidth / 2} ${
                window.innerHeight / 2
              }`}
              onLoadJoyStick={() => setJoystickLoaded(true)}
            />
          </Sprite>
        </Container>
      </ViewPort>
    </Stage>
  );
};

export default MapStage;
