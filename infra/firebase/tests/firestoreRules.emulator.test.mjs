import assert from 'node:assert/strict';

const PROJECT_ID = 'jrpm-dev';
const AUTH_HOST =
  process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '127.0.0.1:9105';
const FIRESTORE_HOST =
  process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:9181';
const FUNCTIONS_HOST =
  process.env.FUNCTIONS_EMULATOR_HOST ?? '127.0.0.1:5011';

async function signUp(emailSuffix) {
  const url = `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `rules-test-${emailSuffix}-${Date.now()}@example.com`,
      password: 'Password123!',
      returnSecureToken: true,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`signUp failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return { idToken: data.idToken, userId: data.localId };
}

async function callable(path, idToken, payload) {
  const url = `http://${FUNCTIONS_HOST}/${PROJECT_ID}/us-central1/${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ data: payload }),
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON from ${path}: ${text}`);
  }

  if (!response.ok || json.error) {
    throw new Error(
      `Callable ${path} failed: ${response.status} ${JSON.stringify(json)}`
    );
  }

  return json.result;
}

async function readEntry(entryId, token) {
  const url = `http://${FIRESTORE_HOST}/v1/projects/${PROJECT_ID}/databases/(default)/documents/timeEntries/${entryId}`;
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function run() {
  const owner = await signUp('owner');
  const other = await signUp('other');

  const startResult = await callable('startTimeEntry', owner.idToken, {
    userId: owner.userId,
    notes: 'Security rule test',
  });

  const ownerRead = await readEntry(startResult.id, owner.idToken);
  assert.equal(ownerRead.status, 200, 'Owner should read their entry');

  const otherRead = await readEntry(startResult.id, other.idToken);
  assert.equal(
    otherRead.status,
    403,
    `Other user should NOT read entry, got ${otherRead.status}`
  );

  console.log(
    JSON.stringify(
      {
        entryId: startResult.id,
        ownerReadStatus: ownerRead.status,
        otherReadStatus: otherRead.status,
      },
      null,
      2
    )
  );
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
