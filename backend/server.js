const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_SERVICE = process.env.PYTHON_SERVICE || "http://127.0.0.1:5001";
app.use(cors());
app.use(express.json());

const tracks = [
  {id:1,title:"Golden Hour",artist:"Demo Artist",album:"Sunrise Sessions",genre:"Chill",mood:"calm",duration:"0:12",cover:"sunset",audio:"/audio/demo-melody.wav"},
  {id:2,title:"Neon Dreams",artist:"Demo Artist",album:"City Lights",genre:"Electronic",mood:"energetic",duration:"0:12",cover:"neon",audio:"/audio/demo-melody.wav"},
  {id:3,title:"Quiet Morning",artist:"Demo Artist",album:"Slow Days",genre:"Ambient",mood:"calm",duration:"0:12",cover:"morning",audio:"/audio/demo-melody.wav"},
  {id:4,title:"Run the Night",artist:"Demo Artist",album:"After Hours",genre:"Pop",mood:"energetic",duration:"0:12",cover:"night",audio:"/audio/demo-melody.wav"},
  {id:5,title:"Blue Skies",artist:"Demo Artist",album:"Open Windows",genre:"Acoustic",mood:"happy",duration:"0:12",cover:"sky",audio:"/audio/demo-melody.wav"},
  {id:6,title:"Deep Focus",artist:"Demo Artist",album:"Study Room",genre:"Instrumental",mood:"focus",duration:"0:12",cover:"focus",audio:"/audio/demo-melody.wav"}
];
app.get("/api/health", (_req,res) => res.json({status:"ok",service:"MelodyHub Node API"}));
app.get("/api/tracks", (req,res) => {
  const q = String(req.query.q || "").toLowerCase().trim();
  res.json(tracks.filter(t => `${t.title} ${t.artist} ${t.album} ${t.genre}`.toLowerCase().includes(q)));
});
app.get("/api/recommendations", async (_req,res) => {
  try {
    const response = await fetch(`${PYTHON_SERVICE}/recommendations`);
    if (!response.ok) throw new Error("Python service error");
    res.json(await response.json());
  } catch (e) {
    res.status(503).json({message:"Start the Python recommendation service on port 5001.",details:e.message});
  }
});
app.listen(PORT, () => console.log(`MelodyHub API running at http://localhost:${PORT}`));
