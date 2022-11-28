import styles from "../styles/Timer.module.css";

export default function Timer({ username, time, playerColor }) {
  return (
    <div className={styles.container}>
      <div className={styles.username}>{username}</div>
      <div
        className={playerColor === "w" ? styles.whiteTimer : styles.blackTimer}
      >
        {`${("0" + (Math.floor(time / 60) % 60)).slice(-2)}:${(
          "0" +
          (time % 60)
        ).slice(-2)}`}
      </div>
    </div>
  );
}
