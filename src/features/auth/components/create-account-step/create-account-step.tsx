"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button/button";
import { DateField } from "@/components/ui/date-field/date-field";
import { PhoneField } from "@/components/ui/phone-field/phone-field";
import { TextField } from "@/components/ui/text-field/text-field";
import { useToast } from "@/components/ui/toast-provider/toast-provider";
import {
  AuthApiError,
  registerUser,
  storeOtpResendCooldown,
} from "@/lib/auth/auth-client";

import { authOnboardingData } from "../../data";
import { OnboardingHeader } from "../onboarding-header/onboarding-header";
import { ProviderAuthOptions } from "../provider-auth-options/provider-auth-options";

import styles from "./create-account-step.module.scss";

type CreateAccountStepProps = {
  onRegistrationRequested: (email: string) => void;
};

type CreateAccountField =
  | "confirmPassword"
  | "dateOfBirth"
  | "email"
  | "firstName"
  | "lastName"
  | "password"
  | "phone"
  | "postalCode";

export function CreateAccountStep({ onRegistrationRequested }: CreateAccountStepProps) {
  const { showToast } = useToast();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidFields, setInvalidFields] = useState<ReadonlySet<CreateAccountField>>(new Set());
  const [termsInvalid, setTermsInvalid] = useState(false);
  const [zipCodeValue, setZipCodeValue] = useState("");

  function clearFieldError(field: CreateAccountField) {
    setInvalidFields((current) => {
      if (!current.has(field)) {
        return current;
      }

      const next = new Set(current);
      next.delete(field);
      return next;
    });
  }

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
    const missingFields = new Set<CreateAccountField>();

    if (!firstName) missingFields.add("firstName");
    if (!lastName) missingFields.add("lastName");
    if (!email) missingFields.add("email");
    if (!password) missingFields.add("password");
    if (!confirmPassword) missingFields.add("confirmPassword");
    if (!phoneNumber) missingFields.add("phone");
    if (!dateOfBirth) missingFields.add("dateOfBirth");
    if (!zipCode) missingFields.add("postalCode");

    if (missingFields.size > 0) {
      setInvalidFields(missingFields);
      showToast({ message: "Complete all required account fields.", tone: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setInvalidFields(new Set(["password", "confirmPassword"]));
      showToast({ message: "Password and confirmation must match.", tone: "error" });
      return;
    }

    if (formData.get("terms") !== "on") {
      setTermsInvalid(true);
      showToast({ message: "Accept the Terms of Service and Privacy Policy to continue.", tone: "error" });
      return;
    }

    setInvalidFields(new Set());
    setTermsInvalid(false);
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
            invalid={invalidFields.has("firstName")}
            label="First Name*"
            name="firstName"
            onChange={() => clearFieldError("firstName")}
            placeholder="Your first name"
            required
          />
          <TextField
            autoComplete="family-name"
            id="last-name"
            info="Used with your first name to identify your NexBikes account."
            invalid={invalidFields.has("lastName")}
            label="Last Name*"
            name="lastName"
            onChange={() => clearFieldError("lastName")}
            placeholder="Your last name"
            required
          />
          <TextField
            autoComplete="email"
            id="signup-email"
            info="Used to sign in and receive account, bike, and maintenance updates."
            invalid={invalidFields.has("email")}
            label="Email Address*"
            name="email"
            onChange={() => clearFieldError("email")}
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
            invalid={invalidFields.has("phone")}
            label="Phone Number*"
            name="phone"
            onChange={() => clearFieldError("phone")}
            placeholder="Your phone number"
            required
          />
          <DateField
            className={styles.dateField}
            id="date-of-birth"
            info="Helps us tailor recommendations to your profile and riding needs."
            invalid={invalidFields.has("dateOfBirth")}
            label="Date of Birth*"
            name="dateOfBirth"
            disableFutureDates
            onValueChange={() => clearFieldError("dateOfBirth")}
          />
          <TextField
            autoComplete="off"
            id="home-zip"
            info="Used to find nearby service, retailers, and locally relevant recommendations."
            invalid={invalidFields.has("postalCode")}
            inputMode="numeric"
            label="Home Zip Code*"
            maxLength={10}
            name="postalCode"
            onChange={(event) => {
              clearFieldError("postalCode");
              setZipCodeValue(event.target.value.replace(/\D/g, ""));
            }}
            placeholder="Postal code"
            required
            value={zipCodeValue}
          />
          <TextField
            autoComplete="new-password"
            id="signup-password"
            info="Creates the password used to protect and access your account."
            invalid={invalidFields.has("password")}
            label="Password*"
            name="password"
            onChange={() => clearFieldError("password")}
            placeholder="Create a strong password"
            required
            type="password"
          />
          <TextField
            autoComplete="new-password"
            id="confirm-password"
            info="Enter the same password again to confirm it."
            invalid={invalidFields.has("confirmPassword")}
            label="Confirm Password*"
            name="confirmPassword"
            onChange={() => clearFieldError("confirmPassword")}
            placeholder="Confirm your password"
            required
            type="password"
          />
        </div>

        <div className={styles.footer}>
          <label className={`${styles.agreement} ${termsInvalid ? styles.invalidAgreement : ""}`} htmlFor="terms-agreement">
            <input
              aria-invalid={termsInvalid || undefined}
              checked={hasAcceptedTerms}
              id="terms-agreement"
              name="terms"
              onChange={(event) => {
                setHasAcceptedTerms(event.target.checked);
                setTermsInvalid(false);
              }}
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
