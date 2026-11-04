import "dotenv/config";
import connectDB from "./config/mongodb.js";
import Movie from "./models/movieModel.js";
import Actor from "./models/actorModel.js";
import RoleActor from "./models/roleActorModel.js";

// ─── بيانات لتوليد الأفلام ──────────────────────────────────────────
const movieTitles = [
  "Inception",
  "The Dark Knight",
  "Interstellar",
  "Pulp Fiction",
  "The Matrix",
  "Fight Club",
  "Forrest Gump",
  "Gladiator",
  "Titanic",
  "Avatar",
  "The Godfather",
  "The Shawshank Redemption",
  "Jurassic Park",
  "Terminator 2",
  "The Lion King",
  "Back to the Future",
  "Alien",
  "Die Hard",
  "The Silence of the Lambs",
  "Se7en",
  "The Usual Suspects",
  "Goodfellas",
  "Saving Private Ryan",
  "The Green Mile",
  "Oppenheimer",
];

const directors = [
  "Christopher Nolan",
  "Quentin Tarantino",
  "Steven Spielberg",
  "James Cameron",
  "Martin Scorsese",
  "David Fincher",
  "Ridley Scott",
  "Frank Darabont",
  "Peter Jackson",
  "Greta Gerwig",
];

const categories = [
  "Action",
  "Drama",
  "Sci-Fi",
  "Thriller",
  "Crime",
  "Adventure",
  "Comedy",
  "Fantasy",
  "Mystery",
];

// ─── بيانات لتوليد الممثلين ─────────────────────────────────────────
const firstNames = [
  "Leonardo",
  "Christian",
  "Matthew",
  "John",
  "Keanu",
  "Brad",
  "Tom",
  "Robert",
  "Al",
  "Morgan",
  "Scarlett",
  "Natalie",
  "Emma",
  "Jennifer",
  "Anne",
  "Kate",
  "Meryl",
  "Charlize",
  "Cate",
  "Sandra",
  "Denzel",
  "Russell",
  "Mel",
  "Bruce",
  "Harrison",
  "Samuel",
  "Kevin",
  "Jack",
  "Matt",
  "Ben",
];

const lastNames = [
  "DiCaprio",
  "Bale",
  "McConaughey",
  "Travolta",
  "Reeves",
  "Pitt",
  "Hanks",
  "De Niro",
  "Pacino",
  "Freeman",
  "Johansson",
  "Portman",
  "Stone",
  "Lawrence",
  "Hathaway",
  "Winslet",
  "Streep",
  "Theron",
  "Blanchett",
  "Bullock",
  "Washington",
  "Crowe",
  "Gibson",
  "Willis",
  "Ford",
  "Jackson",
  "Costner",
  "Nicholson",
  "Damon",
  "Affleck",
];

const nationalities = [
  "American",
  "British",
  "Canadian",
  "Australian",
  "French",
  "Italian",
  "Irish",
  "German",
];

const roles = [
  "Lead Role",
  "Supporting",
  "Villain",
  "Cameo",
  "Voice Actor",
  "Protagonist",
  "Antagonist",
];

// ─── دوال مساعدة ────────────────────────────────────────────────────
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateDate = (startYear, endYear) => {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
};

// ─── السكريبت الرئيسي ───────────────────────────────────────────────
const seedDB = async () => {
  try {
    console.log("⏳ Connecting to Database...");
    await connectDB();

    console.log("🧹 Deleting old data (Movies, Actors, Roles)...");
    await RoleActor.deleteMany({});
    await Movie.deleteMany({});
    await Actor.deleteMany({});

    // 1. إنشاء 25 فيلم
    console.log("🎬 Generating 25 Movies...");
    const moviesData = movieTitles.map((title, index) => ({
      movieTitle: title,
      movieReleaseDate: generateDate(1990, 2024),
      movieCategories: [getRandom(categories), getRandom(categories)].filter(
        (v, i, a) => a.indexOf(v) === i,
      ), // تصنيفين بدون تكرار
      movieRating: Number((Math.random() * (10 - 5) + 5).toFixed(1)), // تقييم بين 5.0 و 10.0
      movieDirector: directors[index % directors.length], // توزيع المخرجين
    }));
    const createdMovies = await Movie.insertMany(moviesData);
    console.log(`✅ Added ${createdMovies.length} movies.`);

    // 2. إنشاء 50 ممثل
    console.log("🎭 Generating 50 Actors...");
    const actorsData = [];
    for (let i = 0; i < 50; i++) {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      actorsData.push({
        actorName: `${firstName} ${lastName}`,
        actorBirthDate: generateDate(1950, 2000),
        actorNationality: getRandom(nationalities),
      });
    }
    const createdActors = await Actor.insertMany(actorsData);
    console.log(`✅ Added ${createdActors.length} actors.`);

    // 3. ربط الممثلين بالأفلام (إنشاء RoleActor)
    console.log("🔗 Linking Actors to Movies (Adding Cast)...");
    const roleActorsData = [];

    // لكل فيلم، سنختار من 2 إلى 5 ممثلين عشوائيين
    createdMovies.forEach((movie) => {
      const numActors = Math.floor(Math.random() * 4) + 2; // بين 2 و 5 ممثلين
      // خلط الممثلين واختيار عدد عشوائي
      const shuffledActors = [...createdActors]
        .sort(() => 0.5 - Math.random())
        .slice(0, numActors);

      shuffledActors.forEach((actor) => {
        roleActorsData.push({
          movieId: movie._id,
          actorId: actor._id,
          role: getRandom(roles),
        });
      });
    });

    await RoleActor.insertMany(roleActorsData);
    console.log(
      `✅ Added ${roleActorsData.length} cast roles linking movies to actors.`,
    );

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
