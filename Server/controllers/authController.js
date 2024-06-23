const NNTPClient = require("./NNTPClient");

const nntpClient = new NNTPClient();

const connectToNNTPServer = async (req, res) => {
  const { host, port, user, password } = req.body;

  try {
    // Connect to NNTP server
    await nntpClient.connect(host, port);
    console.log("Connected to NNTP server");

    // Listen for data events to handle responses from NNTP server
    nntpClient.client.once("data", async (data) => {
      const receivedData = data.toString().trim(); // Trim to remove whitespace

      console.log("Received data from NNTP:", receivedData);

      // Check for specific response codes
      if (receivedData.startsWith("200")) {
        // Connection established, proceed to authenticate
        console.log("Connection established");

        // Authenticate with provided credentials
        await nntpClient.authenticate(user, password);

        // After authentication, check for authentication response
        nntpClient.client.on("data", (authData) => {
          const authResponse = authData.toString().trim();

          console.log("Authentication response:", authResponse);

          // Determine authentication success or failure
          if (authResponse.startsWith("281")) {
            // Successful authentication
            console.log("Successfully authenticated");
            res
              .status(200)
              .send(
                "Connecting and authenticating to NNTP server successfully"
              );
          } else if (authResponse.startsWith("481")) {
            console.log(
              " Authentication Failed, unexpected response:",
              authResponse
            );
            res.status(401).send("Authentication failed");
          }
        });
      }
    });

    // Handle connection errors
    nntpClient.client.on("error", (err) => {
      console.error("NNTP connection error:", err.message);
      res.status(500).send("Failed to connect to NNTP server");
    });
  } catch (error) {
    console.error("Connection error:", error.message);
    res.status(500).send("Failed to connect to NNTP server");
  }
};

const authenticateUser = (req, res) => {
  const { username } = req.body;
  nntpClient.authenticate(username);
  res.status(200).send("Authenticating...");
};

const sendDateCommand = (req, res) => {
  nntpClient.sendDate();
  res.status(200).send("Sending DATE command...");
};

const sendHeadCommand = (req, res) => {
  const { lastMessageNo } = req.body;
  nntpClient.sendHead(lastMessageNo);
  res.status(200).send("Sending HEAD command...");
};

const disconnectFromNNTPServer = (req, res) => {
  nntpClient.disconnect();
  res.status(200).send("Disconnecting from NNTP server...");
};
// Handle logout
async function logout(req, res) {
  try {
    await nntpClient.logout();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Error during logout" });
  }
}

module.exports = {
  connectToNNTPServer,
  authenticateUser,
  sendDateCommand,
  sendHeadCommand,
  disconnectFromNNTPServer,
  logout,
};
