import { useState } from 'react';
import { writeReminder } from '../../api/aiApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { errorMessage, getCurrency } from '../../utils/format';
import { reminderMessage, whatsappLink } from '../../utils/reminder';
import Button from '../ui/Button';
import LinkButton from '../ui/LinkButton';

const TONES = [
  ['friendly', 'Friendly'],
  ['polite', 'Polite'],
  ['firm', 'Firm']
];
const LANGUAGES = ['English', 'Roman Urdu', 'Urdu'];
const pick = 'rounded-md border border-rule bg-card px-2.5 py-2 text-sm';

// Payment reminder for an unpaid invoice. It starts with a standard message; "Write with AI" (Groq)
// rewrites it in the chosen tone and language. The text is always editable before it is copied or sent.
export default function ReminderWriter({ invoice }) {
  const { user } = useAuth();
  const toast = useToast();
  const [text, setText] = useState(() => reminderMessage(invoice, user.name));
  const [tone, setTone] = useState('polite');
  const [language, setLanguage] = useState('English');
  const [busy, setBusy] = useState(false);
  const [byAi, setByAi] = useState(false);

  const write = async () => {
    setBusy(true);
    try {
      const data = await writeReminder({ invoiceId: invoice._id, tone, language, currency: getCurrency() });
      setText(data.message);
      setByAi(true);
    } catch (e) {
      toast.error(`${errorMessage(e)} Your message was not changed.`);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); toast.success('Reminder copied'); }
    catch { toast.error('Could not copy. Select the text and copy it manually.'); }
  };

  return (
    <section className="mt-8 rounded-md border border-rule bg-card/60 p-4 print:hidden">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Payment reminder</h2>
        {byAi && (
          <span className="rounded-full bg-desk px-2.5 py-0.5 text-xs text-muted">
            <i className="fa-solid fa-wand-magic-sparkles mr-1.5" />
            Written by AI, please read it before sending
          </span>
        )}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        aria-label="Reminder message"
        className="w-full rounded-md border border-rule bg-card px-3 py-2.5 focus:border-strong focus:outline-none focus:ring-2 focus:ring-gold/60"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <select value={tone} onChange={(e) => setTone(e.target.value)} aria-label="Tone" className={pick}>
          {TONES.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language" className={pick}>
          {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
        </select>
        <Button icon={busy ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'} onClick={write} disabled={busy}>
          {busy ? 'Writing' : 'Write with AI'}
        </Button>
        <Button variant="ghost" icon="fa-copy" onClick={copy}>Copy</Button>
        <LinkButton href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" variant="ghost" icon="fa-brands fa-whatsapp">
          WhatsApp
        </LinkButton>
      </div>
    </section>
  );
}