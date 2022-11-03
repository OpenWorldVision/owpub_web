import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  const NoSSRMapStage = dynamic(() => import("../components/MapStage"), {
    ssr: false,
  });

  return (
    <div className={styles.container}>
      <NoSSRMapStage />
    </div>
  );
}
