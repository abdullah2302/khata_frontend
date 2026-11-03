import useReveal from '../../hooks/useReveal';
import useCountUp from '../../hooks/useCountUp';

export default function CountUp({ value, format = (n) => Math.round(n).toLocaleString(), ...props }) {
  const [ref, visible] = useReveal();
  const n = useCountUp(value, visible);
  return <span ref={ref} {...props}>{format(n)}</span>;
}
