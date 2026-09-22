import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "style">;

export function ScrollReveal<T extends ElementType = "div">({
  as,
  children,
  className,
  delay = 0,
  style,
  ...rest
}: ScrollRevealProps<T>) {
  const Component = as ?? "div";
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -2% 0px" },
    );

    const boot = () => {
      observer.observe(node);
      const rect = node.getBoundingClientRect();
      // Только если блок реально в верхней части экрана — иначе лишние re-render при загрузке hero
      if (rect.top < window.innerHeight * 0.12 && rect.bottom > 0) {
        setVisible(true);
        observer.disconnect();
      }
    };

    const deferMs = 0;
    const timer = window.setTimeout(boot, deferMs);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <Component
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-none motion-reduce:opacity-100 motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0",
        className,
      )}
      style={{
        ...style,
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
