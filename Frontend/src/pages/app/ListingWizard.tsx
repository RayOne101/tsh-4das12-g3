import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  Check,
  ChevronLeft,
  Home,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import { PageHeader, Panel } from '@/components/AppBits'
import { ButtonLink } from '@/components/ButtonLink'
import { Photo } from '@/components/Photo'
import { useAuth } from '@/lib/auth'
import { photo, TND } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

const steps = ['Le bien', 'Localisation & prix', 'Photos & équipements', 'Aperçu']
const types = [
  { value: 'appartement', label: 'Appartement', icon: Building2 },
  { value: 'studio', label: 'Studio', icon: Home },
  { value: 'colocation', label: 'Chambre colocation', icon: Home },
  { value: 'meuble', label: 'Meuble d’occasion', icon: Sparkles },
]
const allAmenities = [
  'Wifi fibre',
  'Meublé',
  'Cuisine équipée',
  'Machine à laver',
  'Climatisation',
  'Balcon',
  'Parking',
  'Proche campus',
]

export function ListingWizard() {
  const { session } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [published, setPublished] = useState(false)
  const [form, setForm] = useState({
    type: 'appartement',
    title: '',
    description: '',
    city: 'Tunis',
    district: '',
    price: '850',
    charges: '40',
    surface: '65',
    rooms: '2',
    floor: '2e étage',
    available: '2026-09-01',
  })
  const [amenities, setAmenities] = useState<string[]>(['Wifi fibre', 'Meublé'])
  const [photos, setPhotos] = useState(0)

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const canNext =
    step === 1
      ? form.title.trim().length > 8
      : step === 2
        ? form.city.length > 0 && Number(form.price) > 0
        : true

  const publish = () => {
    setPublished(true)
    toast('Annonce publiée avec succès !', 'success')
  }

  if (published) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-sage-soft text-sage">
          <BadgeCheck className="size-8" />
        </span>
        <h1 className="display mt-5 text-[2.2rem]">Annonce publiée avec succès !</h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
          Ton annonce est désormais en ligne et consultable par tous les utilisateurs de la plateforme.
        </p>
        <div className="mt-6 rounded-[1.5rem] border border-ink/[0.07] bg-white p-5 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Récapitulatif
          </p>
          <p className="mt-2 text-[14px] font-semibold">{form.title || 'Nouvelle annonce'}</p>
          <p className="mt-1 text-[12px] text-ink-soft">
            {form.district ? `${form.district}, ` : ''}{form.city} · {TND(Number(form.price))}/mois ·{' '}
            {form.surface} m²
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-sage-soft px-3 py-2 text-[11.5px] font-semibold text-sage">
            <Check className="size-4" />
            Statut : En ligne et active
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <ButtonLink to="/app/annonces" variant="ink">
            Voir mes annonces
            <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink to="/" variant="ghost">
            Retour aux logements
          </ButtonLink>
        </div>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/app/annonces')}
        className="mb-4 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-soft transition hover:text-ink"
      >
        <ChevronLeft className="size-3.5" />
        Mes annonces
      </button>

      <PageHeader
        eyebrow="Nouvelle annonce"
        title={
          <>
            Publie ton bien,
            <br />
            <span className="font-serif italic text-clay-deep">sans y passer la journée.</span>
          </>
        }
        description={`Connecté en tant que ${session?.name}. Les annonces passent toutes par la vérification TSH avant publication.`}
      />

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div>
          {/* Stepper */}
          <div className="mb-4 flex items-center gap-2 overflow-x-auto rounded-[1.2rem] border border-ink/[0.07] bg-white px-3 py-2.5 no-scrollbar">
            {steps.map((label, i) => {
              const n = i + 1
              return (
                <div key={label} className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => n < step && setStep(n)}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[10.5px] font-semibold transition',
                      n === step
                        ? 'bg-ink text-cream'
                        : n < step
                          ? 'text-sage hover:bg-sage-soft'
                          : 'text-ink-soft',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-5 place-items-center rounded-full text-[9px]',
                        n === step ? 'bg-clay text-ink' : n < step ? 'bg-sage text-white' : 'bg-cream-deep',
                      )}
                    >
                      {n < step ? <Check className="size-3" /> : n}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                  {i < steps.length - 1 && <span className="h-px w-3 bg-ink/10" />}
                </div>
              )
            })}
          </div>

          <Panel>
            {step === 1 && (
              <div className="animate-fade-up">
                <h2 className="text-[17px] font-semibold tracking-[-0.02em]">Quel type de bien ?</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {types.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => set('type', type.value)}
                      className={cn(
                        'rounded-xl border p-3 text-left transition',
                        form.type === type.value
                          ? 'border-ink bg-ink text-cream'
                          : 'border-ink/10 bg-cream/40 hover:border-ink/25',
                      )}
                    >
                      <type.icon className={cn('size-4', form.type === type.value ? 'text-clay' : 'text-ink-soft')} />
                      <span className="mt-2 block text-[11.5px] font-semibold">{type.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="field-label" htmlFor="title">Titre de l’annonce</label>
                  <input
                    id="title"
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="Ex. Appartement lumineux à deux pas de la corniche"
                    className="field"
                  />
                  <p className="mt-1.5 text-[10px] text-ink-soft">
                    Un bon titre décrit le bien en une phrase, sans majuscules criardes.
                  </p>
                </div>

                <div className="mt-4">
                  <label className="field-label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    rows={5}
                    placeholder="Décris les pièces, l’ambiance, les transports et ce qui est inclus dans le loyer…"
                    className="field h-auto py-3"
                  />
                  <p className="mt-1.5 text-right text-[9.5px] text-ink-soft">{form.description.length} / 600</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-up">
                <h2 className="text-[17px] font-semibold tracking-[-0.02em]">Où se trouve le bien ?</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="city">Ville</label>
                    <select id="city" value={form.city} onChange={(e) => set('city', e.target.value)} className="field">
                      {['Tunis', 'La Marsa', 'Ariana', 'Sousse', 'Monastir', 'Sfax', 'Bizerte'].map((city) => (
                        <option key={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="district">Quartier</label>
                    <input
                      id="district"
                      value={form.district}
                      onChange={(e) => set('district', e.target.value)}
                      placeholder="La Marsa, El Ghazala…"
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="surface">Surface (m²)</label>
                    <input
                      id="surface"
                      type="number"
                      value={form.surface}
                      onChange={(e) => set('surface', e.target.value)}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="rooms">Nombre de pièces</label>
                    <select id="rooms" value={form.rooms} onChange={(e) => set('rooms', e.target.value)} className="field">
                      {['1', '2', '3', '4', '5'].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="floor">Étage</label>
                    <select id="floor" value={form.floor} onChange={(e) => set('floor', e.target.value)} className="field">
                      {['Rez-de-chaussée', '1er étage', '2e étage', '3e étage', '4e étage et +'].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label" htmlFor="available">Disponible à partir du</label>
                    <input
                      id="available"
                      type="date"
                      value={form.available}
                      onChange={(e) => set('available', e.target.value)}
                      className="field"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="field-label" htmlFor="price">Loyer mensuel (DT)</label>
                    <input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) => set('price', e.target.value)}
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="charges">Charges comprises (DT)</label>
                    <input
                      id="charges"
                      type="number"
                      value={form.charges}
                      onChange={(e) => set('charges', e.target.value)}
                      className="field"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-cream p-3">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-clay" />
                  <p className="text-[10.5px] leading-relaxed text-ink-soft">
                    Prix conseillé pour un {form.surface} m² à {form.city} :{' '}
                    <strong className="text-ink">
                      {TND(Math.round(Number(form.surface) * 11))} – {TND(Math.round(Number(form.surface) * 14))}
                    </strong>
                    . Un prix 20 % au-dessus du marché déclenche une vérification manuelle.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-up">
                <h2 className="text-[17px] font-semibold tracking-[-0.02em]">Photos & équipements</h2>
                <p className="mt-1 text-[11.5px] text-ink-soft">
                  Ajoute au moins 3 photos réelles. Les images génériques ou prises sur internet sont
                  refusées.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const filled = i < photos
                    return (
                      <div
                        key={i}
                        className={cn(
                          'relative aspect-[4/3] overflow-hidden rounded-xl border',
                          filled ? 'border-ink/10' : 'border-dashed border-ink/20 bg-cream/50',
                        )}
                      >
                        {filled ? (
                          <>
                            <Photo
                              src={images[i % images.length]}
                              alt={`Photo ${i + 1}`}
                              rounded="rounded-xl"
                              className="size-full"
                            />
                            <button
                              type="button"
                              onClick={() => setPhotos((p) => Math.min(p, i))}
                              aria-label="Supprimer la photo"
                              className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-white/90 text-rust"
                            >
                              <X className="size-3" />
                            </button>
                            {i === 0 && (
                              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-ink/85 px-2 py-0.5 text-[8.5px] font-semibold text-cream">
                                Photo principale
                              </span>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPhotos((p) => Math.max(p, i + 1))}
                            className="flex size-full flex-col items-center justify-center gap-1.5 text-ink-soft transition hover:bg-cream"
                          >
                            {i === photos ? <ImagePlus className="size-5" /> : <Camera className="size-4 opacity-40" />}
                            <span className="text-[9.5px] font-medium">
                              {i === photos ? 'Ajouter' : 'Emplacement libre'}
                            </span>
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setPhotos((p) => Math.min(6, p + 1))}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 py-3 text-[11.5px] font-semibold text-ink-soft transition hover:border-ink/40 hover:text-ink"
                >
                  <Upload className="size-4" />
                  Importer depuis mon téléphone
                </button>

                <p className="field-label mt-5">Équipements inclus</p>
                <div className="flex flex-wrap gap-1.5">
                  {allAmenities.map((amenity) => {
                    const active = amenities.includes(amenity)
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() =>
                          setAmenities((current) =>
                            current.includes(amenity)
                              ? current.filter((a) => a !== amenity)
                              : [...current, amenity],
                          )
                        }
                        className={cn('chip', active && 'chip-active')}
                      >
                        {active && <Check className="size-3" />}
                        {amenity}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-up">
                <h2 className="text-[17px] font-semibold tracking-[-0.02em]">Tout est correct ?</h2>
                <p className="mt-1 text-[11.5px] text-ink-soft">
                  Voici ce que verront les étudiants. Tu pourras encore modifier après publication.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                  <Photo
                    src={images[0]}
                    alt="Aperçu de l’annonce"
                    className="aspect-[4/3]"
                    rounded="rounded-[1.2rem]"
                  />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                      {form.district || 'Quartier'}, {form.city}
                    </p>
                    <p className="mt-1 text-[15px] font-semibold leading-snug">
                      {form.title || 'Titre de ton annonce'}
                    </p>
                    <p className="mt-1 text-[11px] text-ink-soft">
                      {form.rooms} pièces · {form.surface} m² · {form.floor}
                    </p>
                    <p className="mt-3 text-[22px] font-semibold tracking-[-0.04em]">
                      {TND(Number(form.price))}
                      <span className="text-[11px] font-normal text-ink-soft"> / mois</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {amenities.slice(0, 4).map((a) => (
                        <span key={a} className="rounded-full bg-cream px-2 py-0.5 text-[9px] text-ink-soft">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-2 rounded-xl bg-cream p-4 text-[11px] sm:grid-cols-2">
                  {[
                    ['Type', types.find((t) => t.value === form.type)?.label ?? '—'],
                    ['Ville', form.city],
                    ['Loyer', TND(Number(form.price))],
                    ['Charges', TND(Number(form.charges))],
                    ['Disponible', new Date(form.available).toLocaleDateString('fr-FR')],
                    ['Photos', `${photos || 0} / 6`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 border-b border-ink/[0.06] py-1.5 last:border-0">
                      <span className="text-ink-soft">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>

                <label className="mt-4 flex items-start gap-2.5 rounded-xl bg-white p-3 text-[10.5px] leading-relaxed text-ink-soft">
                  <span className="mt-0.5 grid size-4 place-items-center rounded bg-sage-soft text-sage">
                    <Check className="size-2.5" />
                  </span>
                  Je certifie être le propriétaire ou le mandataire de ce bien, et que les photos
                  correspondent à la réalité.
                </label>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-ink/[0.07] pt-4">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="btn-ghost btn-sm disabled:invisible"
              >
                <ArrowLeft className="size-3.5" />
                Retour
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext}
                  className="btn-primary btn-sm"
                >
                  Continuer
                  <ArrowRight className="size-3.5" />
                </button>
              ) : (
                <button type="button" onClick={publish} className="btn-primary btn-sm">
                  Publier et envoyer en vérification
                  <ShieldCheck className="size-3.5" />
                </button>
              )}
            </div>
          </Panel>
        </div>

        {/* Preview / advice */}
        <aside className="space-y-3">
          <div className="rounded-[1.5rem] border border-ink/[0.07] bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Aperçu en direct
              </p>
              <span className="size-1.5 rounded-full bg-clay" />
            </div>
            <Photo
              src={images[0]}
              alt="Aperçu"
              className="aspect-[4/3]"
              rounded="rounded-[1rem]"
            />
            <div className="mt-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                {form.district || 'Quartier'} · {form.city}
              </p>
              <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug">
                {form.title || 'Ton titre apparaîtra ici'}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[16px] font-semibold tracking-[-0.03em]">
                  {TND(Number(form.price))}
                  <span className="text-[10px] font-normal text-ink-soft"> /mois</span>
                </p>
                <span className="flex items-center gap-1 text-[9px] font-semibold text-sage">
                  <BadgeCheck className="size-3" />
                  Vérifiable
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-ink p-4 text-cream">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/45">
              Conseils TSH
            </p>
            <ul className="mt-3 space-y-2.5">
              {[
                'Des photos lumineuses, prises le jour, sans filtre.',
                'Un prix tout compris est plus attractif qu’un loyer bas + charges.',
                'Mentionne les transports et le campus le plus proche.',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-[10.5px] leading-relaxed text-cream/65">
                  <Check className="mt-0.5 size-3 shrink-0 text-clay" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.5rem] border border-ink/[0.07] bg-cream p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold">
              <MapPin className="size-3.5 text-clay" />
              Localisation
            </p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-soft">
              L’adresse exacte n’est partagée qu’après confirmation d’une visite. Le quartier suffit
              pour la publication.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}

const images = [
  photo('1522708323590-d24dbb6b0267', 800),
  photo('1560448204-e02f11c3d0e2', 800),
  photo('1484154218962-a197022b5858', 800),
  photo('1505691938895-1758d7feb511', 800),
  photo('1600607687939-ce8a6c25118c', 800),
  photo('1493809842364-78817add7ffb', 800),
]
