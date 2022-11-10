import { Sprite, Stage } from "react-pixi-fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Character from "./Character";
import { Group } from "@pixi/layers";
import ViewPort from "./core/ViewPort";
import { useCallbackRef } from "use-callback-ref";
import * as PIXI from "pixi.js";
import LayerStage from "./core/LayerStage";
import Layer from "./core/Layer";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../constants";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { Client, Room } from "colyseus.js";
import { Player, State } from "./state/State";
import { DataChange } from "@colyseus/schema";

const background = "sprites/backgroundFull.png";
const backgroundSize = {
  width: 1470 * 2,
  height: 2100 * 2,
};
let room: Room<State>;
const MapStage = (props: any) => {
  const viewportRef = useRef<any>();
  const stageRef = useRef<any>();

  const [characters, setCharacters] = useState<any>({});

  const onAddCharacter = useCallback((player: Player, sessionId: string) => {
    const refCallback = (ref: any) => {
      player.onChange = (dataChange: DataChange[]) => {
        const isWalking = dataChange?.find(
          (item) => item?.field === "isWalking"
        );

        if (isWalking && !isWalking?.value) {
          ref?.handleStop();
          return;
        }

        const posX = dataChange?.find((item) => item?.field === "x");
        const posY = dataChange?.find((item) => item?.field === "y");

        let direction;

        if (posX) {
          const changeX = posX?.value - posX?.previousValue;
          if (changeX > 0) {
            direction = "right";
          }
          if (changeX < 0) {
            direction = "left";
          }
        }
        if (posY) {
          const changeY = posY?.value - posY?.previousValue;

          if (changeY > 0) {
            direction = "bottom";
          }
          if (changeY < 0) {
            direction = "top";
          }
        }

        if (direction) {
          ref?.handleMove(direction);
        }
      };
    };

    player.onRemove = () => {
      setCharacters((prev: any) => {
        const newState = { ...prev };
        if (newState[sessionId]) {
          delete newState[sessionId];
        }
        return newState;
      });
    };

    setCharacters((prev: any) => {
      return {
        ...prev,
        [sessionId]: (
          <Character
            key={sessionId}
            ref={refCallback}
            defaultPosition={{
              x: player.x,
              y: player.y,
            }}
          />
        ),
      };
    });
    // }
  }, []);

  const onConnectColyseus = useCallback(async () => {
    const client: Client = new Client("ws://localhost:2567");
    room = await client.joinOrCreate<State>("state_handler");
    room.state.players.onAdd = onAddCharacter;
  }, [onAddCharacter]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.pinch().wheel().decelerate();
      viewportRef.current.pinch().wheel().decelerate().setZoom(0.4);
    }
    onConnectColyseus();
  }, [onConnectColyseus]);

  const options = useMemo(
    () => ({
      resizeTo: window,
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    []
  );

  // const joystickGroup = new Group(3, false);
  const playerGroup = new Group(2, false);
  const mapGroup = new Group(-1, false);

  const handleMove = useCallback((event: IJoystickUpdateEvent) => {
    if (!event.direction) {
      return;
    }
    let addPosition = { x: 0, y: 0 };

    switch (event.direction) {
      case "BACKWARD": {
        addPosition.y = 2;
        break;
      }
      case "LEFT": {
        addPosition.x = -2;
        break;
      }
      case "FORWARD": {
        addPosition.y = -2;
        break;
      }
      case "RIGHT": {
        addPosition.x = 2;
        break;
      }
      default: {
        break;
      }
    }
    const isUpdatePosition = addPosition.x !== 0 || addPosition.y !== 0;
    if (isUpdatePosition) {
      room?.send("move", { ...addPosition, isWalking: true });
    }
  }, []);

  const handleStop = useCallback(() => {
    room?.send("move", { x: 0, y: 0, isWalking: false });
  }, []);

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
                {Object.values(characters)?.map((character: any) => character)}
              </Sprite>
            </Layer>
          </LayerStage>
        </ViewPort>
      </Stage>
    </>
  );
};

export default MapStage;
