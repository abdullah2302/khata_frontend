import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import { IconInput } from '../components/ui/Fields';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { errorMessage } from '../utils/format';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(v);
      navigate('/dashboard');
    } catch (x) {
      setError(errorMessage(x));
    }
  };

  return (
    <AuthLayout title="Open your ledger" footer={<>Already have a ledger? <Link to="/login" className="font-semibold text-ink underline">Log in</Link></>}>
      <form onSubmit={submit} className="grid gap-4">
        <IconInput icon="fa-user" placeholder="Your name" value={v.name} onChange={set('name')} required />
        <IconInput icon="fa-envelope" type="email" placeholder="Email" value={v.email} onChange={set('email')} required />
        <IconInput icon="fa-lock" type="password" placeholder="Password (6+ characters)" value={v.password} onChange={set('password')} required />
        {error && <Alert>{error}</Alert>}
        <Button>Create account</Button>
      </form>
    </AuthLayout>
  );
}
