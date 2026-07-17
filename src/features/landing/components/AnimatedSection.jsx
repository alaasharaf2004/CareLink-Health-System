import { useEffect, useRef, useState } from "react";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
  as: Tag = "section",
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`landing-reveal ${isVisible ? "is-visible" : ""} ${className}`}
      style={{ "--landing-delay": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export default AnimatedSection;
