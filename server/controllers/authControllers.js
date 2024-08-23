import { SiweMessage } from 'siwe';

// generate a nonce:
const nonceGeneration = async (req, res) => {
  const nonce = Math.random().toString(36).substring(2);
  res.json({ nonce });
};

// verify signature:
const verifyUser = async (req, res) => {
  try {
    const { message, signature } = req.body;
    if (!message || !signature) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const siweMessage = new SiweMessage(message);
    const verification = await siweMessage.verify({ signature });

    if (verification.success) {
      console.log("User signed in successfully");
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: "Signature verification failed" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { nonceGeneration, verifyUser };
