import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const PROJECT_ID = "demo-synclifters";
const OWNER_UID = "owner-uid";
const OTHER_UID = "other-uid";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(resolve(__dirname, "../firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

function ownerDb() {
  return testEnv.authenticatedContext(OWNER_UID).firestore();
}

function otherDb() {
  return testEnv.authenticatedContext(OTHER_UID).firestore();
}

function unauthDb() {
  return testEnv.unauthenticatedContext().firestore();
}

describe("firestore.rules", () => {
  it("allows owner to create and read their user profile", async () => {
    const db = ownerDb();
    await assertSucceeds(
      db.doc(`users/${OWNER_UID}`).set({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        createdAt: Date.now(),
      }),
    );
    await assertSucceeds(db.doc(`users/${OWNER_UID}`).get());
  });

  it("denies other users reading a profile", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`users/${OWNER_UID}`).set({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        createdAt: Date.now(),
      });
    });

    await assertFails(otherDb().doc(`users/${OWNER_UID}`).get());
    await assertFails(unauthDb().doc(`users/${OWNER_UID}`).get());
  });

  it("allows owner to create a program and denies other uid", async () => {
    await assertSucceeds(
      ownerDb().doc(`users/${OWNER_UID}/programs/p1`).set({
        name: "Push Pull",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        days: [],
      }),
    );
    await assertFails(
      otherDb().doc(`users/${OWNER_UID}/programs/p1`).get(),
    );
  });

  it("allows owner to create a session and denies other uid", async () => {
    await assertSucceeds(
      ownerDb().doc(`users/${OWNER_UID}/sessions/s1`).set({
        programName: "Push Pull",
        dayName: "Day 1",
        performedAt: Date.now(),
        date: "2026-09-12",
        status: "completed",
        exerciseIds: ["catalog:bench"],
        exercises: [],
      }),
    );
    await assertFails(otherDb().doc(`users/${OWNER_UID}/sessions/s1`).get());
  });

  it("allows bodyMetrics create and denies update (immutable)", async () => {
    const ref = ownerDb().doc(`users/${OWNER_UID}/bodyMetrics/m1`);
    await assertSucceeds(
      ref.set({
        type: "weight",
        value: 70,
        unit: "kg",
        recordedAt: Date.now(),
        source: "profile",
      }),
    );
    await assertFails(ref.update({ value: 71 }));
  });

  it("allows support ticket create for self and denies update/delete", async () => {
    const ref = ownerDb().doc("supportTickets/t1");
    await assertSucceeds(
      ref.set({
        ownerId: OWNER_UID,
        email: "jane@example.com",
        description: "Help",
        createdAt: Date.now(),
        status: "open",
      }),
    );
    await assertFails(ref.update({ status: "closed" }));
    await assertFails(ref.delete());
  });

  it("denies support ticket create with mismatched ownerId", async () => {
    await assertFails(
      ownerDb().doc("supportTickets/t2").set({
        ownerId: OTHER_UID,
        email: "jane@example.com",
        description: "Help",
        createdAt: Date.now(),
        status: "open",
      }),
    );
  });
});
