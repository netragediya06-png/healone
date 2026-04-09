const Feedback = require("../models/Feedback");

exports.addFeedback = async (req, res) => {
  try {
    const { name, email, subject, message, type } = req.body;

    const newFeedback = new Feedback({
      name,
      email,
      subject,
      message,
      type
    });

    await newFeedback.save();

    res.status(200).json({
      success: true,
      message: "Feedback saved successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};


exports.getAllFeedback = async (req, res) => {
  try {
    const data = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching feedback"
    });
  }
};
