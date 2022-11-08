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

const background = "sprites/backgroundFull.png";
const backgroundSize = {
  width: 1470 * 2,
  height: 2100 * 2,
};

const MapStage = (props: any) => {
  const viewportRef = useRef<any>();
  const stageRef = useRef<any>();
  const characterRef = useCallbackRef(null, (ref: any) =>
    viewportRef?.current?.follow(ref)
  );
  const sectionId = useRef<any>(null);

  const [characters, setCharacters] = useState<any>({});
  const [myCharacter, setMyCharacter] = useState<any>(null);

  const onConnectColyseus = useCallback(async () => {
    const client: Client = new Client("ws://13.251.125.9:2567/");
    let room: Room<State> = await client.joinOrCreate<State>("state_handler");
    sectionId.current = room.sessionId;
    room.state.players.onAdd = (player: Player, sessionId: string) => {
      const isMine = sessionId === sectionId.current;
      let _player: any;
      let refPlayer: any;

      const callbackRef = (ref: any) => {
        if (!ref) return;
        if (isMine) {
          viewportRef?.current?.follow(ref);
        } else {
          refPlayer = ref;
        }
      };

      if (isMine) {
        // setMyCharacter();
        // <Character isMine={isMine} ref={callbackRef} room={room} />
        return;
      }

      player.onChange = (position) => {
        const x = position?.find((item) => item?.field === "x");

        if (x !== undefined) {
          // refPlayer.x = x?.value;
        }
        const y = position?.find((item) => item?.field === "y");

        if (y !== undefined) {
          // refPlayer.y = y?.value;
        }
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

      // _player = <Character isMine={isMine} ref={callbackRef} />;
      setCharacters((prev: any) => {
        return {
          ...prev,
          [sessionId]: _player,
        };
      });
    };
  }, []);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.pinch().wheel().decelerate();
      viewportRef.current.pinch().wheel().decelerate().setZoom(0.4);
    }
    // onConnectColyseus();
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
          characterRef.current.handleKeyDown("bottom");
          break;
        }
        case "LEFT": {
          characterRef.current.handleKeyDown("left");
          break;
        }
        case "FORWARD": {
          characterRef.current.handleKeyDown("top");
          break;
        }
        case "RIGHT": {
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
