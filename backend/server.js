const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const bacteriaRoute = require("./routes/bacteria");
app.use("/api/bacteria", bacteriaRoute);

app.get("/", (req, res) => {
  res.send("KYL backend running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});