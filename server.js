import express from "express";
import { syncStravaToNotion } from "./src/sync.js";
const PORT = 4000;
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello Users");
});

app.get("/sync", async (req, res) => {
  try {
    await syncStravaToNotion();
    res.json({
      message: "sync started",
    });
  } catch (error) {
    console.log(error);
  }
});

// Webhooks
// Strava Webhook Verification
const STRAVA_TOKEN = process.env.STRAVA_TOKEN;

app.get("/webhook", (req, res) => {
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];
  const mode = req.query["hub.mode"];

  if (mode === "subscribe" && token === STRAVA_TOKEN) {
    console.log("Webhook verified by Strava");
    return res.json({ "hub.challenge": challenge });
  }
  res.status(403).json({ error: "Verification failed" });
});

// Strava Webhook Event Receiver
app.post("/webhook", async (req, res) => {
  const event = req.body;

  // Respond immediately to Strava
  res.sendStatus(200);

  try {
    if (event.object_type === "activity" && event.aspect_type === "create") {
      console.log(`New activity received: ${event.object_id}`);
      await syncStravaToNotion(event.object_id);
      console.log(`Activity ${event.object_id} synced to Notion`);
    }
  } catch (error) {
    console.error("Error syncing activity:", error);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
