import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import { IconInput } from '../components/ui/Fields';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { errorMessage } from '../utils/format';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [v, setV] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(v);
      navigate('/dashboard');
    } catch (x) {
      setError(errorMessage(x));
    }
  };

  return (
    <AuthLayout title="Welcome back" footer={<>New here? <Link to="/register" className="font-semibold text-ink underline">Create an account</Link></>}>
      <form onSubmit={submit} className="grid gap-4">
        <IconInput icon="fa-envelope" type="email" placeholder="Email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} required />
        <IconInput icon="fa-lock" type="password" placeholder="Password" value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} required />
        {error && <Alert>{error}</Alert>}
        <Button>Log in</Button>
      </form>
    </AuthLayout>
  );
}
