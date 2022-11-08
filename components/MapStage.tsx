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
let mySessionId: string;
const MapStage = (props: any) => {
  const viewportRef = useRef<any>();
  const stageRef = useRef<any>();
  const characterRef = useCallbackRef(
    null,
    (ref: any) => ref && viewportRef?.current?.follow(ref)
  );
  // const sectionId = useRef<any>(null);

  const [characters, setCharacters] = useState<any>({});
  const [myCharacter, setMyCharacter] = useState<any>(null);

  const onAddCharacter = useCallback(
    (player: Player, sessionId: string) => {
      const isMine = sessionId === mySessionId;

      if (isMine) {
        setMyCharacter(
          <Character
            isMine={isMine}
            ref={characterRef}
            defaultPosition={{
              x: player.x,
              y: player.y,
            }}
            room={room}
          />
        );
        return;
      }

      const refCallback = (ref: any) => {
        player.onChange = (dataChange: DataChange[]) => {
          const isStop = dataChange?.find((item) => item?.field === "isStop");
          if (isStop?.value) {
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
              isMine={isMine}
              ref={refCallback}
              defaultPosition={{
                x: player.x,
                y: player.y,
              }}
            />
          ),
        };
      });
    },
    [characterRef]
  );

  const onConnectColyseus = useCallback(async () => {
    const client: Client = new Client("ws://localhost:2567");
    room = await client.joinOrCreate<State>("state_handler");
    mySessionId = room.sessionId;
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

  const handleMove = useCallback(
    (event: IJoystickUpdateEvent) => {
      if (!event.direction) {
        return;
      }

      switch (event.direction) {
        case "BACKWARD": {
          characterRef.current.handleMove("bottom");
          break;
        }
        case "LEFT": {
          characterRef.current.handleMove("left");
          break;
        }
        case "FORWARD": {
          characterRef.current.handleMove("top");
          break;
        }
        case "RIGHT": {
          characterRef.current.handleMove("right");
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
                {myCharacter}
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
