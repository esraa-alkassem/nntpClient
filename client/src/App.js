import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, Box } from "@mui/material";
import MainLayout from "./layouts/MainLayout";
import ConnectForm from "./components/ConnectForm/index";
import MessagesPage from "./components/MessagesPage";

function App() {
  const theme = useSelector((state) => state.theme);

  return (
    <div className={`App ${theme}`}>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Navigate to="/contactForm" />} />
          <Route path="/contactForm" element={<ConnectForm />} />
          <Route
            path="/messages"
            element={
              <MainLayout>
                <MessagesPage />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
