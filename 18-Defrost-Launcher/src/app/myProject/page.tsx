import { Navbar } from "@/components";
import MyProjectPage from "./myProject";
import React from "react";

function Invesment() {
  return (
    <div className="h-screen bg-primary">
      <Navbar />
      <div style={{ paddingTop: "50px" }}>
        <MyProjectPage />
      </div>
    </div>
  );
}

export default Invesment;
