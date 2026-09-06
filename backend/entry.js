import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

// Vercel calls this handler on every request. We ensure the DB
// connection is established (or reused from cache) before passing
// the request to the Express app.
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}