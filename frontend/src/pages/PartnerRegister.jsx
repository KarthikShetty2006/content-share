import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSignUp } from "@clerk/react";
import "./Auth.css";

const PartnerRegister = () => {
  const navigate = useNavigate();

  // ======================================================
  // CLERK
  // ======================================================

  const { signUp, errors, fetchStatus } = useSignUp();

  // ======================================================
  // STATE
  // ======================================================

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
  // CREATE CLERK SIGNUP + SEND OTP
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("========== SUBMIT CLICKED ==========");

    setLoading(true);
    setError("");

    try {
      console.log("Creating Clerk signup...");

      // --------------------------------------------------
      // STEP 1: CREATE CLERK SIGNUP
      // --------------------------------------------------

      const { error: signupError } = await signUp.password({
        emailAddress: formData.email,
        password: formData.password,
      });

      if (signupError) {
        console.error("CLERK SIGNUP ERROR:", signupError);

        setError(
          signupError.errors?.[0]?.longMessage ||
            signupError.errors?.[0]?.message ||
            "Unable to create account."
        );

        return;
      }

      console.log("Clerk signup created successfully");

      // --------------------------------------------------
      // STEP 2: SEND EMAIL OTP
      // --------------------------------------------------

      console.log("Sending OTP to:", formData.email);

      const { error: otpError } =
        await signUp.verifications.sendEmailCode();

      if (otpError) {
        console.error("OTP SEND ERROR:", otpError);

        setError(
          otpError.errors?.[0]?.longMessage ||
            otpError.errors?.[0]?.message ||
            "Unable to send verification code."
        );

        return;
      }

      console.log("========== OTP SENT ==========");

      // Show OTP screen
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
      // STEP 3: VERIFY EMAIL OTP
      // --------------------------------------------------

      const { error: verifyError } =
        await signUp.verifications.verifyEmailCode({
          code: otp.trim(),
        });

      if (verifyError) {
        console.error("OTP VERIFY ERROR:", verifyError);

        setError(
          verifyError.errors?.[0]?.longMessage ||
            verifyError.errors?.[0]?.message ||
            "Invalid verification code."
        );

        return;
      }

      console.log("Email verified successfully");

      // --------------------------------------------------
      // STEP 4: FINALIZE CLERK SIGNUP
      // --------------------------------------------------

      console.log("Finalizing Clerk signup...");

      const { error: finalizeError } =
        await signUp.finalize();

      if (finalizeError) {
        console.error(
          "CLERK FINALIZE ERROR:",
          finalizeError
        );

        setError(
          finalizeError.errors?.[0]?.longMessage ||
            finalizeError.errors?.[0]?.message ||
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
      // STEP 6: CREATE YOUR MONGODB ACCOUNT
      // --------------------------------------------------

      console.log(
        "Creating MongoDB creator account..."
      );

      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/register",
        {
          name: formData.name,
          contactName: formData.contactName,
          phone: formData.phone,
          address: formData.address,
          email: formData.email,
          password: formData.password,

          // Clerk ID
          clerkId,
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
      // STEP 7: GO TO HOME
      // --------------------------------------------------

      navigate("/home");

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

      console.log("Resending OTP...");

      const { error: resendError } =
        await signUp.verifications.sendEmailCode();

      if (resendError) {
        console.error(
          "RESEND OTP ERROR:",
          resendError
        );

        setError(
          resendError.errors?.[0]?.longMessage ||
            resendError.errors?.[0]?.message ||
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
              onChange={(e) =>
                setOtp(e.target.value)
              }
              maxLength={6}
              required
            />

          </div>

          <button
            type="submit"
            className="btn"
            disabled={
              loading ||
              fetchStatus === "fetching"
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
              loading ||
              fetchStatus === "fetching"
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
  // REGISTRATION DETAILS SCREEN
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

        {/* =================================================
            ACCOUNT NAME
        ================================================= */}

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

        {/* =================================================
            CONTACT PERSON
        ================================================= */}

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

        {/* =================================================
            PHONE
        ================================================= */}

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

        {/* =================================================
            ADDRESS
        ================================================= */}

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

        {/* =================================================
            EMAIL
        ================================================= */}

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

        {/* =================================================
            PASSWORD
        ================================================= */}

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

        {/* =================================================
            CLERK CAPTCHA
        ================================================= */}

        <div id="clerk-captcha" />

        {/* =================================================
            SUBMIT
        ================================================= */}

        <button
          type="submit"
          className="btn"
          disabled={
            loading ||
            fetchStatus === "fetching"
          }
        >
          {loading
            ? "Sending verification code..."
            : "Continue"}
        </button>

        {/* =================================================
            LINKS
        ================================================= */}

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