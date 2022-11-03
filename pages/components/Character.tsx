import React, { useCallback, useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import AnimatedSprite from "./core/AnimatedSprite";
import { Text } from "react-pixi-fiber";

function Character(props: any) {
  const [textures, setTextures] = useState<PIXI.Texture[]>([]);
  const animationRef = useRef<any>(null);

  const onAssetsLoaded = useCallback(() => {
    const frames = [];

    for (let i = 0; i < 16; i++) {
      frames.push(PIXI.Texture.from(`male02${i}.png`));
    }

    setTextures(frames);
  }, []);

  useEffect(() => {
    if (!PIXI.Loader.shared.resources["./sprites/male02.json"]) {
      PIXI.Loader.shared
        .add("./sprites/male02.json", { crossOrigin: "anonymous" })
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

  if (textures.length === 0) {
    return <Text text="loading assets..." />;
  }
  return (
    <AnimatedSprite
      ref={animationRef}
      position="300,75"
      textures={textures}
      interactive={true}
      pointerdown={toggleAnimation}
      animationSpeed={0.6}
    />
  );
}

export default Character;
