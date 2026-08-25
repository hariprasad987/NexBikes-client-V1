import type { FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button/button";
import { DateField } from "@/components/ui/date-field/date-field";
import { PhoneField } from "@/components/ui/phone-field/phone-field";
import { TextField } from "@/components/ui/text-field/text-field";

import { authOnboardingData } from "../../data";
import { OnboardingHeader } from "../onboarding-header/onboarding-header";

import styles from "./create-account-step.module.scss";

type CreateAccountStepProps = {
  onContinue: () => void;
};

export function CreateAccountStep({ onContinue }: CreateAccountStepProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onContinue();
  }

  return (
    <section className={styles.step}>
      <OnboardingHeader
        description="Create your NexBikes account to manage your bikes, track maintenance and get smart recommendations."
        title="Create Your Account"
      />

      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.fieldCard}>
          <TextField
            autoComplete="given-name"
            id="first-name"
            info="Used to personalize your NexBikes account and communications."
            label="First Name*"
            name="firstName"
            placeholder="Your first name"
          />
          <TextField
            autoComplete="family-name"
            id="last-name"
            info="Used with your first name to identify your NexBikes account."
            label="Last Name*"
            name="lastName"
            placeholder="Your last name"
          />
          <TextField
            autoComplete="email"
            id="signup-email"
            info="Used to sign in and receive account, bike, and maintenance updates."
            label="Email Address*"
            name="email"
            placeholder="example@nexbikes.com"
            type="email"
          />
          <PhoneField
            autoComplete="tel"
            countries={authOnboardingData.phoneCountries}
            defaultCountry="us"
            id="phone-number"
            info="Used for optional account and service notifications."
            label="Phone Number"
            name="phone"
            placeholder="Your phone number"
          />
          <DateField
            className={styles.dateField}
            id="date-of-birth"
            info="Helps us tailor recommendations to your profile and riding needs."
            label="Date of Birth"
            name="dateOfBirth"
          />
          <TextField
            autoComplete="postal-code"
            id="home-zip"
            info="Used to find nearby service, retailers, and locally relevant recommendations."
            label="Home Zip Code"
            name="zipCode"
            placeholder="Postal code"
          />
          <TextField
            autoComplete="new-password"
            id="signup-password"
            info="Creates the password used to protect and access your account."
            label="Password*"
            name="password"
            placeholder="Create a strong password"
            type="password"
          />
          <TextField
            autoComplete="new-password"
            id="confirm-password"
            info="Enter the same password again to confirm it."
            label="Confirm Password*"
            name="confirmPassword"
            placeholder="Confirm your password"
            type="password"
          />
        </div>

        <div className={styles.footer}>
          <label className={styles.agreement} htmlFor="terms-agreement">
            <input id="terms-agreement" name="terms" type="checkbox" />
            <span>
              By creating an account, you agree to <Link href="#terms">Terms of Service</Link> and{" "}
              <Link href="#privacy">Privacy Policy</Link>
            </span>
          </label>
          <Button className={styles.continue} type="submit">
            Continue
          </Button>
        </div>
      </form>
    </section>
  );
}
