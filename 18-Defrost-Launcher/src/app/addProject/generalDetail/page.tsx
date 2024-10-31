"use client";
import InfoBar from "@/components/infobar";
import Generaldetail from "./generalDetail";
import { Navbar } from "@/components";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";

const PromotionPage = () => {
  return (
    <div className="h-screen bg-primary">
      <Navbar />
      <div style={{ paddingTop: "60px" }}>
        <Provider store={store}>
          <InfoBar />
          <Generaldetail />
        </Provider>
      </div>
    </div>
  );
};

export default PromotionPage;
