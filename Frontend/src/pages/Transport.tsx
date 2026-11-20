import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Star,
  Truck,
  User,
  X,
} from 'lucide-react'
import { Modal } from '@/components/Modal'
import { MyListingsInline } from '@/components/MyListingsInline'
import { useAuth } from '@/lib/auth'
import {
  transporterOffers as seedTransporters,
  moveRequests as seedRequests,
  TND,
  type TransporterOffer,
  type MoveRequest,
} from '@/lib/data'
import { useToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

export function Transport() {
  const { session, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [myListingsOpen, setMyListingsOpen] = useState(false)

  const [activeTab, setActiveTab] = useState<'transporters' | 'requests'>('transporters')
  const [transporters, setTransporters] = useState<TransporterOffer[]>(seedTransporters)
  const [requests, setRequests] = useState<MoveRequest[]>(seedRequests)
  const [selectedCity, setSelectedCity] = useState('Toutes')
  const [onlyWithHelper, setOnlyWithHelper] = useState(false)

  // Modals state
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [contactTarget, setContactTarget] = useState<string | null>(null)
  const [contactMessage, setContactMessage] = useState('')

  // Form for offering transporter services
  const [offerForm, setOfferForm] = useState({
    name: session?.name ?? '',
    phone: '+216 ',
    city: 'Tunis',
    zones: 'Grand Tunis',
    vehicle: 'Fourgonnette utilitaire',
    capacity: '10 m³',
    baseRate: '50',
    availability: 'Disponible 7j/7',
    helperIncluded: true,
    description: '',
  })

  // Form for requesting transport
  const [requestForm, setRequestForm] = useState({
    studentName: session?.name ?? '',
    fromCity: '',
    toCity: '',
    date: 'Samedi prochain',
    volumeDescription: '',
    budget: '60',
    notes: '',
  })

  const filteredTransporters = useMemo(() => {
    return transporters.filter((t) => {
      if (selectedCity !== 'Toutes' && t.city !== selectedCity && !t.zones.includes(selectedCity)) {
        return false
      }
      if (onlyWithHelper && !t.helperIncluded) {
        return false
      }
      return true
    })
  }, [transporters, selectedCity, onlyWithHelper])

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (selectedCity !== 'Toutes' && !r.fromCity.includes(selectedCity) && !r.toCity.includes(selectedCity)) {
        return false
      }
      return true
    })
  }, [requests, selectedCity])

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!offerForm.name.trim()) return

    const newOffer: TransporterOffer = {
      id: `t-${Date.now()}`,
      name: offerForm.name,
      avatar: '',
      city: offerForm.city,
      zones: offerForm.zones,
      vehicle: offerForm.vehicle,
      capacity: offerForm.capacity,
      baseRate: Number(offerForm.baseRate) || 50,
      rating: 5.0,
      reviews: 1,
      availability: offerForm.availability,
      helperIncluded: offerForm.helperIncluded,
      description: offerForm.description || 'Service de transport ponctuel et soigné.',
      phone: offerForm.phone,
    }

    setTransporters([newOffer, ...transporters])
    setOfferModalOpen(false)
    toast('Ton offre de transporteur est publiée avec succès !', 'success')
  }

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestForm.fromCity.trim() || !requestForm.toCity.trim()) return

    const newReq: MoveRequest = {
      id: `r-${Date.now()}`,
      studentName: requestForm.studentName || session?.name || 'Étudiant',
      studentAvatar: '',
      fromCity: requestForm.fromCity,
      toCity: requestForm.toCity,
      date: requestForm.date,
      volumeDescription: requestForm.volumeDescription || 'Quelques meubles et cartons',
      budget: Number(requestForm.budget) || 50,
      status: 'ouverte',
      notes: requestForm.notes,
    }

    setRequests([newReq, ...requests])
    setRequestModalOpen(false)
    toast('Ta demande de déménagement est en ligne !', 'success')
  }

  const handleSendMessage = () => {
    if (!contactMessage.trim()) return
    toast(`Message envoyé à ${contactTarget} !`, 'success')
    setContactTarget(null)
    setContactMessage('')
  }

  const cities = ['Toutes', 'Tunis', 'La Marsa', 'Ariana', 'Sousse', 'Monastir', 'Sfax']

  const activeCount =
    (selectedCity !== 'Toutes' ? 1 : 0) + (onlyWithHelper ? 1 : 0)

  return (
    <>
      {/* ── Top Header matching HousingSearch exactly ── */}
      <section className="border-b border-ink/[0.07] bg-cream">
        <div className="mx-auto w-full max-w-[88rem] px-5 py-8 sm:px-8 lg:px-12">
          <p className="eyebrow mb-2">Transport · déménagement</p>
          <h1 className="display text-[clamp(2.2rem,4.6vw,3.8rem)]">
            Ton déménagement, <span className="font-serif italic text-clay-deep">au juste prix.</span>
          </h1>
        </div>
      </section>

      {/* ── Main content with filters sidebar & cards grid ── */}
      <section className="mx-auto w-full max-w-[88rem] px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[1.6rem] border border-ink/[0.06] bg-white p-5">
              <div className="mb-5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold">Filtres</p>
                  {activeCount > 0 && (
                    <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[10px] font-semibold text-clay-deep">
                      {activeCount}
                    </span>
                  )}
                </div>
                <span className="text-[11.5px] font-medium text-ink-soft">
                  <strong className="text-ink">
                    {activeTab === 'transporters' ? filteredTransporters.length : filteredRequests.length}
                  </strong>{' '}
                  disponibles
                </span>
              </div>

              {/* City / Zone */}
              <div>
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                  Ville / Zone
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cities.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedCity(value)}
                      className={cn('chip', selectedCity === value && 'chip-active')}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Helper filter for transporters */}
              {activeTab === 'transporters' && (
                <div className="mt-5 border-t border-ink/[0.06] pt-4">
                  <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    Service
                  </p>
                  <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-soft transition hover:text-ink">
                    <input
                      type="checkbox"
                      checked={onlyWithHelper}
                      onChange={(e) => setOnlyWithHelper(e.target.checked)}
                      className="size-4 rounded border-ink/20 accent-[#d07a3b]"
                    />
                    Aide au portage incluse
                  </label>
                </div>
              )}

              {/* Reset */}
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('Toutes')
                    setOnlyWithHelper(false)
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-ink/10 py-2.5 text-[12px] font-semibold text-ink-soft transition hover:border-ink/25 hover:text-ink"
                >
                  <X className="size-3.5" />
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </aside>

          {/* Results column */}
          <div>
            {/* Toolbar above the cards */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              {/* Left side: Mes annonces + Tab toggle */}
              <div className="flex flex-wrap items-center gap-2.5">
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => setMyListingsOpen((v) => !v)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition shadow-sm',
                      myListingsOpen
                        ? 'bg-ink text-cream'
                        : 'border border-ink/10 bg-white text-ink hover:border-ink/25 hover:bg-cream',
                    )}
                  >
                    <User className="size-3.5" />
                    {myListingsOpen ? 'Retour aux offres' : 'Mes annonces'}
                  </button>
                )}

                {/* Tabs: Transporters vs Requests */}
                {!myListingsOpen && (
                  <div className="inline-flex rounded-full border border-ink/10 bg-white p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab('transporters')}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition',
                        activeTab === 'transporters'
                          ? 'bg-ink text-cream shadow-sm'
                          : 'text-ink-soft hover:text-ink',
                      )}
                    >
                      <Truck className="size-3.5" />
                      <span>Transporteurs</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[9.5px]',
                          activeTab === 'transporters' ? 'bg-white/20 text-white' : 'bg-cream text-ink-soft',
                        )}
                      >
                        {filteredTransporters.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('requests')}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition',
                        activeTab === 'requests'
                          ? 'bg-ink text-cream shadow-sm'
                          : 'text-ink-soft hover:text-ink',
                      )}
                    >
                      <Package className="size-3.5" />
                      <span>Demandes d'étudiants</span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.2 text-[9.5px]',
                          activeTab === 'requests' ? 'bg-white/20 text-white' : 'bg-cream text-ink-soft',
                        )}
                      >
                        {filteredRequests.length}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right side: Action CTA (Only when authenticated) */}
              {!myListingsOpen && isAuthenticated && (
                <div className="flex items-center gap-2">
                  {activeTab === 'transporters' && (
                    <button
                      type="button"
                      onClick={() => setOfferModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-ink shadow-sm transition hover:border-ink/25 hover:bg-cream"
                    >
                      <Truck className="size-3.5 text-clay-deep" />
                      <span>Proposer mes services</span>
                    </button>
                  )}

                  {activeTab === 'requests' && (
                    <button
                      type="button"
                      onClick={() => setRequestModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-clay px-3.5 py-2 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-clay-deep"
                    >
                      <Plus className="size-3.5" />
                      <span>Publier une demande d'aide</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Below Toolbar: MyListingsInline OR Cards (WITHOUT images) */}
            {myListingsOpen ? (
              <MyListingsInline category="demenagement" />
            ) : activeTab === 'transporters' ? (
              /* Transporter Cards (WITHOUT images) */
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredTransporters.map((transporter) => (
                  <article
                    key={transporter.id}
                    className="flex flex-col justify-between rounded-[1.6rem] border border-ink/[0.07] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div>
                      {/* Driver info without image: uses clean icon badge */}
                      <div className="flex items-start gap-3.5">
                        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-cream-deep text-ink">
                          <Truck className="size-5 text-clay-deep" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="truncate text-[15px] font-semibold">{transporter.name}</h3>
                            <BadgeCheck className="size-4 shrink-0 text-sage" />
                          </div>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-soft">
                            <MapPin className="size-3 text-clay" />
                            {transporter.city} · {transporter.zones}
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-[11px]">
                            <Star className="size-3 fill-clay text-clay" />
                            <span className="font-semibold">{transporter.rating}</span>
                            <span className="text-ink-soft">({transporter.reviews} avis)</span>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle specs */}
                      <div className="mt-4 rounded-xl bg-cream/70 p-3 text-[11.5px]">
                        <div className="flex items-center justify-between text-ink-soft">
                          <span>Véhicule :</span>
                          <span className="font-semibold text-ink">{transporter.vehicle}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-ink-soft">
                          <span>Volume utile :</span>
                          <span className="font-semibold text-ink">{transporter.capacity}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-ink-soft">
                          <span>Disponibilité :</span>
                          <span className="font-semibold text-sage">{transporter.availability}</span>
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-ink-soft">
                        « {transporter.description} »
                      </p>

                      {transporter.helperIncluded && (
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-sage">
                          <Check className="size-3.5 shrink-0" />
                          <span>Aide au portage et manutention incluse</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA & Price */}
                    <div className="mt-5 border-t border-ink/[0.06] pt-3.5">
                      <div className="mb-3 flex items-baseline justify-between">
                        <span className="text-[11px] text-ink-soft">À partir de</span>
                        <span className="text-[18px] font-semibold text-clay-deep">
                          {TND(transporter.baseRate)}
                          <span className="text-[10px] font-normal text-ink-soft"> / trajet</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setContactTarget(transporter.name)
                          setContactMessage(
                            `Bonjour ${transporter.name}, j'ai besoin d'un déménagement avec votre ${transporter.vehicle}. Êtes-vous disponible prochainement ?`,
                          )
                        }}
                        className="btn-ink btn-sm w-full"
                      >
                        <MessageSquare className="size-3.5" />
                        Contacter
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Student Move Requests Cards (WITHOUT images) */
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredRequests.map((request) => (
                  <article
                    key={request.id}
                    className="flex flex-col justify-between rounded-[1.6rem] border border-ink/[0.07] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div>
                      {/* Header without photo: uses clean package icon badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-cream-deep text-ink">
                            <Package className="size-5 text-clay-deep" />
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold">{request.studentName}</p>
                            <span className="inline-block rounded-full bg-sage-soft px-2 py-0.5 text-[9.5px] font-semibold text-sage">
                              Demande active
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Route From ➔ To */}
                      <div className="mt-4 rounded-xl border border-ink/[0.06] bg-cream/40 p-3">
                        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                          <span className="truncate">{request.fromCity}</span>
                          <ArrowRight className="size-3.5 shrink-0 text-clay" />
                          <span className="truncate">{request.toCity}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-soft">
                          <CalendarDays className="size-3.5 text-clay" />
                          <span>Date : {request.date}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="mt-3 space-y-1 text-[12px] text-ink-soft">
                        <p>
                          <strong className="text-ink">Objets :</strong> {request.volumeDescription}
                        </p>
                        {request.notes && (
                          <p className="italic text-ink-soft">« {request.notes} »</p>
                        )}
                      </div>
                    </div>

                    {/* Budget & Action */}
                    <div className="mt-5 border-t border-ink/[0.06] pt-3.5">
                      <div className="mb-3 flex items-baseline justify-between">
                        <span className="text-[11px] text-ink-soft">Budget proposé</span>
                        <span className="text-[18px] font-semibold text-sage">
                          {TND(request.budget)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setContactTarget(request.studentName)
                          setContactMessage(
                            `Bonjour ${request.studentName}, j'ai vu votre demande de transport de ${request.fromCity} à ${request.toCity}. Je peux m'en charger pour ${request.budget} DT.`,
                          )
                        }}
                        className="btn-primary btn-sm w-full"
                      >
                        <MessageSquare className="size-3.5" />
                        Proposer mon aide
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Modal 1: Proposer mes services (Aligned & clean form) ── */}
      <Modal
        open={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        title="Proposer mes services de transporteur"
      >
        <form onSubmit={handleCreateOffer} className="space-y-4">
          <p className="text-[12px] leading-relaxed text-ink-soft">
            Offre tes services de transport ou de camionnette aux étudiants de la plateforme.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">Nom complet</label>
              <input
                value={offerForm.name}
                onChange={(e) => setOfferForm({ ...offerForm, name: e.target.value })}
                required
                className="field"
                placeholder="Ex : Mohamed Trabelsi"
              />
            </div>
            <div>
              <label className="field-label">Numéro de téléphone</label>
              <input
                value={offerForm.phone}
                onChange={(e) => setOfferForm({ ...offerForm, phone: e.target.value })}
                required
                className="field"
                placeholder="+216 22 123 456"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">Ville principale</label>
              <select
                value={offerForm.city}
                onChange={(e) => setOfferForm({ ...offerForm, city: e.target.value })}
                className="field"
              >
                {cities.filter((c) => c !== 'Toutes').map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Zones desservies</label>
              <input
                value={offerForm.zones}
                onChange={(e) => setOfferForm({ ...offerForm, zones: e.target.value })}
                className="field"
                placeholder="Ex : Grand Tunis & Banlieue Nord"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="field-label">Type de véhicule</label>
              <input
                value={offerForm.vehicle}
                onChange={(e) => setOfferForm({ ...offerForm, vehicle: e.target.value })}
                className="field"
                placeholder="Ex : Fourgonnette..."
              />
            </div>
            <div>
              <label className="field-label">Volume (m³)</label>
              <input
                value={offerForm.capacity}
                onChange={(e) => setOfferForm({ ...offerForm, capacity: e.target.value })}
                className="field"
                placeholder="Ex : 10 m³"
              />
            </div>
            <div>
              <label className="field-label">Tarif de base (DT)</label>
              <input
                type="number"
                value={offerForm.baseRate}
                onChange={(e) => setOfferForm({ ...offerForm, baseRate: e.target.value })}
                className="field"
                placeholder="50"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Disponibilité</label>
            <input
              value={offerForm.availability}
              onChange={(e) => setOfferForm({ ...offerForm, availability: e.target.value })}
              className="field"
              placeholder="Ex : 7j/7, Soirs et week-ends"
            />
          </div>

          <div>
            <label className="field-label">Description & options</label>
            <textarea
              value={offerForm.description}
              onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
              rows={2}
              className="field h-auto py-2"
              placeholder="Précise si tu aides à monter les étages..."
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-ink-soft">
            <input
              type="checkbox"
              checked={offerForm.helperIncluded}
              onChange={(e) => setOfferForm({ ...offerForm, helperIncluded: e.target.checked })}
              className="size-4 rounded accent-[#d07a3b]"
            />
            J'aide personnellement au chargement et au portage
          </label>

          <div className="mt-5 flex justify-end gap-2 border-t border-ink/[0.06] pt-4">
            <button
              type="button"
              onClick={() => setOfferModalOpen(false)}
              className="btn-ghost btn-sm"
            >
              Annuler
            </button>
            <button type="submit" className="btn-primary btn-sm">
              Publier mon profil transporteur
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Modal 2: Publier une demande d'aide (Aligned & clean form) ── */}
      <Modal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Publier une demande de déménagement"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <p className="text-[12px] leading-relaxed text-ink-soft">
            Décris ce que tu dois déplacer. Les transporteurs de la communauté te feront des propositions.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">Adresse de départ (Ville)</label>
              <input
                value={requestForm.fromCity}
                onChange={(e) => setRequestForm({ ...requestForm, fromCity: e.target.value })}
                required
                className="field"
                placeholder="Ex : Tunis (El Manar)"
              />
            </div>
            <div>
              <label className="field-label">Adresse d'arrivée (Ville)</label>
              <input
                value={requestForm.toCity}
                onChange={(e) => setRequestForm({ ...requestForm, toCity: e.target.value })}
                required
                className="field"
                placeholder="Ex : Sousse (Khezama)"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">Date souhaitée</label>
              <input
                value={requestForm.date}
                onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })}
                className="field"
                placeholder="Ex : Samedi 22 nov."
              />
            </div>
            <div>
              <label className="field-label">Budget max proposé (DT)</label>
              <input
                type="number"
                value={requestForm.budget}
                onChange={(e) => setRequestForm({ ...requestForm, budget: e.target.value })}
                className="field"
                placeholder="60"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Objets à transporter</label>
            <textarea
              value={requestForm.volumeDescription}
              onChange={(e) => setRequestForm({ ...requestForm, volumeDescription: e.target.value })}
              required
              rows={2}
              className="field h-auto py-2"
              placeholder="Ex : Lit 1 place, bureau démonté, 4 cartons..."
            />
          </div>

          <div>
            <label className="field-label">Précisions (étages, ascenseur...)</label>
            <input
              value={requestForm.notes}
              onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
              className="field"
              placeholder="Ex : 2e étage sans ascenseur au départ"
            />
          </div>

          <div className="mt-5 flex justify-end gap-2 border-t border-ink/[0.06] pt-4">
            <button
              type="button"
              onClick={() => setRequestModalOpen(false)}
              className="btn-ghost btn-sm"
            >
              Annuler
            </button>
            <button type="submit" className="btn-primary btn-sm">
              Mettre ma demande en ligne
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Modal 3: Contacter ── */}
      <Modal
        open={Boolean(contactTarget)}
        onClose={() => setContactTarget(null)}
        title={`Message pour ${contactTarget}`}
      >
        <div className="space-y-4">
          <p className="text-[12px] text-ink-soft">
            Ton message sera envoyé dans la messagerie TSH de {contactTarget}.
          </p>

          <textarea
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            rows={4}
            className="field h-auto py-2.5"
            placeholder="Écris ton message ici..."
          />

          <div className="flex justify-end gap-2 border-t border-ink/[0.06] pt-3">
            <button
              type="button"
              onClick={() => setContactTarget(null)}
              className="btn-ghost btn-sm"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!contactMessage.trim()}
              className="btn-primary btn-sm"
            >
              <MessageSquare className="size-3.5" />
              Envoyer le message
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
