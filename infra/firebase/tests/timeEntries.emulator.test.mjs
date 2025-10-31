import assert from 'node:assert/strict';

const PROJECT_ID = 'jrpm-dev';
const AUTH_HOST =
  process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '127.0.0.1:9105';
const FUNCTIONS_HOST =
  process.env.FUNCTIONS_EMULATOR_HOST ?? '127.0.0.1:5011';

async function signUpTestUser() {
  const url = `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `agent-test-${Date.now()}@example.com`,
      password: 'Password123!',
      returnSecureToken: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`signUp failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  assert.ok(data.idToken, 'Expected idToken in signUp response');
  assert.ok(data.localId, 'Expected localId in signUp response');
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

async function run() {
  const { idToken, userId } = await signUpTestUser();

  const startResult = await callable('startTimeEntry', idToken, {
    userId,
    projectId: 'proj-test',
    taskId: 'task-alpha',
    notes: 'Initial timer run',
  });

  assert.ok(startResult?.id, 'startTimeEntry should return an id');
  assert.equal(startResult.userId, userId);
  assert.equal(startResult.projectId, 'proj-test');
  assert.equal(startResult.taskId, 'task-alpha');

  await new Promise(resolve => setTimeout(resolve, 500));

  const stopResult = await callable('stopTimeEntry', idToken, {
    entryId: startResult.id,
  });

  assert.equal(stopResult.id, startResult.id);
  assert.equal(stopResult.userId, userId);
  assert.ok(
    typeof stopResult.duration === 'number' && stopResult.duration >= 0,
    'duration should be a non-negative number'
  );

  const listResult = await callable('getTimeEntries', idToken, {
    limit: 5,
  });

  assert.ok(Array.isArray(listResult.entries), 'entries should be an array');
  assert.ok(
    listResult.entries.some(entry => entry.id === startResult.id),
    'entries should include the started entry'
  );

  console.log(
    JSON.stringify(
      {
        start: startResult,
        stop: stopResult,
        listCount: listResult.entries.length,
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
