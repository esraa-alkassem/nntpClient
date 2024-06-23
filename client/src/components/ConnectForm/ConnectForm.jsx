import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import Visibility from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const ConnectForm = () => {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [user, setUser] = useState("");
  const [group, setGroup] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call onConnect function with host, port, and user
    handleConnect({ host, port, user, group, password });
  };
  const handleConnect = async ({ host, port, user, password }) => {
    // Example: Send request to backend to connect to NNTP server
    const response = await fetch("http://localhost:3001/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ host, port, user, password }),
    });

    if (response.ok) {
      const data = await response.text();
      Swal.fire({
        title: "Good job!",
        text: `${data}`,
        icon: "success",
      }).then(() => {
        localStorage.setItem(
          "user",
          JSON.stringify({ host, port, user, group, password })
        );
        navigate("/messages");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div
      sx={{
        maxWidth: 400,
        marginTop: 20,

        borderColor: "primary.main",
        borderWidth: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Connect to NNTP Server
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Host"
              variant="outlined"
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Port"
              variant="outlined"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Group"
              variant="outlined"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="User"
              variant="outlined"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor:
                  "linear-gradient(to bottom right, #87CEEB, #FFFFFF)",
                color: "white",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#87CEEB",
                },
              }}
            >
              Connect
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ConnectForm;
