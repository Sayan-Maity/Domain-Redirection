import Url from "../models/Url.js";

const createRedirectUrl = async (req, res) => {
  const { sourceUrl, destinationUrl } = req.body;

  if (!sourceUrl || !destinationUrl) {
    return res
      .status(400)
      .json({ error: "Both source and destination URLs are required" });
  }

  try {
    let existingUrl = await Url.findOne({ sourceUrl });

    if (existingUrl) {
      return res.json({ customUrl: existingUrl.redirectUrl });
    } else {
      const newUrl = new Url({
        sourceUrl,
        destinationUrl,
        redirectUrl: `${process.env.BACKEND_URL}/${sourceUrl}`,
      });

      await newUrl.save();
      return res.json({ customUrl: newUrl.redirectUrl });
    }
  } catch (err) {
    console.error("Error creating URL:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export { createRedirectUrl };
