import Image from "next/image";
import spinner from "../public/assets/chocolateLoading.gif";
import styles from "../styles/Spinner.module.css";

export default function Spinner() {
  return (
    <div className={styles.spinner}>
      <Image src={spinner} />
    </div>
  );
}
