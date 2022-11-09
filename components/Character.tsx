import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as PIXI from "pixi.js";
import AnimatedSprite from "./core/AnimatedSprite";
import { Text, usePixiTicker } from "react-pixi-fiber";
import { ANIMATION_SPEED, SPEED } from "../constants";
import { Room } from "colyseus.js";
import { State } from "./state/State";
type InputType = {
  left: boolean;
  bottom: boolean;
  top: boolean;
  right: boolean;
};

const ASSETS = [
  {
    id: "female01",
    pathWalk: "sprites/female01-walk.json",
    pathStand: "sprites/female01-stand.json",
    baseNameWalk: "Armature_Walk_",
    baseNameStand: "Armature_Stand_",
    numFrameWalk: 22,
    numFrameStand: 20,
  },
  {
    id: "male01",
    pathWalk: "sprites/male01-walk.json",
    pathStand: "sprites/male01-stand.json",
    baseNameWalk: "Armature_Walk_",
    baseNameStand: "Armature_Stand_",
    numFrameWalk: 22,
    numFrameStand: 20,
  },
  {
    id: "male02",
    pathWalk: "sprites/male02-walk.json",
    pathStand: "sprites/male02-stand.json",
    baseNameWalk: "Armature_Walk_",
    baseNameStand: "Armature_Stand_",
    numFrameWalk: 22,
    numFrameStand: 20,
  },
  {
    id: "male03",
    pathWalk: "sprites/male03-walk.json",
    pathStand: "sprites/male03-stand.json",
    baseNameWalk: "Armature_Walk_",
    baseNameStand: "Armature_Stand_",
    numFrameWalk: 22,
    numFrameStand: 20,
  },
];

type Props = {
  defaultPosition: { x: number; y: number };
  isMine?: boolean;
  room?: Room<State>;
};
function Character(props: Props, ref: any) {
  const { defaultPosition, isMine, room } = props;
  const [texturesWalk, setTexturesWalk] = useState<PIXI.Texture[]>([]);
  const [texturesStand, setTexturesStand] = useState<PIXI.Texture[]>([]);

  const [isWalking, setIsWaking] = useState<boolean>(false);
  const [isFlip, setIsFlip] = useState<boolean>(false);
  const animationRef = useRef<any>(null);
  const isSetDefaultPosition = useRef<boolean>(false);
  const speedRef = useRef<number>(0);
  const keys = useRef<InputType>({
    left: false,
    bottom: false,
    top: false,
    right: false,
  });

  const clearKeys = useCallback(() => {
    keys.current.bottom = false;
    keys.current.left = false;
    keys.current.right = false;
    keys.current.top = false;
  }, []);

  const onWalking = useCallback((isKeyUp?: boolean) => {
    const arrayKeys = Object.keys(keys?.current);

    const arrayValues = Object.values(keys?.current);
    setIsWaking((prevState) => {
      const indexKey = arrayValues?.findIndex((item) => item);
      const newState = indexKey !== -1;
      if (newState === prevState) return prevState;
      return newState;
    });
    const parseObjToArray: { key: String; isKeyDown: boolean }[] =
      arrayKeys?.map((key, index) => ({
        key,
        isKeyDown: arrayValues[index],
      }));

    const isRight = !!parseObjToArray?.filter(
      (item) => item?.isKeyDown && item?.key === "right"
    )?.length;
    const isLeft = !!parseObjToArray?.filter(
      (item) => item?.isKeyDown && item?.key === "left"
    )?.length;
    if (!isKeyUp && (isRight || isLeft)) {
      setIsFlip((prevStateFlip) => {
        if (isRight === prevStateFlip) return prevStateFlip;
        return isRight;
      });
    }
  }, []);

  const handleStop = useCallback(() => {
    setIsWaking(false);
    clearKeys();
    onWalking(true);
    if (isMine) {
      const currentPosition = {
        x: 0,
        y: 0,
        isWalking: false,
      };
      room?.send("move", currentPosition);
    }
  }, [clearKeys, isMine, onWalking, room]);

  const handleMove = useCallback(
    (e: string, speed: number = SPEED) => {
      switch (e) {
        case "bottom":
        case "left":
        case "top":
        case "right":
          clearKeys();
          keys.current[e] = true;
          speedRef.current = speed;
          onWalking(false);
          break;
      }
    },
    [clearKeys, onWalking]
  );

  const onLoadAssets = useCallback(() => {
    const asset = ASSETS[Math.floor(Math.random() * ASSETS?.length)];

    PIXI.Loader.shared
      .add(asset.pathStand, {
        crossOrigin: "anonymous",
      })
      .add(asset.pathWalk, {
        crossOrigin: "anonymous",
      })
      .load(() => {
        const framesStand = [];
        const framesWalk = [];
        for (let i = 0; i < asset.numFrameStand; i++) {
          framesStand.push(
            PIXI.Texture.from(
              `${asset.baseNameStand}${i < 10 ? `0${i}` : i}.png`
            )
          );
        }
        for (let i = 0; i < asset.numFrameWalk; i++) {
          framesWalk.push(
            PIXI.Texture.from(
              `${asset.baseNameWalk}${i < 10 ? `0${i}` : i}.png`
            )
          );
        }
        setTexturesWalk(framesWalk);
        setTexturesStand(framesStand);
      });
  }, []);

  const onSetDefaultPosition = useCallback(() => {
    if (!isSetDefaultPosition.current && animationRef.current) {
      isSetDefaultPosition.current = true;
      animationRef.current.position = defaultPosition;
    }
  }, [defaultPosition]);

  useEffect(() => {
    PIXI.Loader.shared.reset();
    onLoadAssets();
    return () => {
      PIXI.Loader.shared.reset();
    };
  }, [onLoadAssets]);

  useEffect(() => {
    if (texturesStand.length && texturesWalk.length) {
      onSetDefaultPosition();
      !animationRef?.current?.playing && animationRef?.current?.play();
      if (animationRef.current.scale.y !== 0.65) {
        animationRef.current.scale.y = 0.65;
      }
      if (animationRef.current.anchor.x !== 0.5) {
        animationRef.current.anchor.x = 0.5;
      }
      animationRef.current.scale.x = isFlip ? -0.65 : 0.65;
    }
  }, [
    texturesWalk.length,
    texturesStand.length,
    isWalking,
    isFlip,
    onSetDefaultPosition,
  ]);

  const pixiTicker = useCallback(
    (deltaTime: number) => {
      if (!animationRef.current) {
        return;
      }

      let addPosition = { x: 0, y: 0 };

      if (keys.current.bottom) {
        addPosition.y = speedRef.current;
      }
      if (keys.current.left) {
        addPosition.x = -speedRef.current;
      }
      if (keys.current.top) {
        addPosition.y = -speedRef.current;
      }
      if (keys.current.right) {
        addPosition.x = speedRef.current;
      }

      if (addPosition.x !== 0) {
        animationRef.current.x = animationRef.current.x + addPosition.x;
      }
      if (addPosition.y !== 0) {
        animationRef.current.y = animationRef.current.y + addPosition.y;
      }
      const isUpdatePosition = addPosition.x !== 0 || addPosition.y !== 0;
      if (isMine && isUpdatePosition) {
        room?.send("move", { ...addPosition, isWalking: true });
      }
    },
    [isMine, room]
  );

  usePixiTicker(pixiTicker);

  useImperativeHandle(ref, () => {
    if (!animationRef.current) {
      return;
    }
    animationRef.current.handleMove = handleMove;
    animationRef.current.handleStop = handleStop;
    return animationRef.current;
  });

  const handleClick = useCallback(() => {
    // @ts-ignore
    // window?.ReactNativeWebView?.postMessage("CHAT_ACTION");
  }, []);

  if (texturesStand.length === 0 || texturesWalk.length === 0) {
    return <Text text="loading assets..." />;
  }

  return (
    <>
      <AnimatedSprite
        ref={animationRef}
        textures={isWalking ? texturesWalk : texturesStand}
        interactive={true}
        animationSpeed={ANIMATION_SPEED}
        roundPixels={true}
        width={100}
        height={200}
        loop
        pointerdown={handleClick}
        x={window.innerHeight * 2}
        y={window.innerWidth * 1.5}
      />
    </>
  );
}

export default forwardRef(Character);
