const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(cors());
const client = new OAuth2Client("509638925342-g3ffivlgu45uccigoeei7iedgr6f8lhc.apps.googleusercontent.com");

app.use(express.json());

app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "509638925342-g3ffivlgu45uccigoeei7iedgr6f8lhc.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();

    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    };

    // Save to MongoDB here

    res.json(user);
  } catch (error) {
    res.status(401).send("Invalid token");
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});