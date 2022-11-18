import dynamic from "next/dynamic";
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
