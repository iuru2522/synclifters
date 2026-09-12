import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(fileName) {
  const filePath = resolve(root, fileName);
  if (!existsSync(filePath)) {
    return;
  }

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function catalogExerciseId(name) {
  return `catalog:${name.trim().toLowerCase().replace(/\s+/g, "-")}`;
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const catalog = JSON.parse(
  readFileSync(resolve(root, "src/features/workout/exercise-catalog.json"), "utf8"),
);

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const email = process.env.FIREBASE_SEED_EMAIL?.trim();
const password = process.env.FIREBASE_SEED_PASSWORD?.trim();

for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value?.trim()) {
    console.error(`Missing ${key} in .env`);
    process.exit(1);
  }
}

if (!email || !password) {
  console.error(
    "Set FIREBASE_SEED_EMAIL and FIREBASE_SEED_PASSWORD in .env (any signed-in user) to seed catalogExercises.",
  );
  process.exit(1);
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const { user } = await signInWithEmailAndPassword(auth, email, password);
console.log(`Signed in as ${user.email ?? user.uid}`);

let written = 0;
for (const item of catalog) {
  const name = String(item.name ?? "").trim();
  const muscleGroup = String(item.muscleGroup ?? "").trim();
  if (!name || !muscleGroup) {
    continue;
  }

  const id = catalogExerciseId(name);
  await setDoc(doc(db, "catalogExercises", id), {
    id,
    name,
    muscleGroup,
  });
  written += 1;
  console.log(`Upserted ${id}`);
}

console.log(`Seeded ${written} catalog exercises.`);
process.exit(0);
