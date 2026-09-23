"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button/button";
import { DateField } from "@/components/ui/date-field/date-field";
import { PhoneField } from "@/components/ui/phone-field/phone-field";
import { TextField } from "@/components/ui/text-field/text-field";
import { useToast } from "@/components/ui/toast-provider/toast-provider";
import { AuthApiError, registerUser, storeOtpResendCooldown } from "@/lib/auth/auth-client";

import { authOnboardingData } from "../../data";
import { OnboardingHeader } from "../onboarding-header/onboarding-header";
import { ProviderAuthOptions } from "../provider-auth-options/provider-auth-options";

import styles from "./create-account-step.module.scss";

type CreateAccountStepProps = {
  onRegistrationRequested: (email: string) => void;
};

export function CreateAccountStep({ onRegistrationRequested }: CreateAccountStepProps) {
  const { showToast } = useToast();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zipCodeValue, setZipCodeValue] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const phoneNumber = String(formData.get("phone") ?? "").replace(/\D/g, "");
    const phoneCountry = String(formData.get("phoneCountry") ?? "us");
    const selectedPhoneCountry = authOnboardingData.phoneCountries.find(
      (country) => country.value === phoneCountry,
    );
    const phone = selectedPhoneCountry
      ? `${selectedPhoneCountry.callingCode}${phoneNumber}`
      : phoneNumber;
    const dateOfBirth = String(formData.get("dateOfBirth") ?? "");
    const zipCode = String(formData.get("postalCode") ?? "").replace(/\D/g, "");

    if (!firstName || !lastName || !email || !password || !phoneNumber || !dateOfBirth || !zipCode) {
      showToast({ message: "Complete all required account fields.", tone: "error" });
      return;
    }

    if (password !== confirmPassword) {
      showToast({ message: "Password and confirmation must match.", tone: "error" });
      return;
    }

    if (formData.get("terms") !== "on") {
      showToast({ message: "Accept the Terms of Service and Privacy Policy to continue.", tone: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerUser({
        dateOfBirth,
        email,
        firstName,
        lastName,
        password,
        phone,
        zipCode,
      });
      storeOtpResendCooldown(email);
      showToast({ message: response.message, tone: "success" });
      onRegistrationRequested(email);
    } catch (error) {
      showToast({
        message:
          error instanceof AuthApiError
            ? error.message
            : "Unable to create your account right now. Please try again.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.step}>
      <OnboardingHeader
        description="Create your NexBikes account to manage your bikes, track maintenance and get smart recommendations."
        title="Create Your Account"
      />

      <ProviderAuthOptions intent="signup" />

      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.fieldCard}>
          <TextField
            autoComplete="given-name"
            id="first-name"
            info="Used to personalize your NexBikes account and communications."
            label="First Name*"
            name="firstName"
            placeholder="Your first name"
            required
          />
          <TextField
            autoComplete="family-name"
            id="last-name"
            info="Used with your first name to identify your NexBikes account."
            label="Last Name*"
            name="lastName"
            placeholder="Your last name"
            required
          />
          <TextField
            autoComplete="email"
            id="signup-email"
            info="Used to sign in and receive account, bike, and maintenance updates."
            label="Email Address*"
            name="email"
            placeholder="example@nexbikes.com"
            required
            type="email"
          />
          <PhoneField
            autoComplete="tel"
            countries={authOnboardingData.phoneCountries}
            defaultCountry="us"
            id="phone-number"
            info="Used for optional account and service notifications."
            label="Phone Number*"
            name="phone"
            placeholder="Your phone number"
            required
          />
          <DateField
            className={styles.dateField}
            id="date-of-birth"
            info="Helps us tailor recommendations to your profile and riding needs."
            label="Date of Birth*"
            name="dateOfBirth"
          />
          <TextField
            autoComplete="off"
            id="home-zip"
            info="Used to find nearby service, retailers, and locally relevant recommendations."
            inputMode="numeric"
            label="Home Zip Code*"
            maxLength={10}
            name="postalCode"
            onChange={(event) => setZipCodeValue(event.target.value.replace(/\D/g, ""))}
            placeholder="Postal code"
            required
            value={zipCodeValue}
          />
          <TextField
            autoComplete="new-password"
            id="signup-password"
            info="Creates the password used to protect and access your account."
            label="Password*"
            name="password"
            placeholder="Create a strong password"
            required
            type="password"
          />
          <TextField
            autoComplete="new-password"
            id="confirm-password"
            info="Enter the same password again to confirm it."
            label="Confirm Password*"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            type="password"
          />
        </div>

        <div className={styles.footer}>
          <label className={styles.agreement} htmlFor="terms-agreement">
            <input
              checked={hasAcceptedTerms}
              id="terms-agreement"
              name="terms"
              onChange={(event) => setHasAcceptedTerms(event.target.checked)}
              type="checkbox"
            />
            <span>
              By creating an account, you agree to{" "}
              <Link href="https://nexbikes.bobcares.com/signup#terms">Terms of Service</Link> and{" "}
              <Link href="https://nexbikes.bobcares.com/signup#privacy">Privacy Policy</Link>
            </span>
          </label>
          <Button
            className={styles.continue}
            disabled={isSubmitting || !hasAcceptedTerms}
            type="submit"
          >
            {isSubmitting ? "Sending OTP..." : "Continue"}
          </Button>
        </div>
      </form>
    </section>
  );
}
