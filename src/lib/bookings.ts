import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type BookingRecord = {
  id: string;
  date: string;
  time: string;
  slotKey: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  industry?: string;
  goals?: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), ".data");
const filePath = path.join(dataDir, "bookings.json");

const slotTimes = Array.from({ length: 20 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
});

async function readBookings() {
  try {
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as BookingRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeBookings(bookings: BookingRecord[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(filePath, JSON.stringify(bookings, null, 2), "utf-8");
}

export function isDateFormat(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isTimeFormat(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

export function buildSlotKey(date: string, time: string) {
  return `${date}T${time}`;
}

export function getAvailableTimesForDate(date: string, bookings: BookingRecord[]) {
  const taken = new Set(bookings.filter((booking) => booking.date === date).map((booking) => booking.time));
  return slotTimes.filter((time) => !taken.has(time));
}

export async function getAvailability(date: string) {
  if (!isDateFormat(date)) {
    return [];
  }

  const bookings = await readBookings();
  return getAvailableTimesForDate(date, bookings);
}

type CreateBookingInput = {
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  industry?: string;
  goals?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s-]{7,22}$/;

export async function createBooking(input: CreateBookingInput) {
  if (!isDateFormat(input.date)) {
    throw new Error("Invalid booking date format.");
  }

  if (!isTimeFormat(input.time) || !slotTimes.includes(input.time)) {
    throw new Error("Invalid booking time.");
  }

  if (!input.name.trim() || !input.company.trim()) {
    throw new Error("Name and company are required.");
  }

  if (!emailPattern.test(input.email)) {
    throw new Error("Valid email is required.");
  }

  if (!phonePattern.test(input.phone)) {
    throw new Error("Valid phone is required.");
  }

  if (input.website && !/^https?:\/\//.test(input.website)) {
    throw new Error("Website must start with http:// or https://");
  }

  if (input.goals && input.goals.length > 1200) {
    throw new Error("Goals should be 1200 characters or fewer.");
  }

  const bookings = await readBookings();
  const slotKey = buildSlotKey(input.date, input.time);

  if (bookings.some((booking) => booking.slotKey === slotKey)) {
    throw new Error("This slot is already booked.");
  }

  const record: BookingRecord = {
    id: crypto.randomUUID(),
    date: input.date,
    time: input.time,
    slotKey,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    company: input.company.trim(),
    website: input.website?.trim(),
    industry: input.industry?.trim(),
    goals: input.goals?.trim(),
    createdAt: new Date().toISOString(),
  };

  bookings.push(record);
  await writeBookings(bookings);

  console.info("[booking] created", {
    id: record.id,
    slotKey: record.slotKey,
    email: record.email,
  });

  return record;
}

export async function listBookings() {
  const bookings = await readBookings();
  return bookings.sort((a, b) => a.slotKey.localeCompare(b.slotKey));
}

export function toCsv(bookings: BookingRecord[]) {
  const headers = ["id", "date", "time", "name", "email", "phone", "company", "website", "industry", "goals", "createdAt"];
  const rows = bookings.map((booking) =>
    [
      booking.id,
      booking.date,
      booking.time,
      booking.name,
      booking.email,
      booking.phone,
      booking.company,
      booking.website || "",
      booking.industry || "",
      booking.goals || "",
      booking.createdAt,
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

export function getUpcomingDates(days = 14) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: days }, (_, index) => {
    const current = new Date(today);
    current.setDate(today.getDate() + index);
    return current.toISOString().slice(0, 10);
  });
}
