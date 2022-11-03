import React, { useCallback, useEffect, useRef, useState } from "react";
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
function Character(props: any) {
  const [textures, setTextures] = useState<PIXI.Texture[]>([]);
  const animationRef = useRef<any>(null);
  const keys = useRef<InputType>({
    ArrowLeft: false,
    ArrowDown: false,
    ArrowUp: false,
    ArrowRight: false,
  });

  const onAssetsLoaded = useCallback(() => {
    const frames = [];

    for (let i = 0; i < 22; i++) {
      frames.push(PIXI.Texture.from(`Armature_Walk_00${i}.png`));
    }
    setTextures(frames);
  }, []);
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // @ts-ignore
    keys.current[e.code] = false;
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // @ts-ignore
    keys.current[e.code] = true;
  }, []);

  useEffect(() => {
    if (!PIXI.Loader.shared.resources["./sprites/Armature_Walk_00.json"]) {
      PIXI.Loader.shared
        .add("./sprites/Armature_Walk_00.json", { crossOrigin: "anonymous" })
        .load(onAssetsLoaded);
    } else {
      onAssetsLoaded();
    }
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const move = useCallback(() => {
    if (!animationRef.current) {
      return;
    }

    if (keys.current.ArrowDown) {
      if (!animationRef.current.playing) {
        animationRef.current.play();
      }
      animationRef.current.y = animationRef.current.y + SPEED;
    }
    if (keys.current.ArrowLeft) {
      if (!animationRef.current.playing) {
        animationRef.current.play();
      }
      animationRef.current.x = animationRef.current.x - SPEED;
    }
    if (keys.current.ArrowUp) {
      if (!animationRef.current.playing) {
        animationRef.current.play();
      }
      animationRef.current.y = animationRef.current.y - SPEED;
    }
    if (keys.current.ArrowRight) {
      if (!animationRef.current.playing) {
        animationRef.current.play();
      }
      animationRef.current.x = animationRef.current.x + SPEED;
    }
  }, []);

  usePixiTicker(move);

  const toggleAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.playing
        ? animationRef.current.stop()
        : animationRef.current.play();
    }
  }, []);

  if (textures.length === 0) {
    return <Text text="loading assets..." />;
  }
  return (
    <AnimatedSprite
      ref={animationRef}
      position="300,75"
      textures={textures}
      interactive={true}
      // pointerdown={handleMove}
      animationSpeed={SPEED}
      roundPixels={true}
      width={100}
      height={200}
      loop={false}
    />
  );
}

export default Character;
