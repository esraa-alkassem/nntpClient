const {
  runQuery,
  initializeDatabase,
  fetchData,
} = require("./sqliteFunctions");
const NNTPClient = require("../controllers/NNTPClient");
const express = require("express");
const router = express.Router();

// Initialize the NNTP client
const nntpClient = new NNTPClient();

// Initialize database on server start
initializeDatabase().catch((err) =>
  console.error("Error initializing database:", err)
);

// Controller functions
async function getSavedMessages(req, res) {
  try {
    const agroup = req.params.groupId; // Assuming groupId is passed as a parameter
    const messages = await fetchData(agroup);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
}

async function getAllMessages(req, res) {
  try {
    const agroup = req.params.groupId; // Assuming groupId is passed as a parameter
    console.log("🚀 ~ getAllMessages ~ req.params:", req.params);
    const { host, port, user, password } = req.query;
    console.log(
      "🚀 ~ getAllMessages ~ host, port, username, password:",
      host,
      port,
      user,
      password
    );

    const nntpClient = new NNTPClient();

    const articleNumbers = await nntpClient.listArticles(
      host,
      port,
      user,
      password,
      agroup
    );
    console.log("🚀 ~ getAllMessages ~ articleNumbers:", articleNumbers);

    const limitedArticleNumbers = articleNumbers.slice(1, 5);
    console.log(
      "🚀 ~ getAllMessages ~ limitedArticleNumbers:",
      limitedArticleNumbers
    );

    const articles = await nntpClient.fetchArticles(limitedArticleNumbers);
    console.log("🚀 ~ getAllMessages ~ articles:", articles);
    nntpClient.logout();
    const messages = articles.map((article) => {
      const parsedMessage = parseNNTPMessage(article);
      return parsedMessage.headers;
    });

    console.log("🚀 ~ getAllMessages ~ messages:", messages);

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
}
function parseNNTPMessage(rawMessage) {
  const lines = rawMessage.raw.split("\r\n");

  const message = {
    raw: rawMessage.raw,
    headers: {},
    body: [],
  };

  let inHeaders = true;

  for (let line of lines) {
    if (line.trim() === "") {
      inHeaders = false;
      continue;
    }

    if (inHeaders) {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        message.headers[key] = value;
      }
    } else {
      message.body.push(line);
    }
  }

  return message;
}
const MAX_ARTICLES_TO_PROCESS = 10; // Example: Process up to 10 articles

async function processArticles() {
  try {
    const articleNumbers = [175546, 175547, 175548, 175549]; // Example list of article numbers
    let count = 0;

    for (let i = 0; i < articleNumbers.length; i++) {
      if (count >= MAX_ARTICLES_TO_PROCESS) {
        console.log(
          `Reached maximum articles (${MAX_ARTICLES_TO_PROCESS}). Stopping further processing.`
        );
        break;
      }

      const articleNumber = articleNumbers[i];
      console.log(`Processing article ${articleNumber}`);

      // Simulate fetching article content
      const articleContent = await fetchArticleContent(articleNumber);
      console.log(`Article ${articleNumber} content:`, articleContent);

      count++;
    }

    console.log("Finished processing articles.");
  } catch (error) {
    console.error("Error processing articles:", error);
  }
}

async function fetchArticleContent(articleNumber) {
  // Implement your logic to fetch article content here
  // Example: Fetching article content asynchronously
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Content of article ${articleNumber}`);
    }, 1000); // Simulating async fetch delay
  });
}

// Call the function to start processing articles

async function postNewMessage(req, res) {
  const { host, port, username, password, group, subject, body } = req.body;

  try {
    const messageId = await nntpClient.postArticleWithAuth(
      host,
      port,
      username,
      password,
      group,
      subject,
      body
    );

    // Save message to database
    const from = username; // Replace with actual user data
    const datetime = new Date().toISOString(); // Replace with actual timestamp
    saveMessage(group, messageId, from, subject, body, datetime);

    res
      .status(201)
      .json({ message: "Message posted and saved successfully", messageId });
  } catch (error) {
    console.error("Error posting message:", error);
    res
      .status(500)
      .json({ error: "Error posting message", details: error.message });
  }
}

async function respondToMessage(req, res) {
  const { groupId, messageId } = req.params;
  const { body } = req.body;
  const { host, port, username, password } = req.body;

  try {
    // Connect to the NNTP server and authenticate
    await nntpClient.connect(host, port);
    await nntpClient.authenticate(username, password);

    // Respond to the message on the NNTP server
    await nntpClient.respondToMessage(messageId, body);

    // Save response to database
    const from = username; // Replace with actual user data
    const datetime = new Date().toISOString(); // Replace with actual timestamp
    saveMessage(groupId, messageId, from, "Re: Subject", body, datetime);

    res.status(201).json({ message: "Response posted and saved successfully" });
  } catch (error) {
    console.error("Error responding to message:", error);
    res
      .status(500)
      .json({ error: "Error responding to message", details: error.message });
  }
}

function saveMessage(groupId, messageId, from, subject, body, datetime) {
  const sql = `
    INSERT INTO a_USENET (agroup, id_mes, fm, sub, body, d_mes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [groupId, messageId, from, subject, body, datetime];

  runQuery(sql, params)
    .then(() => console.log("Message saved to database"))
    .catch((err) =>
      console.error("Error saving message to database:", err.message)
    );
}

// Routes
router.get("/:groupId/messages", getSavedMessages);
router.post("/post-article", postNewMessage);
router.post("/:groupId/messages/:messageId/respond", respondToMessage);

module.exports = {
  getAllMessages,
  postNewMessage,
  respondToMessage,
  router,
};
