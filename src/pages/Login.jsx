import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import AuthField, { PasswordField } from '../components/auth/AuthField';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { errorMessage } from '../utils/format';

const rise = (ms) => ({ animationDelay: `${ms}ms` });
const shine =
  "relative w-full overflow-hidden py-3 before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-skew-x-12 before:bg-white/20 before:transition-transform before:duration-700 before:content-[''] hover:before:translate-x-[420%]";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(v);
      navigate('/dashboard');
    } catch (x) {
      setError(errorMessage(x));
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see who still owes you."
      footer={<>New here? <Link to="/register" className="font-semibold text-ink underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="grid gap-4">
        <div className="animate-rise" style={rise(200)}>
          <AuthField icon="fa-envelope" type="email" placeholder="Email" autoComplete="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} required />
        </div>
        <div className="animate-rise" style={rise(280)}>
          <PasswordField placeholder="Password" autoComplete="current-password" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} required />
        </div>
        {error && <Alert key={error} className="animate-shake">{error}</Alert>}
        <div className="animate-rise" style={rise(360)}>
          <Button disabled={busy} icon={busy ? 'fa-spinner fa-spin' : 'fa-right-to-bracket'} className={shine}>
            {busy ? 'Logging in' : 'Log in'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
