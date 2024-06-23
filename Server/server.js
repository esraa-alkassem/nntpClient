const express = require("express");
const bodyParser = require("body-parser");
const messageController = require("./controllers/messageController");
const cors = require("cors");
const {
  connectToNNTPServer,
  authenticateUser,
  sendDateCommand,
  sendHeadCommand,
  disconnectFromNNTPServer,
  logout,
} = require("./controllers/authController");
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use("/messages", messageController.router);

// Endpoint to connect to the NNTP server
app.post("/connect", connectToNNTPServer);

// Endpoint to authenticate
app.post("/authenticate", authenticateUser);

// Endpoint to send DATE command
app.post("/date", sendDateCommand);

// Endpoint to send HEAD command
app.post("/head", sendHeadCommand);

// Endpoint to disconnect
app.post("/disconnect", disconnectFromNNTPServer);
app.post("/logout", logout);
// Endpoint to receive data from NNTP server
app.get("/receive-data", (req, res) => {
  nntpClient.onData((data) => {
    res.write(data); // Write received data to the response
  });

  res.status(200);
  res.set({
    "Content-Type": "text/plain",
    "Transfer-Encoding": "chunked",
  });

  res.end();
});

// const nntp = new NNTP(
//   {
//     host: "news.eternal-september.org",
//     port: 119,
//     user: "it.hobby.fai-da-te",
//     secure: false,
//   },
//   function (err) {
//     if (err) {
//       console.error("Error initializing NNTP client:", err);
//     } else {
//       console.log("Connected to NNTP server");
//       // Add your NNTP operations here
//       nntp.group("comp.lang.javascript", (err, info) => {
//         if (err) {
//           console.error("Error selecting group:", err);
//         } else {
//           console.log("Group selected:", info);
//           nntp.body("1-10", (err, articles) => {
//             if (err) {
//               console.error("Error fetching articles:", err);
//             } else {
//               const articleBodies = articles.map((article) =>
//                 article.body.toString("utf8")
//               );
//               console.log("Fetched articles:", articleBodies);
//             }
//             nntp.quit(); // End the connection
//           });
//         }
//       });
//     }
//   }
// );

// app.get("/api/articles", (req, res) => {
//   nntp.connect();

//   nntp.on("connect", () => {
//     console.log("Connected to NNTP server");

//     // Replace 'comp.lang.javascript' with the group you want to read
//     nntp.group("comp.lang.javascript", (err, info) => {
//       if (err) {
//         console.error("Error selecting group:", err);
//         return res.status(500).json({ error: "Error selecting group" });
//       }

//       console.log("Group selected:", info);

//       // Fetch the latest 10 articles (adjust the range as needed)
//       nntp.body("1-10", (err, articles) => {
//         if (err) {
//           console.error("Error fetching articles:", err);
//           return res.status(500).json({ error: "Error fetching articles" });
//         }

//         const articleBodies = articles.map((article) =>
//           article.body.toString("utf8")
//         );
//         res.json(articleBodies);

//         // End the connection
//         nntp.quit();
//       });
//     });
//   });

//   nntp.on("error", (err) => {
//     console.error("NNTP Error:", err);
//     res.status(500).json({ error: "NNTP Error" });
//   });
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
