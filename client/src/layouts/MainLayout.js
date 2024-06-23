import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
}

export default MainLayout;
