import { useState } from "react";

function Login({ setStep, setEmailOrPhone }) {
  const [value, setValue] = useState("");

  const requestOtp = async () => {
    await fetch("http://localhost:5000/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrPhone: value })
    });
    setEmailOrPhone(value);
    setStep("otp");
  };

  return (
    <div>
      <h2>Cyseck Login</h2>
      <input
        placeholder="Email or Phone"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={requestOtp}>Request OTP</button>
    </div>
  );
}

export default Login;
