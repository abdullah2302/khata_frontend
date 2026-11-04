import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField, { PasswordField } from '../components/auth/AuthField';
import PasswordStrength from '../components/auth/PasswordStrength';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { errorMessage } from '../utils/format';

const rise = (ms) => ({ animationDelay: `${ms}ms` });
const shine =
  "relative w-full overflow-hidden py-3 before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-skew-x-12 before:bg-white/20 before:transition-transform before:duration-700 before:content-[''] hover:before:translate-x-[420%]";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const mismatch = v.confirm && v.confirm !== v.password;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (v.password !== v.confirm) return setError('The two passwords do not match.');
    setBusy(true);
    try {
      await register({ name: v.name, email: v.email, password: v.password });
      navigate('/dashboard');
    } catch (x) {
      setError(errorMessage(x));
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Open your ledger"
      subtitle="Create an account and add your first client in under a minute."
      footer={<>Already have a ledger? <Link to="/login" className="font-semibold text-strong underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="grid gap-4">
        <div className="animate-rise" style={rise(200)}>
          <AuthField icon="fa-user" placeholder="Your name" autoComplete="name" value={v.name} onChange={set('name')} required />
        </div>
        <div className="animate-rise" style={rise(270)}>
          <AuthField icon="fa-envelope" type="email" placeholder="Email" autoComplete="email" value={v.email} onChange={set('email')} required />
        </div>
        <div className="grid animate-rise gap-2.5" style={rise(340)}>
          <PasswordField placeholder="Password (6+ characters)" autoComplete="new-password" minLength={6} value={v.password} onChange={set('password')} required />
          <PasswordStrength password={v.password} />
        </div>
        <div className="animate-rise" style={rise(410)}>
          <PasswordField placeholder="Confirm password" autoComplete="new-password" value={v.confirm} onChange={set('confirm')} required />
          {mismatch && <p className="mt-1.5 animate-fade text-sm text-margin">The passwords do not match yet.</p>}
        </div>
        {error && <Alert key={error} className="animate-shake">{error}</Alert>}
        <div className="animate-rise" style={rise(480)}>
          <Button disabled={busy || Boolean(mismatch)} icon={busy ? 'fa-spinner fa-spin' : 'fa-user-plus'} className={shine}>
            {busy ? 'Creating account' : 'Create account'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
