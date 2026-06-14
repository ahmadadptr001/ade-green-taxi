'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * TimelineContent — staggered blur/slide reveal driven by a shared container
 * ref entering the viewport. Dependency-free reimplementation of the
 * framer-motion-style API used by 21st.dev blocks: it accepts the same
 * `customVariants` (hidden + visible(i)) and `animationNum` props, then maps
 * them to CSS transitions. Respects prefers-reduced-motion.
 */
export function TimelineContent({
  as: Tag = 'div',
  animationNum = 0,
  timelineRef,
  customVariants,
  className = '',
  children,
  ...rest
}) {
  const [shown, setShown] = useState(false);
  const localRef = useRef(null);

  useEffect(() => {
    const el = timelineRef?.current || localRef.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [timelineRef]);

  const hidden = customVariants?.hidden ?? { opacity: 0 };
  const visibleObj =
    typeof customVariants?.visible === 'function'
      ? customVariants.visible(animationNum)
      : (customVariants?.visible ?? { opacity: 1 });
  const { transition = {}, ...visible } = visibleObj;

  const target = shown ? visible : hidden;
  const delay = shown ? transition.delay ?? 0 : 0;
  const duration = transition.duration ?? 0.6;

  const style = {
    opacity: target.opacity,
    filter: target.filter ?? 'blur(0px)',
    transform: `translateY(${target.y ?? 0}px)`,
    transition: `opacity ${duration}s ${delay}s ease, filter ${duration}s ${delay}s ease, transform ${duration}s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
    willChange: 'opacity, filter, transform',
  };

  return (
    <Tag ref={localRef} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}

export default TimelineContent;
