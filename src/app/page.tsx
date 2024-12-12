import Image from "next/image";
import styles from "./page.module.css";
import {Button} from "@/components/ui/button"
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
         <Image></Image>
      </main>
      <footer className={styles.footer}>
         <div>Footer here</div>
      </footer>
    </div>
  );
}
