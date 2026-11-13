import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClientBrief, getClientBrief } from '../../api/aiApi';
import { useToast } from '../../context/ToastContext';
import { errorMessage, fmtDate } from '../../utils/format';
import Button from '../ui/Button';

const tones = { high: 'bg-emerald-100 text-emerald-800', medium: 'bg-amber-100 text-amber-900', low: 'bg-red-100 text-red-800' };

// "Research this company": Tavily searches the web, Groq turns the results into a short brief.
// Only the company name is sent out. The brief is saved so it is not searched again on every visit.
export default function ClientBrief({ client }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const company = client.company?.trim();

  const { data: brief } = useQuery({ queryKey: ['brief', client._id], queryFn: () => getClientBrief(client._id) });
  const research = useMutation({
    mutationFn: () => createClientBrief(client._id),
    onSuccess: (data) => queryClient.setQueryData(['brief', client._id], data),
    onError: (e) => toast.error(errorMessage(e))
  });

  return (
    <section className="mb-9">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold tracking-tight">Client brief</h2>
        <Button
          variant="ghost"
          icon={research.isPending ? 'fa-spinner fa-spin' : 'fa-magnifying-glass-chart'}
          onClick={() => research.mutate()}
          disabled={!company || research.isPending}
          title={company ? undefined : 'Add the company name to this client first'}
        >
          {research.isPending ? 'Researching' : brief ? 'Refresh' : 'Research this company'}
        </Button>
      </div>

      <div className="border-t-2 border-strong pt-4">
        {!company && <p className="text-muted">Add this client&apos;s company name to research it on the web.</p>}
        {company && !brief && !research.isPending && (
          <p className="max-w-2xl text-muted">
            Searches the web for {company} and writes a short brief you can use before a call or a quote. Only the company name is sent.
          </p>
        )}

        {brief && (
          <div className="animate-fade">
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <span className={`rounded-full px-2.5 py-0.5 text-sm font-semibold ${tones[brief.confidence] || tones.low}`}>
                {brief.confidence} confidence
              </span>
              <span className="text-sm text-muted">{brief.company}, {fmtDate(brief.generatedAt)}</span>
            </div>
            <p className="max-w-3xl leading-relaxed">{brief.summary}</p>

            {brief.talkingPoints?.length > 0 && (
              <>
                <h3 className="mt-4 mb-1.5 text-sm font-semibold">Good to mention or ask</h3>
                <ul className="grid max-w-3xl gap-1.5">
                  {brief.talkingPoints.map((p) => (
                    <li key={p} className="flex gap-2.5"><i className="fa-solid fa-circle-check mt-1 text-sm text-emerald-700" />{p}</li>
                  ))}
                </ul>
              </>
            )}

            {brief.sources?.length > 0 && (
              <>
                <h3 className="mt-4 mb-1.5 text-sm font-semibold">Sources</h3>
                <ul className="grid gap-1 text-sm">
                  {brief.sources.map((s) => (
                    <li key={s.url} className="truncate">
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-muted underline hover:text-strong">{s.title}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="mt-4 text-xs text-muted">
              <i className="fa-solid fa-wand-magic-sparkles mr-1.5" />
              Written by AI from web search results. Check the sources before you rely on it.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}