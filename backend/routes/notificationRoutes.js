const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");


/* ===============================
   CREATE NOTIFICATION
================================ */

router.post("/", async (req, res) => {
  try {

    const notification = await Notification.create({
      title: req.body.title,
      message: req.body.message,
      type: req.body.type
    });

    res.status(201).json(notification);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ===============================
   GET ALL NOTIFICATIONS
================================ */

router.get("/", async (req, res) => {
  try {

    const notifications = await Notification
      .find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(notifications);

  } catch (error) {
    res.status(500).json(error);
  }
});


/* ===============================
   MARK AS READ
================================ */

router.put("/:id/read", async (req, res) => {
  try {

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(notification);

  } catch (error) {
    res.status(500).json(error);
  }
});


/* ===============================
   DELETE NOTIFICATION
================================ */

router.delete("/:id", async (req, res) => {
  try {

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: "Notification deleted" });

  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;