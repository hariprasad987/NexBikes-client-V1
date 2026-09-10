import Link from "next/link";
import type { Route } from "next";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

import styles from "./button.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  variant?: "primary" | "secondary" | "social" | "ghost" | "text";
};

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  children: ReactNode;
  fullWidth?: boolean;
  href: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
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
  trailingIcon,
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
      {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
    </button>
  );
}

export function ButtonLink({
  children,
  className = "",
  fullWidth = false,
  href,
  leadingIcon,
  trailingIcon,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={getClassName(className, fullWidth, variant)} href={href as Route} {...props}>
      {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
      <span>{children}</span>
      {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
    </Link>
  );
}
