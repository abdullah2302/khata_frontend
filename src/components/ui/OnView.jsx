import useReveal from '../../hooks/useReveal';

// Mounts its children only once scrolled into view, so mount animations (charts) play when seen.
export default function OnView({ children, className = '' }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={className}>{visible ? children : null}</div>;
}
