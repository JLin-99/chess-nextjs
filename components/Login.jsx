import { useState } from "react";

export default function Login({ setUsername }) {
  const [user, setUser] = useState("");

  return (
    <div>
      <form onSubmit={() => setUsername(user)}>
        <label>Username:</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input type="submit" value="Go!" />
      </form>
    </div>
  );
}
