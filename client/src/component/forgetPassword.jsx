import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api, useAuth } from "../context/authcontext";
import {
  verifyEmailAction,
  resendOTPAction,
  resetPasswordAction,
} from "../actions/authActions";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes
  const navigate = useNavigate();

  useEffect(() => {
    if (showOtpForm) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [showOtpForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting to send OTP to:", email); // Debug log
      const result = await resendOTPAction(email);

      if (result.success) {
        setShowOtpForm(true);
        setTimer(300);
        console.log("OTP sent successfully"); // Debug log
      } else {
        setError(result.error);
        console.error("Failed to send OTP:", result.error); // Debug log
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err); // Debug log
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await verifyEmailAction(email, otp.join(""));
      if (result.success) {
        // Show password reset form after successful verification
        setShowPasswordForm(true);
        // Store the token from verification response
        localStorage.setItem("resetToken", result.user.token);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to verify OTP");
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPasswordAction(email, password);
      if (result.success) {
        navigate("/login", {
          state: {
            message:
              "Password reset successful. Please login with your new password.",
          },
        });
      } else {
        setError(result.error || "Failed to reset password");
        console.error("Password reset failed:", result.error);
      }
    } catch (err) {
      setError("Failed to reset password");
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError("");

    try {
      await resendOTPAction(email);
      setTimer(300);
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordForm = () => (
    <form className="space-y-6" onSubmit={handlePasswordSubmit}>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter new password"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );

  const renderForm = () => {
    if (showPasswordForm) {
      return renderPasswordForm();
    }
    if (showOtpForm) {
      return (
        <form className="space-y-6" onSubmit={handleOtpSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <div className="mt-2 flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || otp.some((digit) => !digit)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timer > 0 || loading}
              className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400"
            >
              {timer > 0
                ? `Resend code in ${Math.floor(timer / 60)}:${(timer % 60)
                    .toString()
                    .padStart(2, "0")}`
                : "Resend verification code"}
            </button>
          </div>
        </form>
      );
    }
    return (
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </div>
      </form>
    );
  };

  // Update your h2 text based on the current form
  const getHeaderText = () => {
    if (showPasswordForm) return "Reset Your Password";
    if (showOtpForm) return "Enter Verification Code";
    return "Reset your password";
  };

  const getSubHeaderText = () => {
    if (showPasswordForm) return "Enter your new password";
    if (showOtpForm) return `Enter the verification code sent to ${email}`;
    return "Enter your email address to receive a verification code";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <h2 className="my-6 text-center text-3xl font-extrabold text-gray-900">
              {getHeaderText()}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {getSubHeaderText()}
            </p>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {renderForm()}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
