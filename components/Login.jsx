import { useState } from "react";
import styles from "../styles/Login.module.css";

export default function Login({ setUsername }) {
  const [user, setUser] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setUsername(user);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h1>Welcome to ChocoChess!!!</h1>
        <div className={styles.username}>
          <label>Choose your username:</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className={styles.options}>
          <button onClick={handleOnSubmit}>Create New Game!</button>
          <button>Join Game!</button>
        </div>
      </div>
    </div>
  );
}
