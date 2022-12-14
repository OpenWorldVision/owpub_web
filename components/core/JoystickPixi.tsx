import React, { useEffect } from "react";
import { CustomPIXIComponent } from "react-pixi-fiber";
import { Joystick } from "pixi-virtual-joystick";
import * as PIXI from "pixi.js";
import { Rectangle } from "pixi.js";
const joystick = "sprites/joystick.png";
const joystickHandle = "sprites/joystick-handle.png";

export default CustomPIXIComponent(
  {
    customDisplayObject: function (props: any) {
      return new Joystick({
        outer: PIXI.Sprite.from(joystick), // ("images/joystick.png")
        inner: PIXI.Sprite.from(joystickHandle), // ("images/joystick-handle.png")

        outerScale: { x: 0.5, y: 0.5 },
        innerScale: { x: 0.8, y: 0.8 },

        onChange: (data) => {
          props.onRoration(data?.direction);
          // console.log(data.angle); // Angle from 0 to 360
          // console.log(data.direction); // 'left', 'top', 'bottom', 'right', 'top_left', 'top_right', 'bottom_left' or 'bottom_right'.
          // console.log(data.power); // Power from 0 to 1
        },

        onStart: () => {
          console.log("start");
        },

        onEnd: () => {
          props.onEnd();
        },
      });
    },
  },
  "Joystick"
);
