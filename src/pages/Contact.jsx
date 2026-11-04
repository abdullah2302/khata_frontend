import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendMessage } from '../api/contactApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { errorMessage } from '../utils/format';
import { Input, Select, Textarea } from '../components/ui/Fields';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const TOPICS = ['Question', 'Bug report', 'Feature request', 'Other'];
const MAX = 2000;

const tips = [
  { icon: 'fa-circle-question', title: 'A question', text: 'Tell us what you were trying to do and where you got stuck.' },
  { icon: 'fa-bug', title: 'A bug', text: 'Say which page, what you clicked and what you expected to happen.' },
  { icon: 'fa-lightbulb', title: 'An idea', text: 'Describe the problem it would solve for you.' }
];

export default function Contact() {
  const { user } = useAuth();
  const toast = useToast();
  const [v, setV] = useState({ name: user?.name || '', email: user?.email || '', topic: 'Question', message: '', website: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await sendMessage(v);
      setSent(true);
      toast.success('Message sent');
    } catch (x) {
      setError(errorMessage(x));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1fr_1.2fr] md:gap-16 md:py-20">
      <div>
        <h1 className="animate-rise font-display text-5xl font-extrabold tracking-tight">Contact</h1>
        <p className="mt-3 max-w-md text-lg text-muted">Questions, feedback or a bug to report? Write to us and we will reply by email.</p>

        <div className="mt-8 border-t-2 border-strong">
          {tips.map((t, i) => (
            <div
              key={t.title}
              className="grid animate-rise grid-cols-[32px_1fr] gap-3 border-b border-rule py-4"
              style={{ animationDelay: `${150 + i * 90}ms` }}
            >
              <i className={`fa-solid ${t.icon} pt-1 text-xl`} />
              <div>
                <h2 className="font-display text-lg font-semibold">{t.title}</h2>
                <p className="text-muted">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-muted">
          Looking for a quick answer first? Try the <Link to="/faq" className="font-semibold text-strong underline">questions page</Link>.
        </p>
      </div>

      <div className="rounded-md bg-paper p-7 shadow-sm md:p-9">
        {sent ? (
          <div className="animate-pop py-10 text-center">
            <i className="fa-solid fa-circle-check text-6xl text-emerald-700" />
            <h2 className="mt-4 font-display text-2xl font-semibold">Message sent</h2>
            <p className="mb-6 text-muted">Thank you. We will get back to you by email.</p>
            <Button variant="ghost" onClick={() => { setSent(false); setV({ ...v, message: '' }); }}>Send another</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="relative grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" value={v.name} onChange={set('name')} required />
              <Input label="Email" type="email" value={v.email} onChange={set('email')} required />
            </div>
            <Select label="What is this about?" value={v.topic} onChange={set('topic')}>
              {TOPICS.map((t) => <option key={t}>{t}</option>)}
            </Select>
            <div>
              <Textarea label="Message" value={v.message} onChange={set('message')} minLength={10} maxLength={MAX} rows={6} required />
              <p className="mt-1 text-right text-sm text-muted">{v.message.length} / {MAX}</p>
            </div>
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={v.website}
              onChange={set('website')}
              className="absolute -left-[9999px]"
            />
            {error && <Alert>{error}</Alert>}
            <Button disabled={busy} icon={busy ? 'fa-spinner fa-spin' : 'fa-paper-plane'}>Send message</Button>
          </form>
        )}
      </div>
    </section>
  );
}
