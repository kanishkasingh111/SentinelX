const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

exports.analyzeThreat = async (
  req,
  res
) => {
  try {
    const { text } = req.body;

    const genAI =
      new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
      );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result =
      await model.generateContent(
        `Analyze this message for cyber threats:
        ${text}`
      );

    const response =
      result.response.text();

    res.json({
      result: response,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};