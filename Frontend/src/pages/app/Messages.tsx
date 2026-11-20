import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  Info,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Smile,
} from 'lucide-react'
import { PageHeader } from '@/components/AppBits'
import { conversations as seed, type Conversation } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export function Messages() {
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>(seed)
  const [activeId, setActiveId] = useState(seed[0].id)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [mobileThread, setMobileThread] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const active = conversations.find((c) => c.id === activeId)!

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [activeId, active.messages.length])

  const send = () => {
    if (!draft.trim()) return
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              unread: 0,
              lastAt: 'maintenant',
              messages: [
                ...conversation.messages,
                { id: String(Date.now()), from: 'me', text: draft.trim(), at: 'maintenant' },
              ],
            }
          : conversation,
      ),
    )
    setDraft('')
    toast('Message envoyé', 'success')
  }

  const filtered = conversations.filter((c) =>
    `${c.name} ${c.listing}`.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <>
      <PageHeader
        eyebrow="Messagerie"
        title="Tes conversations"
        description="Les échanges restent sur TSH jusqu’à la signature. Ne partage jamais tes coordonnées bancaires ici."
        actions={
          <Link to="/logements" className="btn-ghost btn-sm">
            Trouver un logement
            <ArrowUpRight className="size-3.5" />
          </Link>
        }
      />

      <div className="grid min-w-0 overflow-hidden rounded-[1.5rem] border border-ink/[0.07] bg-white lg:h-[calc(100dvh-17rem)] lg:min-h-[32rem] lg:grid-cols-[19rem_1fr]">
        {/* List */}
        <aside
          className={cn(
            'flex min-w-0 flex-col border-ink/[0.07] lg:border-r',
            mobileThread ? 'hidden lg:flex' : 'flex',
          )}
        >
          <div className="border-b border-ink/[0.07] p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une conversation"
                className="h-9 w-full rounded-full bg-cream pl-9 pr-3 text-[11.5px] placeholder:text-ink-soft/70 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="p-6 text-center text-[11.5px] text-ink-soft">Aucune conversation trouvée.</p>
            )}
            {filtered.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => {
                  setActiveId(conversation.id)
                  setMobileThread(true)
                  setConversations((current) =>
                    current.map((c) => (c.id === conversation.id ? { ...c, unread: 0 } : c)),
                  )
                }}
                className={cn(
                  'flex w-full items-start gap-3 border-b border-ink/[0.04] px-3.5 py-3.5 text-left transition',
                  activeId === conversation.id ? 'bg-cream' : 'hover:bg-cream/50',
                )}
              >
                <div className="relative shrink-0">
                  <img src={conversation.avatar} alt="" className="size-10 rounded-full object-cover" />
                  {conversation.unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-clay text-[8px] font-bold text-ink">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-[12px] font-semibold">{conversation.name}</p>
                    <span className="shrink-0 text-[9px] text-ink-soft">{conversation.lastAt}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[9.5px] font-medium uppercase tracking-[0.06em] text-clay-deep">
                    {conversation.listing}
                  </p>
                  <p className="mt-1 truncate text-[10.5px] text-ink-soft">
                    {conversation.messages[conversation.messages.length - 1].text}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-ink/[0.07] p-3">
            <div className="flex items-center gap-2 rounded-xl bg-cream p-2.5">
              <ShieldCheck className="size-4 shrink-0 text-sage" />
              <p className="text-[9px] leading-relaxed text-ink-soft">
                Ne paie jamais avant une visite. Signale toute demande suspecte.
              </p>
            </div>
          </div>
        </aside>

        {/* Thread */}
        <section className={cn('flex min-h-0 min-w-0 flex-col', mobileThread ? 'flex' : 'hidden lg:flex')}>
          <header className="flex items-center gap-3 border-b border-ink/[0.07] px-4 py-3">
            <button
              type="button"
              onClick={() => setMobileThread(false)}
              className="grid size-8 place-items-center rounded-full bg-cream lg:hidden"
              aria-label="Retour aux conversations"
            >
              <ArrowLeft className="size-4" />
            </button>
            <img src={active.avatar} alt="" className="size-9 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[12.5px] font-semibold">
                {active.name}
                <ShieldCheck className="size-3.5 text-sage" />
              </p>
              <Link
                to="/logements"
                className="block truncate text-[9.5px] text-ink-soft transition hover:text-clay-deep"
              >
                {active.listing}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => toast('Options de conversation', 'info')}
              className="grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
              aria-label="Options"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#faf8f3] px-4 py-5">
            <div className="mx-auto mb-4 flex max-w-md items-start gap-2 rounded-xl border border-ink/[0.06] bg-white px-3 py-2">
              <Info className="mt-0.5 size-3.5 shrink-0 text-ink-soft" />
              <p className="text-[9.5px] leading-relaxed text-ink-soft">
                Cette conversation est liée à l’annonce « {active.listing} ». Les coordonnées sont
                masquées tant que la visite n’est pas confirmée.
              </p>
            </div>

            {active.messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex', message.from === 'me' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-3.5 py-2.5 sm:max-w-[65%]',
                    message.from === 'me'
                      ? 'rounded-br-md bg-ink text-cream'
                      : 'rounded-bl-md border border-ink/[0.06] bg-white text-ink',
                  )}
                >
                  <p className="text-[12px] leading-relaxed">{message.text}</p>
                  <p
                    className={cn(
                      'mt-1 text-right text-[8.5px]',
                      message.from === 'me' ? 'text-cream/40' : 'text-ink-soft',
                    )}
                  >
                    {message.at}
                  </p>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-ink/[0.07] p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-ink/10 bg-white p-1.5 focus-within:border-clay">
              <button
                type="button"
                onClick={() => toast('Pièce jointe — prototype', 'info')}
                className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                aria-label="Joindre un fichier"
              >
                <Paperclip className="size-4" />
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                rows={1}
                placeholder="Écris ton message…"
                className="max-h-24 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-[12px] placeholder:text-ink-soft/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => toast('Réactions — prototype', 'info')}
                className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-cream hover:text-ink"
                aria-label="Ajouter un emoji"
              >
                <Smile className="size-4" />
              </button>
              <button
                type="button"
                onClick={send}
                disabled={!draft.trim()}
                className="grid size-8 shrink-0 place-items-center rounded-full bg-clay text-ink transition hover:bg-ink hover:text-cream disabled:opacity-40"
                aria-label="Envoyer"
              >
                <Send className="size-4" />
              </button>
            </div>
            <p className="mt-1.5 flex items-center gap-1 px-1 text-[8.5px] text-ink-soft">
              <MessageSquare className="size-2.5" />
              Entrée pour envoyer · Maj + Entrée pour un saut de ligne
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
