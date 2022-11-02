import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";

import { Stage, Sprite, PixiComponent, Container } from "@inlet/react-pixi";
import { Rectangle } from "pixi.js";
import dynamic from "next/dynamic";
const joystick = "joystick.png";

const Home = () => (
  <Stage>
    <Sprite image={joystick} x={100} y={100} />
  </Stage>
);

export default Home;
