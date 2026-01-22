import { useState } from "react";

function App() {
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Request OTP
  const requestOtp = async () => {
    const res = await fetch("http://localhost:5000/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrPhone }),
    });

    if (res.ok) setStep(2);
  };

  // Verify OTP
  const verifyOtp = async () => {
    const res = await fetch("http://localhost:5000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrPhone, otp }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setStep(3);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setStep(1);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>OTP Login Demo</h2>

      {step === 1 && !token && (
        <>
          <input
            placeholder="Email or Phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
          />
          <br /><br />
          <button onClick={requestOtp}>Request OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {token && step === 3 && (
        <>
          <h3>Welcome 🎉</h3>
          <p>You are logged in successfully.</p>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default App;
