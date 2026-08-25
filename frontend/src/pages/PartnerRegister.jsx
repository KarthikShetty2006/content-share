import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSignUp } from "@clerk/react";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL;

const PartnerRegister = () => {
  const navigate = useNavigate();

  const { signUp, fetchStatus } = useSignUp();

  const [step, setStep] = useState("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // CREATE CLERK ACCOUNT + SEND OTP
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("========== SUBMIT CLICKED ==========");

    setLoading(true);
    setError("");

    try {
      if (!signUp) {
        setError("Clerk is not ready. Please refresh the page.");
        return;
      }

      console.log("Creating Clerk signup...");

      // --------------------------------------------------
      // STEP 1: CREATE CLERK SIGNUP
      // --------------------------------------------------

      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        console.error("CLERK SIGNUP ERROR:", result.error);

        setError(
          result.error?.errors?.[0]?.longMessage ||
            result.error?.errors?.[0]?.message ||
            "Unable to create account."
        );

        return;
      }

      console.log("Clerk signup created successfully");

      // --------------------------------------------------
      // STEP 2: SEND EMAIL OTP
      // --------------------------------------------------

      console.log("Sending OTP to:", formData.email);

      const verificationResult =
        await signUp.verifications.sendEmailCode();

      if (verificationResult?.error) {
        console.error(
          "OTP SEND ERROR:",
          verificationResult.error
        );

        setError(
          verificationResult.error?.errors?.[0]?.longMessage ||
            verificationResult.error?.errors?.[0]?.message ||
            "Unable to send verification code."
        );

        return;
      }

      console.log("========== OTP SENT ==========");

      setStep("otp");
    } catch (error) {
      console.error("========== SIGNUP ERROR ==========");
      console.error(error);

      setError(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // VERIFY OTP
  // ======================================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("========== VERIFYING OTP ==========");

      // --------------------------------------------------
      // STEP 3: VERIFY EMAIL
      // --------------------------------------------------

      const verifyResult =
        await signUp.verifications.verifyEmailCode({
          code: otp.trim(),
        });

      if (verifyResult?.error) {
        console.error(
          "OTP VERIFY ERROR:",
          verifyResult.error
        );

        setError(
          verifyResult.error?.errors?.[0]?.longMessage ||
            verifyResult.error?.errors?.[0]?.message ||
            "Invalid verification code."
        );

        return;
      }

      console.log("Email verified successfully");

      // --------------------------------------------------
      // STEP 4: FINALIZE CLERK SIGNUP
      // --------------------------------------------------

      const finalizeResult = await signUp.finalize();

      if (finalizeResult?.error) {
        console.error(
          "CLERK FINALIZE ERROR:",
          finalizeResult.error
        );

        setError(
          finalizeResult.error?.errors?.[0]?.longMessage ||
            finalizeResult.error?.errors?.[0]?.message ||
            "Unable to complete Clerk registration."
        );

        return;
      }

      console.log("Clerk signup finalized");

      // --------------------------------------------------
      // STEP 5: GET CLERK USER ID
      // --------------------------------------------------

      const clerkId = signUp.createdUserId;

      console.log("Clerk User ID:", clerkId);

      if (!clerkId) {
        setError(
          "Clerk account was created, but the user ID could not be retrieved."
        );

        return;
      }

      // --------------------------------------------------
      // STEP 6: CREATE MONGODB ACCOUNT
      // --------------------------------------------------

      console.log("Creating MongoDB creator account...");

      const response = await axios.post(
        'https://content-share-livid.vercel.app/api/auth/food-partner/register',
        {
          name: formData.name,
          contactName: formData.contactName,
          phone: formData.phone,
          address: formData.address,
          email: formData.email,

          // Same password stored in MongoDB
          // and used for Clerk signup
          password: formData.password,

          // Clerk ID
          clerkId: clerkId,
        },
        {
          withCredentials: true,
        }
      );

      console.log(
        "MongoDB registration successful:",
        response.data
      );

      // --------------------------------------------------
      // STEP 7: GO HOME
      // --------------------------------------------------

      navigate("/home", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "========== OTP / REGISTRATION ERROR =========="
      );

      console.error(error);

      setError(
        error?.response?.data?.message ||
          error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // RESEND OTP
  // ======================================================

  const resendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const result =
        await signUp.verifications.sendEmailCode();

      if (result?.error) {
        setError(
          result.error?.errors?.[0]?.longMessage ||
            result.error?.errors?.[0]?.message ||
            "Unable to resend verification code."
        );

        return;
      }

      console.log("OTP resent successfully");
    } catch (error) {
      console.error("Resend error:", error);

      setError(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          "Unable to resend code."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // OTP SCREEN
  // ======================================================

  if (step === "otp") {
    return (
      <div className="auth-container">
        <form
          className="auth-form"
          onSubmit={handleVerifyOtp}
        >
          <h2 className="auth-title">
            Verify your email
          </h2>

          <p className="muted">
            We sent a verification code to
          </p>

          <p
            className="muted"
            style={{
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            {formData.email}
          </p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="otp">
              Verification Code
            </label>

            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={
              loading || fetchStatus === "fetching"
            }
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>

          <button
            type="button"
            className="btn"
            onClick={resendOtp}
            disabled={
              loading || fetchStatus === "fetching"
            }
            style={{
              marginTop: "10px",
              background: "transparent",
              border: "1px solid #444",
            }}
          >
            Resend Code
          </button>

          <div className="auth-links">
            <p className="muted">
              Code sent to:
            </p>

            <p className="muted">
              {formData.email}
            </p>
          </div>
        </form>
      </div>
    );
  }

  // ======================================================
  // REGISTRATION SCREEN
  // ======================================================

  return (
    <div className="auth-container">
      <form
        className="auth-form"
        data-role="partner"
        onSubmit={handleSubmit}
      >
        <h2 className="auth-title">
          Create account — Creator
        </h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">
            Creator Account Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Restaurant / Cloud kitchen name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactName">
            Contact Person
          </label>

          <input
            id="contactName"
            name="contactName"
            type="text"
            placeholder="Contact person's full name"
            value={formData.contactName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">
            Address
          </label>

          <textarea
            id="address"
            name="address"
            rows="3"
            placeholder="Street, area, city, postal code"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="business@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />
        </div>

        <div id="clerk-captcha" />

        <button
          type="submit"
          className="btn"
          disabled={
            loading || fetchStatus === "fetching"
          }
        >
          {loading
            ? "Sending verification code..."
            : "Continue"}
        </button>

        <div className="auth-links">
          <p className="muted">
            Already registered?{" "}

            <Link to="/food-partner/login">
              Sign in as Creator
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PartnerRegister;