import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

// Animated number counter used by metric cards and the health score.
export default function CountUp({ to = 0, format, duration = 1.2, className }) {
  const value = useMotionValue(0);
  const rendered = useTransform(value, (v) => (format ? format(v) : Math.round(v).toLocaleString()));

  useEffect(() => {
    const controls = animate(value, to, { duration, ease: 'easeOut' });
    return () => controls.stop();
  }, [to, duration, value]);

  return <motion.span className={className}>{rendered}</motion.span>;
}
