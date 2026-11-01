const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.RPC_API_KEY;

if (!API_KEY) {
  console.error("RPC_API_KEY is missing!");
  process.exit(1);
}

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

let activity = {
  details: "Custom RPC by RC",
  state: "Discord Rich Presence",
  largeImageKey: "",
  largeImageText: "",
  smallImageKey: "",
  smallImageText: "",
  buttons: []
};

function auth(req, res, next) {
  if (req.get("x-rpc-key") !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/api/activity", auth, (req, res) => {
  res.json(activity);
});

app.post("/api/activity", auth, (req, res) => {
  const b = req.body || {};
  const clean = (v, max = 128) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  activity = {
    details: clean(b.details),
    state: clean(b.state),
    largeImageKey: clean(b.largeImageKey),
    largeImageText: clean(b.largeImageText),
    smallImageKey: clean(b.smallImageKey),
    smallImageText: clean(b.smallImageText),
    buttons: Array.isArray(b.buttons)
      ? b.buttons.slice(0, 2)
          .filter(x => x && x.label && /^https:\/\/.+/i.test(x.url))
          .map(x => ({
            label: clean(x.label, 32),
            url: clean(x.url, 512)
          }))
      : []
  };

  res.json({ success: true, activity });
});

app.get("/", (req, res) => {
  res.send("RPC BY RC is running!");
});

app.listen(PORT, () => {
  console.log("RPC BY RC running on port " + PORT);
});
