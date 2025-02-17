import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL
|| "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const Song = mongoose.model("Song", {
  id: Number,
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
});


if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  resetDataBase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 9090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
// Main route
app.get("/", (req, res) => {
  res.json({ 
    responseMessage: "Hi, let's look at some music!",
    routes: {
      "/songs": "shows all songs",
      "/songs/dancing": "Show songs great for dancing",
    }
  } );
});

// Find all songs
app.get("/songs/", async (req, res) => {
  try {
    const allTheSongs = await Song.find({})
    if (allTheSongs) {
      res.status(200).json({
        success: true,
        body: allTheSongs
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: error
      }
    });
  }
  
});


  app.get('/songs/dancing', async (req, res) => {
    const danceSongs = await Song.find({ danceability: { $gte: 80 } });
  
    res.json(danceSongs);
  });



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
