import { useState, type ChangeEvent, type FormEvent } from "react";
import InputField from "./common/InputField";
import type { LoginProps } from "../types";
import { login } from "../services/authService";

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await login(username, password);
      onLogin();
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <InputField
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            required
          />

          <InputField
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}