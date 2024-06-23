import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, Box } from "@mui/material";
import MainLayout from "../../layouts/MainLayout";
import ConnectForm from "./ConnectForm";

const index = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          width: "40%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          marginTop: 10,
          backgroundImage: "linear-gradient(to bottom right, #87CEEB, #FFFFFF)",
          borderRadius: 8,
          boxShadow: 4,
        }}
      >
        <ConnectForm />
      </Box>
    </div>
  );
};
export default index;
