const net = require("net");

class NNTPClient {
  constructor() {
    this.client = new net.Socket();
    this.ms = null;
    this.host = null;
    this.port = null;
    this.user = null;
    this.password = null;
    this.lastActivity = Date.now();
    this.receivedData = "";
    this.article = null;
    this.postResolve = null;
    this.headersResolve = null;
    this.articlesResolve = null;
    this.articleResponses = [];
    this.pendingArticles = 10;

    this.client.on("data", (data) => {
      console.log("Received: " + data + " time: " + Date.now());
      this.receivedData += data.toString();
      this.handleData(data.toString());
      this.lastActivity = Date.now();
    });

    this.client.on("close", () => {
      console.log("Connection closed");
    });

    this.client.on("error", (err) => {
      console.error("Error: " + err.message);
      this.client.destroy();
    });
  }

  connect(host, port) {
    return new Promise((resolve, reject) => {
      this.host = host;
      this.port = port;
      this.client
        .connect(port, host, () => {
          console.log("Connected to NNTP server");
          this.ms = "msConnect";
          this.lastActivity = Date.now();
          resolve(this.receivedData);
        })
        .on("error", (error) => {
          console.error("Connection error:", error.message);
          reject(error);
        });
    });
  }

  authenticate(username, password) {
    this.user = username;
    this.password = password;
    const userMessage = `AUTHINFO USER ${username}\r\n`;
    console.log("Sending:", userMessage);
    this.client.write(userMessage);
    this.ms = "msAuthorization_SentUsername";
    this.lastActivity = Date.now();
  }

  handleData(data) {
    console.log("🚀 ~ NNTPClient ~ handleData ~ data:", data);
    const response = data.trim();
    console.log("Handling response:", response);

    if (
      response.startsWith("381") &&
      this.ms === "msAuthorization_SentUsername"
    ) {
      const passMessage = `AUTHINFO PASS ${this.password}\r\n`;
      console.log("Sending:", passMessage);
      this.client.write(passMessage);
      this.ms = "msAuthorization_SentPassword";
    } else if (response.startsWith("281")) {
      console.log("Authentication successful");
      if (this.ms === "msAuthorization_SentPassword") {
        this.ms = "msAuthenticated";
      } else if (this.ms === "msPost") {
        console.log("Article posting was successful");
      }
    } else if (response.startsWith("340")) {
      console.log("Server ready for article content");
      if (this.ms === "msPost") {
        this.sendArticle();
      }
    } else if (response.startsWith("240")) {
      console.log("Article posted successfully");
      const messageIdMatch = response.match(/<(.+?)>/);
      if (messageIdMatch) {
        const messageId = messageIdMatch[1];
        if (this.postResolve) {
          this.postResolve(messageId);
          this.postResolve = null;
        }
      }
      this.ms = "msAuthenticated"; // Reset to authenticated state after posting
    } else if (response.startsWith("502")) {
      console.error("Already authenticated or authentication required");
    } else if (response.startsWith("500")) {
      console.error("Unexpected error:", response);
    } else if (response.startsWith("441")) {
      console.error("Article post failed:", response);
    } else if (response.startsWith("211")) {
      console.log("Received article numbers list");
      const parts = response.split(" ");
      console.log("🚀 ~ NNTPClient ~ handleData ~ parts:", parts);
      const articleNumbers = [];
      if (parts.length >= 4) {
        const start = parseInt(parts[2], 10);
        const end = parseInt(parts[3], 10);
        for (let i = start; i <= end; i++) {
          articleNumbers.push(i);
        }
      }
      if (this.headersResolve) {
        this.headersResolve(articleNumbers);
        this.headersResolve = null;
      }
    } else if (response.startsWith("220")) {
      console.log("Received article");
      if (this.ms === "msFetchArticles") {
        this.articleResponses.push(response);
        this.pendingArticles--;

        if (this.pendingArticles === 0) {
          this.articlesResolve(this.articleResponses);
          this.ms = null;

          // Disconnect after resolving all articles
          this.disconnect();
        }
      }
    } else {
      console.log("Unhandled response:", response);
    }
  }

  postArticle(group, subject, body) {
    if (this.ms !== "msAuthenticated") {
      console.error("You need to be authenticated before posting an article");
      return;
    }
    const postMessage = `POST\r\n`;
    console.log("Sending:", postMessage);
    this.client.write(postMessage);
    this.ms = "msPost";
    this.lastActivity = Date.now();

    this.article = `From: yourname@example.com\r\nNewsgroups: ${group}\r\nSubject: ${subject}\r\n\r\n${body}\r\n.\r\n`;
  }

  sendArticle() {
    if (this.article) {
      console.log("Sending article content:", this.article);
      this.client.write(this.article);
      this.article = null; // Reset after sending
    }
  }

  postArticleWithAuth(host, port, username, password, group, subject, body) {
    return new Promise(async (resolve, reject) => {
      this.postResolve = resolve;

      try {
        await this.connect(host, port);
        this.authenticate(username, password);

        // Wait for authentication
        await new Promise((resolve) => setTimeout(resolve, 2000));

        this.postArticle(group, subject, body);
      } catch (error) {
        console.error("Error in postArticleWithAuth:", error);
        reject(error);
      }
    });
  }

  listArticles(host, port, username, password, group) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.connect(host, port);
        this.authenticate(username, password);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const listMessage = `GROUP ${group}\r\n`;
        console.log("Sending:", listMessage);
        this.client.write(listMessage);
        this.ms = "msListArticles";
        this.headersResolve = resolve;
        this.lastActivity = Date.now();
      } catch (error) {
        console.error("Error in listArticles:", error);
        reject(error);
      }
    });
  }

  fetchArticle(articleNumber) {
    return new Promise((resolve, reject) => {
      this.articlesResolve = resolve;
      const fetchMessage = `ARTICLE ${articleNumber}\r\n`;
      console.log("Sending:", fetchMessage);
      this.client.write(fetchMessage);
      this.ms = "msFetchArticle";
      this.lastActivity = Date.now();
    });
  }

  fetchArticles(articleNumbers) {
    return new Promise((resolve, reject) => {
      this.articlesResolve = resolve;
      this.articleResponses = [];
      this.pendingArticles = articleNumbers.length;

      articleNumbers.forEach((articleNumber) => {
        const fetchMessage = `ARTICLE ${articleNumber}\r\n`;
        console.log("Sending:", fetchMessage);
        this.client.write(fetchMessage);
      });

      this.ms = "msFetchArticles";
      this.lastActivity = Date.now();
    });
  }

  logout() {
    return new Promise((resolve) => {
      this.client.end(() => {
        console.log("Connection closed by client");
        this.isConnected = false;
        resolve();
      });
    });
  }

  disconnect() {
    this.client.end(() => {
      this.isConnected = false;
    });
  }

  getReceivedData() {
    return this.receivedData;
  }
}

module.exports = NNTPClient;
