import Link from "next/link";
import type { Route } from "next";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

import styles from "./button.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  variant?: "primary" | "secondary" | "social" | "ghost";
};

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  children: ReactNode;
  fullWidth?: boolean;
  href: string;
  leadingIcon?: ReactNode;
  variant?: ButtonProps["variant"];
};

function getClassName(className: string, fullWidth: boolean, variant: NonNullable<ButtonProps["variant"]>) {
  return `${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""} ${className}`;
}

export function Button({
  children,
  className = "",
  fullWidth = false,
  leadingIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={getClassName(className, fullWidth, variant)}
      type={type}
      {...props}
    >
      {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
      <span>{children}</span>
    </button>
  );
}

export function ButtonLink({
  children,
  className = "",
  fullWidth = false,
  href,
  leadingIcon,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={getClassName(className, fullWidth, variant)} href={href as Route} {...props}>
      {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
      <span>{children}</span>
    </Link>
  );
}
