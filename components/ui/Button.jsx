import Link from "next/link";
import Icon from "./Icon";

const variants = {
  primary: "btn-primary",
  dark: "btn-dark",
  outline: "btn-outline",
};

// Reusable CTA button. Renders a Next <Link> when `href` is provided,
// otherwise a native <button>.
export default function Button({
  href,
  children,
  variant = "primary",
  withArrow = false,
  className = "",
  ...rest
}) {
  const cls = `${variants[variant] || variants.primary} ${className}`.trim();
  const content = (
    <>
      {children}
      {withArrow && <Icon name="arrow" size={18} />}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {content}
    </button>
  );
}
