// src/data/mockData.ts – sample data (from L06 it comes from the API)
import type { Clinic, Schedule, Service, Specialty, Species, Vet } from "./types";

// Images from picsum.photos – free photos generated from a "seed"
const photo = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;
const cover = (seed: string) => `https://picsum.photos/seed/${seed}-cover/1200/675`;

export const SPECIALTIES: Specialty[] = [
  "General practice",
  "Surgery",
  "Dermatology",
  "Dentistry",
  "Cardiology",
  "Exotic animals",
];

export const SPECIES: Species[] = ["dog", "cat", "rabbit", "bird", "reptile"];

export const CLINICS: Clinic[] = [
  { id: "c1", name: "PawCare Downtown", address: "12 Main Street", rooms: 4, isEmergency: false },
  { id: "c2", name: "PawCare Riverside", address: "48 River Road", rooms: 3, isEmergency: false },
  { id: "c3", name: "PawCare 24/7", address: "5 Station Square", rooms: 6, isEmergency: true },
];

export const SERVICES: Service[] = [
  { id: "checkup", name: "Check-up", durationMin: 30, price: 45 },
  { id: "vaccination", name: "Vaccination", durationMin: 30, price: 35 },
  { id: "dental", name: "Dental cleaning", durationMin: 60, price: 120 },
  { id: "skin", name: "Skin consultation", durationMin: 30, price: 60 },
  { id: "surgery", name: "Surgery consultation", durationMin: 30, price: 80 },
  { id: "microchip", name: "Microchipping", durationMin: 30, price: 40 },
];

export const VETS: Vet[] = [
  {
    id: "v1",
    name: "Dr. Emma Collins",
    specialty: "General practice",
    species: ["dog", "cat", "rabbit"],
    rating: 4.9,
    reviews: 312,
    photoUrl: photo("emma"),
    coverUrl: cover("emma"),
    bio: "Family vet with a soft spot for nervous pets. Emma believes a calm visit is half of the treatment and always has treats in her pocket.",
    experienceYears: 12,
    clinicId: "c1",
    languages: ["English", "Spanish"],
    isNew: false,
  },
  {
    id: "v2",
    name: "Dr. Liam Novak",
    specialty: "Surgery",
    species: ["dog", "cat"],
    rating: 4.8,
    reviews: 198,
    photoUrl: photo("liam"),
    coverUrl: cover("liam"),
    bio: "Orthopedic and soft-tissue surgeon. Liam explains every procedure step by step, so owners know exactly what to expect.",
    experienceYears: 15,
    clinicId: "c3",
    languages: ["English", "Polish"],
    isNew: false,
  },
  {
    id: "v3",
    name: "Dr. Aisha Rahman",
    specialty: "Dermatology",
    species: ["dog", "cat"],
    rating: 4.7,
    reviews: 141,
    photoUrl: photo("aisha"),
    coverUrl: cover("aisha"),
    bio: "Allergies, itching and skin infections are her daily bread. Aisha combines modern diagnostics with practical diet advice.",
    experienceYears: 8,
    clinicId: "c2",
    languages: ["English", "Arabic"],
    isNew: true,
  },
  {
    id: "v4",
    name: "Dr. Marco Rossi",
    specialty: "Dentistry",
    species: ["dog", "cat", "rabbit"],
    rating: 4.6,
    reviews: 87,
    photoUrl: photo("marco"),
    coverUrl: cover("marco"),
    bio: "Bad breath is not normal! Marco performs dental cleanings and extractions under safe, monitored anesthesia.",
    experienceYears: 10,
    clinicId: "c1",
    languages: ["English", "Italian"],
    isNew: false,
  },
  {
    id: "v5",
    name: "Dr. Hannah Weber",
    specialty: "Cardiology",
    species: ["dog", "cat"],
    rating: 4.9,
    reviews: 64,
    photoUrl: photo("hannah"),
    coverUrl: cover("hannah"),
    bio: "Heart murmurs, ECG and echocardiography. Hannah specializes in senior pets and breeds prone to heart disease.",
    experienceYears: 18,
    clinicId: "c3",
    languages: ["English", "German"],
    isNew: false,
  },
  {
    id: "v6",
    name: "Dr. Kenji Sato",
    specialty: "Exotic animals",
    species: ["rabbit", "bird", "reptile"],
    rating: 4.8,
    reviews: 103,
    photoUrl: photo("kenji"),
    coverUrl: cover("kenji"),
    bio: "Parrots, geckos, tortoises and rabbits. Kenji knows the special needs of exotic pets – from lighting to diet.",
    experienceYears: 9,
    clinicId: "c2",
    languages: ["English", "Japanese"],
    isNew: true,
  },
  {
    id: "v7",
    name: "Dr. Olivia Brown",
    specialty: "General practice",
    species: ["dog", "cat"],
    rating: 4.5,
    reviews: 229,
    photoUrl: photo("olivia"),
    coverUrl: cover("olivia"),
    bio: 'Vaccinations, puppy and kitten care, preventive check-ups. Olivia runs our free "first visit" program for adopted pets.',
    experienceYears: 6,
    clinicId: "c2",
    languages: ["English"],
    isNew: false,
  },
  {
    id: "v8",
    name: "Dr. Mateo García",
    specialty: "Surgery",
    species: ["dog", "cat", "rabbit"],
    rating: 4.7,
    reviews: 56,
    photoUrl: photo("mateo"),
    coverUrl: cover("mateo"),
    bio: "Emergency and trauma surgery at our 24/7 clinic. Calm under pressure – and great with worried owners.",
    experienceYears: 7,
    clinicId: "c3",
    languages: ["English", "Spanish"],
    isNew: true,
  },
];

// Schedules are generated relative to "today", so the data is always up to date
function slotsFor(dayOffset: number, fromHour: number, toHour: number): string[] {
  const slots: string[] = [];
  for (let h = fromHour; h < toHour; h++) {
    for (const m of [0, 30]) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      d.setHours(h, m, 0, 0);
      slots.push(d.toISOString());
    }
  }
  return slots;
}

function dayStart(dayOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// Take every n-th slot as already booked – deterministic "random" data
const takeEvery = (slots: string[], n: number, offset = 0) =>
  slots.filter((_, i) => (i + offset) % n === 0);

export const SCHEDULES: Schedule[] = VETS.flatMap((vet, vetIndex) =>
  [0, 1, 2].map((day) => {
    const slots = slotsFor(day, vetIndex % 2 === 0 ? 8 : 12, vetIndex % 2 === 0 ? 14 : 18);
    return {
      id: `sch-${vet.id}-${day}`,
      vetId: vet.id,
      clinicId: vet.clinicId,
      date: dayStart(day),
      slots,
      takenSlots: takeEvery(slots, 3 + (vetIndex % 3), day),
    };
  }),
);

export const findVet = (id: string) => VETS.find((v) => v.id === id);
export const findClinic = (id: string) => CLINICS.find((c) => c.id === id);
export const findService = (id: string) => SERVICES.find((s) => s.id === id);
