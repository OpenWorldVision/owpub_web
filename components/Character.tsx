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
const SPEED = 1;

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

function Character(props: any, ref: any) {
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
      if (animationRef.current.scale.y !== 0.56) {
        animationRef.current.scale.y = 0.56;
      }
      if (animationRef.current.anchor.x !== 0.5) {
        animationRef.current.anchor.x = 0.5;
      }
      animationRef.current.scale.x = isFlip ? -0.56 : 0.56;
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

  if (texturesStand.length === 0) {
    return <Text text="loading assets..." />;
  }

  return (
    <AnimatedSprite
      ref={animationRef}
      position="300,75"
      textures={isWalking ? textures : texturesStand}
      interactive={true}
      animationSpeed={SPEED * 0.8}
      roundPixels={true}
      width={100}
      height={200}
      loop
    />
  );
}

export default forwardRef(Character);
