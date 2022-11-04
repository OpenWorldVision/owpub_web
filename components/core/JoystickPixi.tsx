import React from "react";
import { CustomPIXIComponent } from "react-pixi-fiber";
import { Joystick } from "pixi-virtual-joystick";
import * as PIXI from "pixi.js";

export default CustomPIXIComponent(
  {
    customDisplayObject: function (props: any) {
      return new Joystick({
        outer: PIXI.Sprite.from("outer"), // ("images/joystick.png")
        inner: PIXI.Sprite.from("inner"), // ("images/joystick-handle.png")

        outerScale: { x: 0.5, y: 0.5 },
        innerScale: { x: 0.8, y: 0.8 },

        onChange: (data) => {
          console.log(data.angle); // Angle from 0 to 360
          console.log(data.direction); // 'left', 'top', 'bottom', 'right', 'top_left', 'top_right', 'bottom_left' or 'bottom_right'.
          console.log(data.power); // Power from 0 to 1
        },

        onStart: () => {
          console.log("start");
        },

        onEnd: () => {
          console.log("end");
        },
      });
    },
  },
  "Joystick"
);
