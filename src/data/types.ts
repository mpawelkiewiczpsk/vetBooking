// src/data/types.ts – domain models of the app
export type Species = "dog" | "cat" | "rabbit" | "bird" | "reptile";

export type Specialty =
  "General practice" | "Surgery" | "Dermatology" | "Dentistry" | "Cardiology" | "Exotic animals";

export type Vet = {
  id: string;
  name: string;
  specialty: Specialty;
  species: Species[]; // which animals the vet treats
  rating: number; // 0–5
  reviews: number;
  photoUrl: string;
  coverUrl: string;
  bio: string;
  experienceYears: number;
  clinicId: string;
  languages: string[];
  isNew: boolean; // recently joined the team
};

export type Clinic = {
  id: string;
  name: string;
  address: string;
  rooms: number;
  isEmergency: boolean; // open 24/7
};

export type Service = {
  id: string;
  name: string;
  durationMin: 30 | 60;
  price: number; // USD
};

// Working day of one vet in one clinic: list of 30-minute slots
export type Schedule = {
  id: string;
  vetId: string;
  clinicId: string;
  date: string; // ISO, start of the day
  slots: string[]; // ISO start times, e.g. "2026-10-22T09:00:00.000Z"
  takenSlots: string[];
};
