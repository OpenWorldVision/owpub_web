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
};
function Character(props: Props, ref: any) {
  const { defaultPosition, isMine } = props;
  const [texturesWalk, setTexturesWalk] = useState<PIXI.Texture[]>([]);
  const [texturesStand, setTexturesStand] = useState<PIXI.Texture[]>([]);

  const [isWalking, setIsWorking] = useState<boolean>(false);
  const [isFlip, setIsFlip] = useState<boolean>(false);
  const isSetDefaultPosition = useRef<boolean>(false);
  const animationRef = useRef<any>(null);
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
    setIsWorking((prevState) => {
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
    setIsWorking(false);
    clearKeys();
    onWalking(true);
  }, [clearKeys, onWalking]);

  const handleKeyDown = useCallback(
    (e: string) => {
      switch (e) {
        case "bottom":
        case "left":
        case "top":
        case "right":
          clearKeys();
          keys.current[e] = true;
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
    onLoadAssets();

    return () => {
      PIXI.Loader.shared.reset();
    };
  }, []);

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

  const pixiTicker = useCallback((deltaTime: number) => {
    if (!animationRef.current) {
      return;
    }

    if (keys.current.bottom) {
      animationRef.current.y = animationRef.current.y + SPEED;
    }
    if (keys.current.left) {
      animationRef.current.x = animationRef.current.x - SPEED;
    }
    if (keys.current.top) {
      animationRef.current.y = animationRef.current.y - SPEED;
    }
    if (keys.current.right) {
      animationRef.current.x = animationRef.current.x + SPEED;
    }
  }, []);

  usePixiTicker(pixiTicker);

  useImperativeHandle(ref, () => {
    if (!animationRef.current) {
      return;
    }
    animationRef.current.handleKeyDown = handleKeyDown;
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
