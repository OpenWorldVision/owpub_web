import {
  Sprite,
  Stage,
  Container,
  Text,
  usePixiTicker,
} from "react-pixi-fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { SPEED, WORLD_HEIGHT, WORLD_WIDTH } from "../constants";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";

const tilemap = "stages/map.tmx";
const background = "sprites/backgroundFull.png";
const backgroundSize = {
  width: 1470 * 2,
  height: 2100 * 2,
};

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
      viewportRef.current.pinch().wheel().decelerate();
      viewportRef.current.pinch().wheel().decelerate().setZoom(0.4);
    }
    console.log(viewportRef.current.pinch().wheel());
  }, []);

  const options = useMemo(
    () => ({
      resizeTo: window,
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    []
  );

  const defaultPosition = useMemo(() => {
    return {
      x: backgroundSize.width / 2,
      y: backgroundSize.height / 3,
    };
  }, []);

  // const joystickGroup = new Group(3, false);
  const playerGroup = new Group(2, false);
  const mapGroup = new Group(-1, false);

  const handleMove = useCallback(
    (event: IJoystickUpdateEvent) => {
      if (!event.direction) {
        return;
      }

      switch (event.direction) {
        case "BACKWARD": {
          characterRef.current.y = characterRef.current.y + SPEED;
          characterRef.current.handleKeyDown("bottom");
          break;
        }
        case "LEFT": {
          characterRef.current.x = characterRef.current.x - SPEED;
          characterRef.current.handleKeyDown("left");
          break;
        }
        case "FORWARD": {
          characterRef.current.y = characterRef.current.y - SPEED;
          characterRef.current.handleKeyDown("top");
          break;
        }
        case "RIGHT": {
          characterRef.current.x = characterRef.current.x + SPEED;
          characterRef.current.handleKeyDown("right");
          break;
        }
        default: {
          break;
        }
      }
    },
    [characterRef]
  );

  const handleStop = useCallback(() => {
    characterRef.current?.handleStop();
  }, [characterRef]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          width: "fit-content",
        }}
      >
        <Joystick
          size={100}
          sticky={false}
          move={handleMove}
          stop={handleStop}
          baseImage="./sprites/joystick.png"
          stickImage="./sprites/joystick-handle.png"
        />
      </div>
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
            <Layer group={playerGroup}></Layer>
            <Layer group={mapGroup}>
              <Sprite
                texture={PIXI.Texture.from(background)}
                {...backgroundSize}
              >
                <Character
                  ref={characterRef}
                  defaultPosition={defaultPosition}
                  onLoadJoyStick={() => setJoystickLoaded(true)}
                />
              </Sprite>
            </Layer>
          </LayerStage>
        </ViewPort>
      </Stage>
    </>
  );
};

export default MapStage;
