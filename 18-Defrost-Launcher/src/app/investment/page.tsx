import { Navbar } from "@/components";
import InvesmentPage from "./invesment";
import React from "react";

function Invesment() {
  return (
    <div className="h-screen bg-primary">
      <Navbar />
      <div style={{ paddingTop: "50px" }}>
        <InvesmentPage />
      </div>
    </div>
  );
}

export default Invesment;
