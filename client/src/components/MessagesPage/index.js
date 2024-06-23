import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid } from "@mui/material";
import axios from "axios";

const columns = [
  { field: "id_mes", headerName: "ID", width: 70 },
  { field: "fm", headerName: "From", width: 130 },
  { field: "newsgroups", headerName: "Newsgroups", width: 130 },
  { field: "sub", headerName: "Subject", width: 200 },
  { field: "d_mes", headerName: "Date", width: 150 },
];

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming groupId is retrieved from local storage
    const userData = localStorage.getItem("user");
    console.log("🚀 ~ useEffect ~ user:", JSON.parse(userData).group);

    let { group, user, password, port, host } = JSON.parse(userData);

    // Data to send in the body of the POST request
    const requestData = {
      group,
      user,
      password, // Avoid sending sensitive data like passwords directly unless over HTTPS
      port,
      host,
    };

    // URL for the POST request
    const url = `http://localhost:3001/messages/${group}/messages`;

    // Fetch messages from API
    axios
      .get(url, {
        params: { user, password, port, host },
      })

      .then((response) => {
        const messagesWithIds = response.data.map((msg, index) => ({
          ...msg,
          id: index + 1,
          newsgroups: group,
          // Use index + 1 as a simple unique ID for each message
        }));
        setMessages(messagesWithIds);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Grid container spacing={2} style={{ marginTop: "40px" }}>
      <Grid item xs={12} style={{ marginBottom: "20px", marginLeft: "40px" }}>
        Messages
      </Grid>
      {console.log({ message: messages })}
      <Grid item xs={12} style={{ marginLeft: "40px" }}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={messages}
            columns={columns}
            loading={loading}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            getRowId={(row) => row.id}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default MessagesPage;
