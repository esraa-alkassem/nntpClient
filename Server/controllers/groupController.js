const express = require("express");
const router = express.Router();
const NNTPClient = require("./NNTPClient"); // Adjust path as necessary

const nntpClient = new NNTPClient();
const groups = ["group1", "group2", "group3"]; // Replace with actual group list logic

router.get("/groups", (req, res) => {
  res.render("groups", { groups });
});

router.get("/groups/:groupId/messages", (req, res) => {
  const groupId = req.params.groupId;

  // Fetch and display messages from NNTP server (simplified)
  nntpClient
    .fetchMessages(groupId)
    .then((messages) => {
      res.render("messages", { messages });
    })
    .catch((error) => {
      console.error("Error fetching messages:", error.message);
      res.redirect("/groups");
    });
});

module.exports = router;
