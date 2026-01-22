import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const emailOrPhone = localStorage.getItem("emailOrPhone");

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/welcome");
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>OTP Login Demo</h2>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <br /><br />

      <button onClick={verifyOtp}>Verify OTP</button>
    </div>
  );
}

export default OtpVerify;
