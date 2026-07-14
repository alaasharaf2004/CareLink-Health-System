import { staggerDelay } from "../utils/staggerDelay";

function FadeUp({
  children,
  index = 0,
  delay,
  className = "",
  as: Tag = "div",
  ...props
}) {
  const animationDelay = delay ?? staggerDelay(index);

  return (
    <Tag
      className={`opacity-0 animate-[formFadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards] ${className}`}
      style={{ animationDelay }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default FadeUp;
