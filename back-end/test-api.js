// test-api.js
const BASE_URL = process.env.API_URL || "http://localhost:3000";

// ألوان للتيرمنال
const c = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

let passed = 0;
let failed = 0;
const createdIds = { movies: [], actors: [], relations: [] };

// ─── helpers ─────────────────────────────────────────────
async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {}
  return { status: res.status, data };
}

function assert(name, condition, extra = "") {
  if (condition) {
    passed++;
    console.log(`  ${c.green}✓${c.reset} ${name} ${c.gray}${extra}${c.reset}`);
  } else {
    failed++;
    console.log(`  ${c.red}✗${c.reset} ${name} ${c.red}${extra}${c.reset}`);
  }
}

function section(title) {
  console.log(`\n${c.cyan}${c.bold}▶ ${title}${c.reset}`);
}

// ─── MOVIES ──────────────────────────────────────────────
async function testMoviesCRUD() {
  section("MOVIES — CRUD");

  // 1. Create
  const create = await request("POST", "/movies", {
    movieTitle: "Test Movie",
    movieReleaseDate: "2020-01-01",
    movieCategories: ["Action", "Drama"],
    movieRating: 8.5,
    movieDirector: "Test Director",
  });
  assert("POST /movies → 201", create.status === 201, `got ${create.status}`);
  assert("POST /movies returns _id", !!create.data?.data?._id);
  const movieId = create.data?.data?._id;
  if (movieId) createdIds.movies.push(movieId);

  // 2. Get all
  const getAll = await request("GET", "/movies");
  assert("GET /movies → 200", getAll.status === 200, `got ${getAll.status}`);
  assert("GET /movies returns array", Array.isArray(getAll.data?.data));

  // 3. Get by id
  if (movieId) {
    const getOne = await request("GET", `/movies/${movieId}`);
    assert(
      "GET /movies/:id → 200",
      getOne.status === 200,
      `got ${getOne.status}`,
    );
    assert(
      "GET /movies/:id returns correct title",
      getOne.data?.data?.movieTitle === "Test Movie",
    );
    assert(
      "GET /movies/:id has categories array",
      Array.isArray(getOne.data?.data?.movieCategories),
    );
  }

  // 4. Update
  if (movieId) {
    const update = await request("PUT", `/movies/${movieId}`, {
      movieRating: 9.0,
    });
    assert(
      "PUT /movies/:id → 200",
      update.status === 200,
      `got ${update.status}`,
    );
    assert("PUT updated rating to 9.0", update.data?.data?.movieRating === 9.0);
  }

  // 5. Invalid create (missing required)
  const badCreate = await request("POST", "/movies", { movieTitle: "" });
  assert("POST /movies (invalid) → 4xx/5xx", badCreate.status >= 400);

  // 6. 404 for non-existing
  const notFound = await request("GET", "/movies/000000000000000000000000");
  assert(
    "GET /movies/:badId → 404",
    notFound.status === 404,
    `got ${notFound.status}`,
  );
}

// ─── ACTORS ──────────────────────────────────────────────
async function testActorsCRUD() {
  section("ACTORS — CRUD");

  // Create 2 actors for later use
  const a1 = await request("POST", "/actors", {
    actorName: "Keanu Reeves",
    actorNationality: "Canadian",
    actorBirthDate: "1964-09-02",
  });
  assert("POST /actors → 201", a1.status === 201, `got ${a1.status}`);
  if (a1.data?.data?._id) createdIds.actors.push(a1.data.data._id);

  const a2 = await request("POST", "/actors", {
    actorName: "Laurence Fishburne",
    actorNationality: "American",
    actorBirthDate: "1961-07-30",
  });
  assert("POST /actors (2nd) → 201", a2.status === 201);
  if (a2.data?.data?._id) createdIds.actors.push(a2.data.data._id);

  // Get all
  const getAll = await request("GET", "/actors");
  assert("GET /actors → 200", getAll.status === 200);
  assert("GET /actors returns array", Array.isArray(getAll.data?.data));

  // Get by id
  const actorId = a1.data?.data?._id;
  if (actorId) {
    const getOne = await request("GET", `/actors/${actorId}`);
    assert("GET /actors/:id → 200", getOne.status === 200);
    assert(
      "GET /actors/:id returns correct name",
      getOne.data?.data?.actorName === "Keanu Reeves",
    );
  }

  // Update
  if (actorId) {
    const update = await request("PUT", `/actors/${actorId}`, {
      actorNationality: "Canadian-American",
    });
    assert("PUT /actors/:id → 200", update.status === 200);
    assert(
      "PUT updated nationality",
      update.data?.data?.actorNationality === "Canadian-American",
    );
  }

  // Invalid create (missing required)
  const badCreate = await request("POST", "/actors", { actorName: "" });
  assert("POST /actors (invalid) → 4xx/5xx", badCreate.status >= 400);

  // 404
  const notFound = await request("GET", "/actors/000000000000000000000000");
  assert("GET /actors/:badId → 404", notFound.status === 404);
}

// ─── ROLE ACTOR ──────────────────────────────────────────
async function testRoleActor() {
  section("ROLE ACTOR — Many-to-Many");

  if (createdIds.movies.length === 0 || createdIds.actors.length < 2) {
    console.log(
      `  ${c.yellow}⚠ skipping — need 1 movie and 2 actors${c.reset}`,
    );
    return;
  }

  const [movieId] = createdIds.movies;
  const [actor1, actor2] = createdIds.actors;

  // 1. Add actor to movie
  const r1 = await request("POST", "/role-actor", {
    movieId,
    actorId: actor1,
    role: "Neo",
  });
  assert("POST /role-actor (Neo) → 201", r1.status === 201, `got ${r1.status}`);
  if (r1.data?.data?._id) createdIds.relations.push(r1.data.data._id);

  const r2 = await request("POST", "/role-actor", {
    movieId,
    actorId: actor2,
    role: "Morpheus",
  });
  assert("POST /role-actor (Morpheus) → 201", r2.status === 201);
  if (r2.data?.data?._id) createdIds.relations.push(r2.data.data._id);

  // 2. Duplicate (should fail due to unique index)
  const dup = await request("POST", "/role-actor", {
    movieId,
    actorId: actor1,
    role: "Duplicate",
  });
  assert(
    "POST /role-actor (duplicate) → 4xx/5xx",
    dup.status >= 400,
    `got ${dup.status}`,
  );

  // 3. Get cast by movie
  const cast = await request("GET", `/role-actor/movie/${movieId}`);
  assert("GET /role-actor/movie/:id → 200", cast.status === 200);
  assert(
    "Cast has 2 actors",
    cast.data?.data?.length === 2,
    `got ${cast.data?.data?.length}`,
  );
  assert(
    "Cast includes role 'Neo'",
    cast.data?.data?.some((r) => r.role === "Neo"),
  );
  assert(
    "Cast populates actorName",
    cast.data?.data?.some((r) => r.actorId?.actorName === "Keanu Reeves"),
  );
  assert(
    "Cast populates actorNationality",
    cast.data?.data?.some(
      (r) => r.actorId?.actorNationality === "Canadian-American",
    ),
  );

  // 4. Get filmography by actor
  const films = await request("GET", `/role-actor/actor/${actor1}`);
  assert("GET /role-actor/actor/:id → 200", films.status === 200);
  assert("Filmography has 1 movie", films.data?.data?.length === 1);
  assert(
    "Filmography populates movieTitle",
    films.data?.data?.[0]?.movieId?.movieTitle === "Test Movie",
  );

  // 5. Update role
  const relationId = createdIds.relations[0];
  const update = await request("PUT", `/role-actor/${relationId}`, {
    role: "Thomas Anderson",
  });
  assert("PUT /role-actor/:id → 200", update.status === 200);
  assert("Role updated", update.data?.data?.role === "Thomas Anderson");

  // 6. Remove actor from movie
  const del = await request("DELETE", `/role-actor/${movieId}/${actor2}`);
  assert("DELETE /role-actor/:movieId/:actorId → 200", del.status === 200);

  // verify
  const castAfter = await request("GET", `/role-actor/movie/${movieId}`);
  assert("Cast after delete = 1", castAfter.data?.data?.length === 1);

  // 7. 404 on deleting non-existing relation
  const delBad = await request(
    "DELETE",
    `/role-actor/${movieId}/000000000000000000000000`,
  );
  assert("DELETE non-existing relation → 404", delBad.status === 404);
}

// ─── CLEANUP ─────────────────────────────────────────────
async function cleanup() {
  section("CLEANUP");

  // Delete all relations first (foreign references)
  for (const movieId of createdIds.movies) {
    for (const actorId of createdIds.actors) {
      await request("DELETE", `/role-actor/${movieId}/${actorId}`).catch(
        () => null,
      );
    }
  }

  // Delete movies
  for (const id of createdIds.movies) {
    const r = await request("DELETE", `/movies/${id}`);
    assert(`DELETE /movies/${id.slice(-6)} → 200`, r.status === 200);
  }

  // Delete actors
  for (const id of createdIds.actors) {
    const r = await request("DELETE", `/actors/${id}`);
    assert(`DELETE /actors/${id.slice(-6)} → 200`, r.status === 200);
  }
}

// ─── RUNNER ──────────────────────────────────────────────
async function run() {
  console.log(`${c.bold}${c.yellow}🧪 API Test Suite${c.reset}`);
  console.log(`${c.gray}Target: ${BASE_URL}${c.reset}`);

  try {
    // sanity: server reachable?
    const ping = await request("GET", "/movies").catch(() => null);
    if (!ping) {
      console.log(`\n${c.red}✗ Server not reachable at ${BASE_URL}${c.reset}`);
      console.log(
        `${c.gray}Make sure your backend is running (nodemon server.js)${c.reset}`,
      );
      process.exit(1);
    }

    await testMoviesCRUD();
    await testActorsCRUD();
    await testRoleActor();
  } catch (err) {
    console.error(`\n${c.red}💥 Test crashed:${c.reset}`, err.message);
    failed++;
  } finally {
    await cleanup().catch((e) =>
      console.log(`${c.yellow}⚠ cleanup warning: ${e.message}${c.reset}`),
    );

    console.log(`\n${c.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}`);
    console.log(
      `${c.bold}Results:${c.reset} ${c.green}${passed} passed${c.reset} · ${
        failed > 0 ? c.red : c.gray
      }${failed} failed${c.reset}`,
    );
    process.exit(failed > 0 ? 1 : 0);
  }
}

run();
