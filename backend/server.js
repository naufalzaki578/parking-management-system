import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

console.log("URI yang dipakai:", process.env.MONGODB_URI);

await connectDB();

app.listen(PORT, () => {
  console.log(`Parking API running at http://localhost:${PORT}`);
});