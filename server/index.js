import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import urlRoutes from "./routes/urlRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import Url from "./models/Url.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://domainshift.vercel.app'],
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/urls", urlRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Domain Shift Server 😀");
})

// Redirect:
app.get("/:domain", async (req, res) => {
  const domain = req.params.domain;
  console.log(`Received request to redirect domain: ${domain}`);

  try {
    const url = await Url.findOne({
      redirectUrl: `${process.env.BACKEND_URL}/${domain}`,
    });
    if (url) {
      console.log(`Found URL entry: ${url}`);
      res.redirect(301, url.destinationUrl);
    } else {
      console.log(`No URL entry found for domain: ${domain}`);
      res.status(404).send("Not Found");
    }
  } catch (err) {
    console.error("Error during redirection:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
