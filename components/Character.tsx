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
type InputType = {
  ArrowLeft: boolean;
  ArrowDown: boolean;
  ArrowUp: boolean;
  ArrowRight: boolean;
};
const SPEED = 2.5;
const ANIMATION_SPEED = 0.5;

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
  defaultPosition: string;
  onLoadJoyStick: () => void;
};
function Character(props: Props, ref: any) {
  const { defaultPosition, onLoadJoyStick } = props;
  const [textures, setTextures] = useState<PIXI.Texture[]>([]);
  const [texturesStand, setTexturesStand] = useState<PIXI.Texture[]>([]);

  const [isWalking, setIsWorking] = useState<boolean>(false);
  const [isFlip, setIsFlip] = useState<boolean>(false);

  const animationRef = useRef<any>(null);
  const keys = useRef<InputType>({
    ArrowLeft: false,
    ArrowDown: false,
    ArrowUp: false,
    ArrowRight: false,
  });

  const onWalking = useCallback((isKeyUp?: boolean) => {
    const arrayKeys = Object.keys(keys?.current);
    const arrayValues = Object.values(keys?.current);

    setIsWorking((prevState) => {
      const indexKey = arrayValues?.findIndex((item) => item);
      const newState = indexKey !== -1;
      if (newState === prevState) return prevState;
      return newState;
    });
    //
    const parseObjToArray: { key: String; isKeyDown: boolean }[] =
      arrayKeys?.map((key, index) => ({
        key,
        isKeyDown: arrayValues[index],
      }));
    const isRight = !!parseObjToArray?.filter(
      (item) => item?.isKeyDown && item?.key === "ArrowRight"
    )?.length;

    const isLeft = !!parseObjToArray?.filter(
      (item) => item?.isKeyDown && item?.key === "ArrowLeft"
    )?.length;

    if (!isKeyUp && (isRight || isLeft)) {
      setIsFlip((prevStateFlip) => {
        if (isRight === prevStateFlip) return prevStateFlip;
        return isRight;
      });
    }
  }, []);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowUp":
        case "ArrowRight":
          keys.current[e.code] = false;
          onWalking(true);
          break;
      }
    },
    [onWalking]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowUp":
        case "ArrowRight":
          keys.current[e.code] = true;
          onWalking();
          break;
      }
    },
    [onWalking]
  );

  const onLoadAssets = useCallback(
    (
      path: string,
      baseName: string,
      numFrame: number,
      callback: (frames: any) => void
    ) => {
      const onLoadSuccess = () => {
        const frames = [];
        for (let i = 0; i < numFrame; i++) {
          frames.push(
            PIXI.Texture.from(`${baseName}${i < 10 ? `0${i}` : i}.png`)
          );
        }
        callback && callback(frames);
      };

      PIXI.Loader.shared.reset();
      PIXI.Loader.shared
        .add(path, { crossOrigin: "anonymous" })
        .add("./sprites/joystick.png", {
          crossOrigin: "anonymous",
        })
        .add("./sprites/joystick-handle.png", {
          crossOrigin: "anonymous",
          onComplete: () => {
            console.log("Joystick load");
            return onLoadJoyStick();
          },
        })
        .load(onLoadSuccess);
    },
    []
  );

  useEffect(() => {
    const asset = ASSETS[Math.floor(Math.random() * ASSETS?.length)];
    onLoadAssets(
      asset.pathStand,
      asset.baseNameStand,
      asset.numFrameStand,
      (frames) => {
        setTimeout(() => {
          onLoadAssets(
            asset.pathWalk,
            asset.baseNameWalk,
            asset.numFrameWalk,
            (framesWalk) => {
              setTextures(framesWalk);
              setTexturesStand(frames);
            }
          );
        }, 1000);
      }
    );

    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleKeyDown);
      PIXI.Loader.shared.reset();
    };
  }, []);

  useEffect(() => {
    if (texturesStand.length && textures.length) {
      !animationRef?.current?.playing && animationRef?.current?.play();
      if (animationRef.current.scale.y !== 0.65) {
        animationRef.current.scale.y = 0.65;
      }
      if (animationRef.current.anchor.x !== 0.5) {
        animationRef.current.anchor.x = 0.5;
      }
      animationRef.current.scale.x = isFlip ? -0.65 : 0.65;
    }
  }, [textures.length, texturesStand.length, isWalking, isFlip]);

  const move = useCallback(() => {
    if (!animationRef.current) {
      return;
    }
    if (keys.current.ArrowDown) {
      animationRef.current.y = animationRef.current.y + SPEED;
    }
    if (keys.current.ArrowLeft) {
      animationRef.current.x = animationRef.current.x - SPEED;
    }
    if (keys.current.ArrowUp) {
      animationRef.current.y = animationRef.current.y - SPEED;
    }
    if (keys.current.ArrowRight) {
      animationRef.current.x = animationRef.current.x + SPEED;
    }
  }, []);

  usePixiTicker(move);

  useImperativeHandle(ref, () => animationRef.current);

  const handleClick = useCallback(() => {
    // @ts-ignore
    window?.ReactNativeWebView?.postMessage("CHAT_ACTION");
  }, []);

  if (texturesStand.length === 0) {
    return <Text text="loading assets..." />;
  }

  return (
    <AnimatedSprite
      ref={animationRef}
      position={defaultPosition}
      textures={isWalking ? textures : texturesStand}
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
  );
}

export default forwardRef(Character);