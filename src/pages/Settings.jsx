import { useState } from 'react';
import { updateProfile, changePassword } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CURRENCIES, getCurrency, setCurrency, errorMessage } from '../utils/format';
import PageHeader from '../components/ui/PageHeader';
import ThemePicker from '../components/ui/ThemePicker';
import { Input, Select } from '../components/ui/Fields';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const h2 = 'mb-3 font-display text-xl font-semibold tracking-tight';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState({ name: user.name, email: user.email });
  const [profileError, setProfileError] = useState('');
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [currency, setCurrencyState] = useState(getCurrency());

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    try {
      const data = await updateProfile(profile);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (x) { setProfileError(errorMessage(x)); }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pw.newPassword !== pw.confirm) return setPwError('The new passwords do not match.');
    try {
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password updated');
    } catch (x) { setPwError(errorMessage(x)); }
  };

  const saveCurrency = (e) => {
    setCurrency(e.target.value);
    setCurrencyState(e.target.value);
    toast.success('Currency updated');
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Your account and preferences." />

      <section className="mb-10 max-w-2xl">
        <h2 className={h2}>Theme</h2>
        <ThemePicker />
      </section>

      <section className="mb-10 max-w-md">
        <h2 className={h2}>Profile</h2>
        <form onSubmit={saveProfile} className="grid gap-3.5">
          <Input label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
          <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required />
          {profileError && <Alert>{profileError}</Alert>}
          <Button className="justify-self-start">Save profile</Button>
        </form>
      </section>

      <section className="mb-10 max-w-md">
        <h2 className={h2}>Currency</h2>
        <Select label="Shown on invoices, tables and reports" value={currency} onChange={saveCurrency}>
          {CURRENCIES.map((c) => <option key={c.symbol} value={c.symbol}>{c.label}</option>)}
        </Select>
      </section>

      <section className="max-w-md">
        <h2 className={h2}>Change password</h2>
        <form onSubmit={savePassword} className="grid gap-3.5">
          <Input label="Current password" type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
          <Input label="New password" type="password" minLength={6} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
          <Input label="Confirm new password" type="password" minLength={6} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
          {pwError && <Alert>{pwError}</Alert>}
          <Button className="justify-self-start">Update password</Button>
        </form>
      </section>
    </>
  );
}
