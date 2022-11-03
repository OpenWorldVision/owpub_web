import React, { useCallback, useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import AnimatedSprite from "./core/AnimatedSprite";
import { Text } from "react-pixi-fiber";

function Character(props: any) {
  const [textures, setTextures] = useState<PIXI.Texture[]>([]);
  const animationRef = useRef<any>(null);

  const onAssetsLoaded = useCallback(() => {
    const frames = [];

    for (let i = 0; i < 22; i++) {
      frames.push(PIXI.Texture.from(`Armature_Walk_00${i}.png`));
    }
    setTextures(frames);
  }, []);

  useEffect(() => {
    if (!PIXI.Loader.shared.resources["./sprites/Armature_Walk_00.json"]) {
      PIXI.Loader.shared
        .add("./sprites/Armature_Walk_00.json", { crossOrigin: "anonymous" })
        .load(onAssetsLoaded);
    } else {
      onAssetsLoaded();
    }
  }, []);

  const toggleAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.playing
        ? animationRef.current.stop()
        : animationRef.current.play();
    }
  }, []);

  const handleMove = useCallback((e) => {
    console.log(animationRef.current);
    if (animationRef.current) {
      animationRef.current.play();
      animationRef.current.x = animationRef.current.x + 10;
      animationRef.current.y = animationRef.current.y + 10;
      // const prevX = e.data?.tiltX;
      // const prevY = e.data?.tiltY;
      // animationRef.current.setTransform(prevX + 1, prevY + 1);
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
      pointerdown={handleMove}
      animationSpeed={0.3}
    />
  );
}

export default Character;
