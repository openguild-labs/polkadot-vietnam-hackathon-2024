"use client";
import React from "react";
import Verifytoken from "./verifyToken";
import { Navbar } from "@/components";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
function page() {
  return (
    <div className="h-screen bg-primary overflow-hidden">
      <Navbar />
      <div>
        <Provider store={store}>
          <Verifytoken />
        </Provider>
      </div>
    </div>
  );
}

export default page;
