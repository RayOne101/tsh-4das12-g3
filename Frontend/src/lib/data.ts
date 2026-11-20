export type Role = 'guest' | 'user' | 'student' | 'owner' | 'admin'
export type ListingKind = 'appartement' | 'studio' | 'chambre' | 'colocation'
export type ListingStatus = 'publiee' | 'en_attente' | 'suspendue'

export const photo = (id: string, w = 1200) => {
  const local: Record<string, string> = {
    '1522708323590-d24dbb6b0267': '/img/interior-marsa.jpg',
    '1560448204-e02f11c3d0e2': '/img/interior-tunis.jpg',
    '1484154218962-a197022b5858': '/img/kitchen.jpg',
    '1505691938895-1758d7feb511': '/img/bedroom-marsa.jpg',
    '1502672260266-1c1ef2d93688': '/img/studio-ariana.jpg',
    '1493809842364-78817add7ffb': '/img/studio-sfax.jpg',
    '1522771739844-6a9f6d5f14af': '/img/bedroom-monastir.jpg',
    '1554995207-c18c203602cb': '/img/coloc-sousse.jpg',
    '1560185007-cde436f6a4d0': '/img/coloc-room.jpg',
    '1540518614846-7eded433c457': '/img/bedroom-2.jpg',
    '1600607687939-ce8a6c25118c': '/img/interior-modern.jpg',
    '1560185127-6ed189bf02f4': '/img/apartment-2.jpg',
    '1600566753086-00f18fb6b3ea': '/img/duplex.jpg',
    '1600210492486-724fe5c67fb0': '/img/interior-warm.jpg',
    '1524758631624-e2822e304c36': '/img/coloc-creative.jpg',
    '1555041469-a586c61ea9bc': '/img/sofa-green.jpg',
    '1493663284031-b7e3aefcae8e': '/img/living-creative.jpg',
    '1529156069898-49953e39b3ac': '/img/students.jpg',
    '1532372320572-cda25653a26d': '/img/desk.jpg',
    '1503602642458-232111445657': '/img/armchair.jpg',
    '1594026112284-02bb6f3352fe': '/img/shelf.jpg',
    '1571175443880-49e1d25b2bc5': '/img/fridge.jpg',
    '1507473885765-e6ed057f782c': '/img/lamp.jpg',
    '1577140913823-9a7f39e2f4f0': '/img/dining.jpg',
    '1617806118233-18e1de247200': '/img/dining.jpg',
  }
  return local[id] ?? `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`
}

export const avatar = (n: number) => `/img/avatar-${n}.jpg`

export const num = (n: number) =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

export const TND = (n: number) => `${num(n)} DT`

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short' })

export interface Owner {
  name: string
  initials: string
  avatar: string
  verified: boolean
  since: string
  responseTime: string
}

export interface Listing {
  id: string
  title: string
  city: string
  district: string
  price: number
  kind: ListingKind
  rooms: number
  surface: number
  floor: string
  image: string
  images: string[]
  verified: boolean
  rating: number
  reviews: number
  available: string
  amenities: string[]
  owner: Owner
  description: string
  badge?: string
  match?: number
  status?: ListingStatus
  views?: number
  messages?: number
}

export const owners: Record<string, Owner> = {
  amel: {
    name: 'Amel Ben Salah',
    initials: 'AB',
    avatar: avatar(47),
    verified: true,
    since: '2023',
    responseTime: 'répond en ~2 h',
  },
  karim: {
    name: 'Karim Trabelsi',
    initials: 'KT',
    avatar: avatar(12),
    verified: true,
    since: '2022',
    responseTime: 'répond en ~4 h',
  },
  ines: {
    name: 'Inès Gharbi',
    initials: 'IG',
    avatar: avatar(45),
    verified: false,
    since: '2025',
    responseTime: 'répond en ~1 j',
  },
  mehdi: {
    name: 'Mehdi Bouazizi',
    initials: 'MB',
    avatar: avatar(33),
    verified: true,
    since: '2021',
    responseTime: 'répond en ~30 min',
  },
}

const baseAmenities = ['Wifi fibre', 'Meublé', 'Cuisine équipée', 'Machine à laver']

export const listings: Listing[] = [
  {
    id: 'appart-lamarsa-lumiere',
    title: 'Appartement lumineux à deux pas de la corniche',
    city: 'La Marsa',
    district: 'Corniche',
    price: 1250,
    kind: 'appartement',
    rooms: 3,
    surface: 86,
    floor: '2e étage',
    image: photo('1522708323590-d24dbb6b0267'),
    images: [
      photo('1522708323590-d24dbb6b0267'),
      photo('1560448204-e02f11c3d0e2'),
      photo('1484154218962-a197022b5858'),
      photo('1505691938895-1758d7feb511'),
    ],
    verified: true,
    rating: 4.9,
    reviews: 38,
    available: '2026-09-01',
    amenities: [...baseAmenities, 'Climatisation', 'Balcon'],
    owner: owners.amel,
    description:
      "Un trois-pièces traversant, refait à neuf en 2025. Séjour ouvert sur une cuisine américaine, deux chambres calmes côté cour, balcon filant avec vue dégagée. À 6 minutes à pied de la station TGM et 10 minutes du campus. Charges incluses, fibre installée.",
    badge: 'Coup de cœur',
    match: 94,
    views: 412,
    messages: 12,
  },
  {
    id: 'studio-ariana-campus',
    title: 'Studio meublé face au campus universitaire',
    city: 'Ariana',
    district: 'El Ghazala',
    price: 620,
    kind: 'studio',
    rooms: 1,
    surface: 32,
    floor: '1er étage',
    image: photo('1502672260266-1c1ef2d93688'),
    images: [
      photo('1502672260266-1c1ef2d93688'),
      photo('1493809842364-78817add7ffb'),
      photo('1522771739844-6a9f6d5f14af'),
    ],
    verified: true,
    rating: 4.7,
    reviews: 21,
    available: '2026-08-15',
    amenities: ['Wifi fibre', 'Meublé', 'Cuisine équipée', 'Proche campus'],
    owner: owners.karim,
    description:
      "Studio indépendant, entrée privative, kitchenette et salle d'eau. Immeuble calme avec digicode, à 3 minutes du campus et de la ligne de bus 35B. Idéal pour une première année à Tunis. Eau et wifi inclus dans le loyer.",
    badge: 'Proche campus',
    match: 88,
    views: 267,
    messages: 9,
  },
  {
    id: 'coloc-sousse-terrasse',
    title: 'Colocation à trois avec grande terrasse',
    city: 'Sousse',
    district: 'Khezama Est',
    price: 480,
    kind: 'colocation',
    rooms: 3,
    surface: 110,
    floor: '3e étage',
    image: photo('1554995207-c18c203602cb'),
    images: [
      photo('1554995207-c18c203602cb'),
      photo('1560185007-cde436f6a4d0'),
      photo('1540518614846-7eded433c457'),
    ],
    verified: true,
    rating: 4.8,
    reviews: 16,
    available: '2026-09-10',
    amenities: [...baseAmenities, 'Balcon', 'Climatisation'],
    owner: owners.mehdi,
    description:
      "Chambre privée dans un appartement partagé par deux étudiantes en médecine. Espaces communs grands et propres, terrasse de 18 m² pour les repas d'été. Ambiance studieuse, animaux acceptés après discussion. Charges partagées à parts égales.",
    badge: 'Matching 91 %',
    match: 91,
    views: 198,
    messages: 6,
  },
  {
    id: 'appart-tunis-bab-bhar',
    title: 'Deux-pièces rénové au cœur de Bab Bhar',
    city: 'Tunis',
    district: 'Bab Bhar',
    price: 890,
    kind: 'appartement',
    rooms: 2,
    surface: 64,
    floor: '4e étage',
    image: photo('1560448204-e02f11c3d0e2'),
    images: [
      photo('1560448204-e02f11c3d0e2'),
      photo('1600607687939-ce8a6c25118c'),
      photo('1560185127-6ed189bf02f4'),
    ],
    verified: true,
    rating: 4.6,
    reviews: 27,
    available: '2026-09-01',
    amenities: [...baseAmenities, 'Proche campus'],
    owner: owners.amel,
    description:
      "Appartement refait à neuf dans un immeuble haussmannien tunisois. Parquet d'origine, hauteurs sous plafond généreuses, cuisine équipée. Métro à 200 m, marché central à 5 minutes. Convient à un étudiant ou un jeune couple.",
    match: 82,
    views: 351,
    messages: 14,
  },
  {
    id: 'chambre-monastir-mer',
    title: 'Chambre meublée à 400 m de la plage',
    city: 'Monastir',
    district: 'Skanes',
    price: 390,
    kind: 'chambre',
    rooms: 1,
    surface: 18,
    floor: 'Rez-de-chaussée',
    image: photo('1522771739844-6a9f6d5f14af'),
    images: [
      photo('1522771739844-6a9f6d5f14af'),
      photo('1505691938895-1758d7feb511'),
    ],
    verified: true,
    rating: 4.5,
    reviews: 12,
    available: '2026-10-01',
    amenities: ['Wifi fibre', 'Meublé', 'Machine à laver'],
    owner: owners.ines,
    description:
      "Chambre privée dans une villa familiale, accès indépendant et salle de bain partagée avec un autre locataire. Famille présente et bienveillante, repas possible en supplément. Quartier calme, plage et faculté de médecine à 10 minutes à vélo.",
    match: 76,
    views: 143,
    messages: 4,
  },
  {
    id: 'studio-sfax-centre',
    title: 'Studio neuf en centre-ville, tout inclus',
    city: 'Sfax',
    district: 'Centre',
    price: 540,
    kind: 'studio',
    rooms: 1,
    surface: 29,
    floor: '5e étage',
    image: photo('1493809842364-78817add7ffb'),
    images: [
      photo('1493809842364-78817add7ffb'),
      photo('1600566753086-00f18fb6b3ea'),
      photo('1484154218962-a197022b5858'),
    ],
    verified: true,
    rating: 4.8,
    reviews: 19,
    available: '2026-08-01',
    amenities: ['Wifi fibre', 'Meublé', 'Cuisine équipée', 'Climatisation', 'Parking'],
    owner: owners.karim,
    description:
      "Studio dans une résidence récente avec ascenseur et parking. Entièrement meublé, literie neuve, climatisation réversible. À 8 minutes de la faculté de médecine et 5 minutes du centre commercial. Charges forfaitaires de 60 DT/mois.",
    badge: 'Nouveau',
    match: 79,
    views: 176,
    messages: 7,
  },
  {
    id: 'appart-ariana-jardin',
    title: 'Appartement familial avec jardin partagé',
    city: 'Ariana',
    district: 'Borj Louzir',
    price: 980,
    kind: 'appartement',
    rooms: 3,
    surface: 92,
    floor: 'Rez-de-chaussée',
    image: photo('1600607687939-ce8a6c25118c'),
    images: [
      photo('1600607687939-ce8a6c25118c'),
      photo('1600210492486-724fe5c67fb0'),
      photo('1493809842364-78817add7ffb'),
    ],
    verified: false,
    rating: 4.4,
    reviews: 8,
    available: '2026-09-15',
    amenities: [...baseAmenities, 'Parking', 'Balcon'],
    owner: owners.ines,
    description:
      "Trois-pièces au rez-de-chaussée d'une petite copropriété, avec accès à un jardin ombragé. Deux chambres, grand séjour, cuisine séparée. Convient à deux étudiants souhaitant partager. Places de parking disponibles.",
    match: 73,
    views: 98,
    messages: 3,
  },
  {
    id: 'coloc-tunis-lac',
    title: 'Chambre dans une colocation créative aux Berges du Lac',
    city: 'Tunis',
    district: 'Les Berges du Lac',
    price: 720,
    kind: 'colocation',
    rooms: 1,
    surface: 24,
    floor: '2e étage',
    image: photo('1493663284031-b7e3aefcae8e'),
    images: [
      photo('1493663284031-b7e3aefcae8e'),
      photo('1600210492486-724fe5c67fb0'),
      photo('1594026112284-02bb6f3352fe'),
    ],
    verified: true,
    rating: 4.9,
    reviews: 11,
    available: '2026-11-01',
    amenities: ['Wifi fibre', 'Meublé', 'Cuisine équipée', 'Machine à laver', 'Climatisation'],
    owner: owners.mehdi,
    description:
      "Chambre meublée dans un appartement de 130 m² partagé par deux jeunes actifs. Grand salon, cuisine ouverte, bureau commun. Ambiance créative et respectueuse, dîners du dimanche optionnels. Proche des écoles de commerce et du lac 1.",
    badge: 'Matching 89 %',
    match: 89,
    views: 221,
    messages: 10,
  },
]

export interface ColocProfile {
  id: string
  name: string
  age: number
  studies: string
  city: string
  budget: number
  match: number
  bio: string
  tags: string[]
  avatar: string
}

export const colocProfiles: ColocProfile[] = [
  {
    id: 'c1',
    name: 'Yasmine',
    age: 21,
    studies: 'Médecine, 3e année',
    city: 'Sousse',
    budget: 450,
    match: 94,
    bio: "Lève-tôt, cuisine beaucoup, cherche une colocation calme pour préparer les partiels.",
    tags: ['Calme', 'Non-fumeuse', 'Sans animaux'],
    avatar: avatar(44),
  },
  {
    id: 'c2',
    name: 'Adam',
    age: 23,
    studies: 'Génie logiciel, M1',
    city: 'Tunis',
    budget: 700,
    match: 88,
    bio: 'Travaille en remote, aime les plantes et les soirées jeux de société une fois par mois.',
    tags: ['Télétravail', 'Sociable', 'Végan'],
    avatar: avatar(15),
  },
  {
    id: 'c3',
    name: 'Farah',
    age: 20,
    studies: 'Architecture, 2e année',
    city: 'La Marsa',
    budget: 600,
    match: 81,
    bio: 'Beaucoup de maquettes, un peu de désordre, toujours du café. Cherche une chambre près du TGM.',
    tags: ['Créative', 'Flexible', 'Chat accepté'],
    avatar: avatar(32),
  },
]

export interface Furniture {
  id: string
  title: string
  price: number
  oldPrice?: number
  condition: 'Neuf' | 'Très bon état' | 'Bon état'
  category: string
  city: string
  image: string
  seller: string
  posted: string
}

export const furniture: Furniture[] = [
  {
    id: 'f1',
    title: 'Canapé 3 places en velours',
    price: 420,
    oldPrice: 890,
    condition: 'Très bon état',
    category: 'Salon',
    city: 'Tunis',
    image: photo('1555041469-a586c61ea9bc'),
    seller: 'Sami B.',
    posted: '2026-11-12',
  },
  {
    id: 'f2',
    title: 'Bureau en chêne massif',
    price: 180,
    condition: 'Bon état',
    category: 'Bureau',
    city: 'Ariana',
    image: photo('1532372320572-cda25653a26d'),
    seller: 'Nour H.',
    posted: '2026-11-10',
  },
  {
    id: 'f3',
    title: 'Lit simple + matelas neuf',
    price: 260,
    condition: 'Très bon état',
    category: 'Chambre',
    city: 'Sousse',
    image: photo('1522771739844-6a9f6d5f14af'),
    seller: 'Rania M.',
    posted: '2026-11-09',
  },
  {
    id: 'f4',
    title: 'Table à manger 4 personnes',
    price: 150,
    condition: 'Bon état',
    category: 'Cuisine',
    city: 'Sfax',
    image: photo('1577140913823-9a7f39e2f4f0'),
    seller: 'Walid T.',
    posted: '2026-11-08',
  },
  {
    id: 'f5',
    title: "Ensemble salon en cuir cognac",
    price: 340,
    condition: 'Très bon état',
    category: 'Salon',
    city: 'La Marsa',
    image: photo('1600210492486-724fe5c67fb0'),
    seller: 'Lina K.',
    posted: '2026-11-06',
  },
  {
    id: 'f6',
    title: 'Étagère modulable 5 niveaux',
    price: 95,
    condition: 'Bon état',
    category: 'Rangement',
    city: 'Tunis',
    image: photo('1594026112284-02bb6f3352fe'),
    seller: 'Adam R.',
    posted: '2026-11-05',
  },
  {
    id: 'f7',
    title: 'Réfrigérateur compact 120 L',
    price: 310,
    oldPrice: 540,
    condition: 'Très bon état',
    category: 'Électroménager',
    city: 'Monastir',
    image: photo('1571175443880-49e1d25b2bc5'),
    seller: 'Farah Z.',
    posted: '2026-11-04',
  },
  {
    id: 'f8',
    title: 'Lampe de bureau architecte',
    price: 45,
    condition: 'Neuf',
    category: 'Déco',
    city: 'Ariana',
    image: photo('1507473885765-e6ed057f782c'),
    seller: 'Mehdi A.',
    posted: '2026-11-02',
  },
]

export interface QuoteProvider {
  name: string
  rating: number
  reviews: number
  base: number
  perKm: number
  perM3: number
  note: string
}

export interface TransporterOffer {
  id: string
  name: string
  avatar: string
  city: string
  zones: string
  vehicle: string
  capacity: string
  baseRate: number
  rating: number
  reviews: number
  availability: string
  helperIncluded: boolean
  description: string
  phone: string
}

export interface MoveRequest {
  id: string
  studentName: string
  studentAvatar: string
  fromCity: string
  toCity: string
  date: string
  volumeDescription: string
  budget: number
  status: 'ouverte' | 'pourvue'
  notes: string
}

export const transporterOffers: TransporterOffer[] = [
  {
    id: 't1',
    name: 'Mohamed Ali K.',
    avatar: avatar(18),
    city: 'Tunis',
    zones: 'Grand Tunis & Nabeul',
    vehicle: 'Fourgonnette Peugeot Boxer',
    capacity: '10 m³',
    baseRate: 50,
    rating: 4.9,
    reviews: 42,
    availability: 'Disponible 7j/7',
    helperIncluded: true,
    description: 'Chauffeur ponctuel avec sangles et diable. Aide au chargement et déchargement des étages.',
    phone: '+216 98 123 456',
  },
  {
    id: 't2',
    name: 'Nizar B.',
    avatar: avatar(22),
    city: 'Sousse',
    zones: 'Sousse, Monastir & Mahdia',
    vehicle: 'Camionnette Isuzu 2.8',
    capacity: '14 m³',
    baseRate: 65,
    rating: 4.8,
    reviews: 28,
    availability: 'Soirs et week-ends',
    helperIncluded: true,
    description: 'Spécialisé déménagements étudiants vers les campus de Sousse et Monastir. Matériel de protection fourni.',
    phone: '+216 22 456 789',
  },
  {
    id: 't3',
    name: 'Youssef M.',
    avatar: avatar(35),
    city: 'Tunis',
    zones: 'Toute la Tunisie (Inter-villes)',
    vehicle: 'Grand utilitaire Renault Master',
    capacity: '16 m³',
    baseRate: 80,
    rating: 4.7,
    reviews: 53,
    availability: 'Tous les jours sur réservation',
    helperIncluded: false,
    description: 'Trajets longue distance Tunis-Sousse-Sfax. Tarif dégressif pour étudiants.',
    phone: '+216 55 789 012',
  },
  {
    id: 't4',
    name: 'Bilel G.',
    avatar: avatar(12),
    city: 'Sfax',
    zones: 'Sfax & Sud tunisien',
    vehicle: 'Pick-up bâché avec remorque',
    capacity: '8 m³',
    baseRate: 40,
    rating: 4.9,
    reviews: 19,
    availability: 'Disponible immédiatement',
    helperIncluded: true,
    description: 'Idéal petits transports de studios (frigo, lit, cartons). Rapide et pas cher.',
    phone: '+216 29 333 444',
  },
]

export const moveRequests: MoveRequest[] = [
  {
    id: 'r1',
    studentName: 'Sarra K.',
    studentAvatar: avatar(26),
    fromCity: 'Tunis (El Manar)',
    toCity: 'Tunis (La Marsa)',
    date: 'Samedi 22 nov.',
    volumeDescription: 'Lit 1 place, bureau, chaise et 5 cartons',
    budget: 60,
    status: 'ouverte',
    notes: 'Besoin d’aide pour descendre du 2e étage sans ascenseur.',
  },
  {
    id: 'r2',
    studentName: 'Hamza B.',
    studentAvatar: avatar(14),
    fromCity: 'Tunis (Centre)',
    toCity: 'Sousse (Sahloul)',
    date: 'Mardi 25 nov.',
    volumeDescription: 'Studio complet (lit, frigo compact, table, 8 cartons)',
    budget: 120,
    status: 'ouverte',
    notes: 'Déménagement suite à un stage à Sousse.',
  },
  {
    id: 'r3',
    studentName: 'Ines D.',
    studentAvatar: avatar(28),
    fromCity: 'Ariana (Ennasr)',
    toCity: 'Tunis (Centre Urbain)',
    date: 'Dimanche 23 nov.',
    volumeDescription: 'Machine à laver, micro-ondes, valises et cartons',
    budget: 50,
    status: 'ouverte',
    notes: 'Ascenseur disponible aux deux adresses.',
  },
  {
    id: 'r4',
    studentName: 'Karim L.',
    studentAvatar: avatar(19),
    fromCity: 'Sousse (Khezama)',
    toCity: 'Monastir (Faculté)',
    date: 'Vendredi 28 nov.',
    volumeDescription: 'Chambre étudiante (lit démonté, bureau et 4 cartons)',
    budget: 45,
    status: 'ouverte',
    notes: 'Horaire flexible en matinée.',
  },
]

export const movers: QuoteProvider[] = [
  {
    name: 'DéméNour',
    rating: 4.8,
    reviews: 126,
    base: 90,
    perKm: 2.2,
    perM3: 18,
    note: 'Deux déménageurs, camion 12 m³, assurance incluse.',
  },
  {
    name: 'MoveTn',
    rating: 4.6,
    reviews: 84,
    base: 75,
    perKm: 2.6,
    perM3: 15,
    note: 'Créneau de 3 h, emballage des fragiles en option.',
  },
  {
    name: 'Étudiant Express',
    rating: 4.7,
    reviews: 61,
    base: 60,
    perKm: 1.9,
    perM3: 20,
    note: 'Spécialisé petits volumes, idéal studio et chambre.',
  },
]

export interface Conversation {
  id: string
  name: string
  avatar: string
  listing: string
  unread: number
  lastAt: string
  messages: { id: string; from: 'me' | 'them'; text: string; at: string }[]
}

export const conversations: Conversation[] = [
  {
    id: 'm1',
    name: 'Amel Ben Salah',
    avatar: avatar(47),
    listing: 'Appartement lumineux à La Marsa',
    unread: 2,
    lastAt: '09:42',
    messages: [
      {
        id: 'a1',
        from: 'them',
        text: "Bonjour ! Oui, l'appartement est toujours disponible pour septembre.",
        at: '09:12',
      },
      {
        id: 'a2',
        from: 'me',
        text: 'Super. Est-ce que la visite est possible samedi matin ?',
        at: '09:31',
      },
      {
        id: 'a3',
        from: 'them',
        text: 'Samedi 10 h me convient. Je vous envoie l’adresse exacte ici.',
        at: '09:42',
      },
    ],
  },
  {
    id: 'm2',
    name: 'Karim Trabelsi',
    avatar: avatar(12),
    listing: 'Studio meublé face au campus',
    unread: 0,
    lastAt: 'Hier',
    messages: [
      {
        id: 'b1',
        from: 'me',
        text: 'Bonjour, le studio est-il libre au 15 août ?',
        at: 'Hier 16:02',
      },
      {
        id: 'b2',
        from: 'them',
        text: 'Oui, une visite est possible en visio ou sur place.',
        at: 'Hier 16:20',
      },
    ],
  },
  {
    id: 'm3',
    name: 'Mehdi Bouazizi',
    avatar: avatar(33),
    listing: 'Colocation avec terrasse à Sousse',
    unread: 1,
    lastAt: 'Lun.',
    messages: [
      {
        id: 'c1',
        from: 'them',
        text: 'On organise un appel avec les deux autres colocataires jeudi si ça vous dit.',
        at: 'Lun. 18:44',
      },
    ],
  },
  {
    id: 'm4',
    name: 'Support TSH',
    avatar: avatar(5),
    listing: 'Vérification de compte',
    unread: 0,
    lastAt: '12 nov.',
    messages: [
      {
        id: 'd1',
        from: 'them',
        text: 'Votre pièce d’identité a bien été vérifiée. Votre badge est actif.',
        at: '12 nov. 11:08',
      },
    ],
  },
]

export interface Contract {
  id: string
  reference: string
  listing: string
  landlord: string
  city: string
  rent: number
  charges: number
  start: string
  end: string
  status: 'Actif' | 'En signature' | 'Terminé'
  nextPayment: string
  paid: boolean
}

export const contracts: Contract[] = [
  {
    id: 'ct1',
    reference: 'TSH-2026-0184',
    listing: 'Studio meublé face au campus',
    landlord: 'Karim Trabelsi',
    city: 'Ariana',
    rent: 620,
    charges: 40,
    start: '2026-09-01',
    end: '2027-06-30',
    status: 'Actif',
    nextPayment: '2026-12-01',
    paid: true,
  },
  {
    id: 'ct2',
    reference: 'TSH-2026-0211',
    listing: 'Chambre colocation Khezama Est',
    landlord: 'Mehdi Bouazizi',
    city: 'Sousse',
    rent: 480,
    charges: 35,
    start: '2026-10-01',
    end: '2027-06-30',
    status: 'En signature',
    nextPayment: '2026-12-01',
    paid: false,
  },
  {
    id: 'ct3',
    reference: 'TSH-2025-0097',
    listing: 'Chambre meublée à Skanes',
    landlord: 'Inès Gharbi',
    city: 'Monastir',
    rent: 390,
    charges: 0,
    start: '2025-10-01',
    end: '2026-07-31',
    status: 'Terminé',
    nextPayment: '—',
    paid: true,
  },
]

export interface ModerationItem {
  id: string
  title: string
  city: string
  price: number
  submittedBy: string
  submittedAt: string
  image: string
  flags: string[]
  completeness: number
}

export const moderationQueue: ModerationItem[] = [
  {
    id: 'q1',
    title: 'Duplex 4 pièces proche du lac',
    city: 'Tunis',
    price: 1450,
    submittedBy: 'Slim Jaziri',
    submittedAt: '2026-11-16',
    image: photo('1600566753086-00f18fb6b3ea'),
    flags: ['Photos à vérifier'],
    completeness: 82,
  },
  {
    id: 'q2',
    title: 'Chambre étudiante meublée',
    city: 'Bizerte',
    price: 350,
    submittedBy: 'Nadia Ferchichi',
    submittedAt: '2026-11-16',
    image: photo('1522771739844-6a9f6d5f14af'),
    flags: ['Prix sous le marché', 'Compte récent'],
    completeness: 64,
  },
  {
    id: 'q3',
    title: 'Appartement 2 chambres, vue mer',
    city: 'Sousse',
    price: 1100,
    submittedBy: 'Hatem Riahi',
    submittedAt: '2026-11-15',
    image: photo('1560185007-cde436f6a4d0'),
    flags: [],
    completeness: 96,
  },
]

export const adminUsers = [
  {
    id: 'u1',
    name: 'Amel Ben Salah',
    email: 'amel.bensalah@tsh.tn',
    role: 'Propriétaire',
    verified: true,
    status: 'Actif',
    joined: '2023-04-12',
    listings: 6,
  },
  {
    id: 'u2',
    name: 'Yasmine Chaabane',
    email: 'yasmine.c@tsh.tn',
    role: 'Étudiante',
    verified: true,
    status: 'Actif',
    joined: '2025-09-02',
    listings: 0,
  },
  {
    id: 'u3',
    name: 'Nadia Ferchichi',
    email: 'nadia.f@example.tn',
    role: 'Propriétaire',
    verified: false,
    status: 'En attente',
    joined: '2026-11-14',
    listings: 1,
  },
  {
    id: 'u4',
    name: 'Slim Jaziri',
    email: 'slim.j@example.tn',
    role: 'Propriétaire',
    verified: false,
    status: 'En attente',
    joined: '2026-10-01',
    listings: 4,
  },
]

export const testimonials = [
  {
    quote:
      "J'ai trouvé mon studio en quatre jours, sans visiter cinq appartements pourris. Le badge vérifié change vraiment la donne.",
    name: 'Yasmine C.',
    detail: 'Étudiante en médecine, Sousse',
    avatar: avatar(44),
  },
  {
    quote:
      "La colocation m'a mise en contact avec deux personnes qui avaient le même rythme que moi. On a signé le bail ensemble en ligne.",
    name: 'Farah Z.',
    detail: 'Architecture, La Marsa',
    avatar: avatar(32),
  },
  {
    quote:
      "En tant que propriétaire, je reçois des demandes sérieuses et je peux suivre les paiements au même endroit. Je ne reviens pas en arrière.",
    name: 'Amel B.',
    detail: 'Propriétaire, Tunis',
    avatar: avatar(47),
  },
]

export const faq = [
  {
    q: 'Comment une annonce est-elle vérifiée ?',
    a: "Chaque annonce passe par une vérification en trois temps : identité du propriétaire, justificatif de propriété ou mandat, puis contrôle des photos et du prix par rapport au marché local. Le badge n'apparaît qu'une fois les trois étapes validées.",
  },
  {
    q: 'Puis-je visiter avant de payer quoi que ce soit ?',
    a: "Oui. TSH ne demande jamais de frais de visite ni d'acompte avant une visite. Si un hôte demande un paiement anticipé hors plateforme, vous pouvez le signaler en un clic depuis la conversation.",
  },
  {
    q: 'Comment fonctionne le matching de colocation ?',
    a: "Vous remplissez un profil de 12 questions : rythme de vie, propreté, budget, invités, animaux. Le service Colocation calcule un score de compatibilité et vous montre uniquement les profils et annonces au-dessus de 70 %.",
  },
  {
    q: 'Le paiement du loyer est-il sécurisé ?',
    a: "Le service Contract génère un bail numérique et un échéancier. Les paiements sont tracés, les reçus sont archivés, et chaque échéance en retard déclenche une notification aux deux parties.",
  },
  {
    q: 'Comment mon profil est-il vérifié ?',
    a: "Chaque compte est rattaché à une identité Keycloak unique. Les documents fournis lors de l’inscription sont contrôlés par l’équipe TSH, puis votre profil affiche un badge de vérification.",
  },
]

export const stats = [
  { value: '4 200+', label: 'logements vérifiés' },
  { value: '12', label: 'villes couvertes' },
  { value: '9 800', label: 'étudiants inscrits' },
  { value: '96 %', label: 'visites honorées' },
]
