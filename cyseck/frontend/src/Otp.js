import { useState } from "react";

function Otp({ emailOrPhone, setStep }) {
  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    const res = await fetch("http://localhost:5000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrPhone, otp })
    });
    const data = await res.json();
    localStorage.setItem("token", data.token);
    setStep("welcome");
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={verifyOtp}>Verify OTP</button>
    </div>
  );
}

export default Otp;
