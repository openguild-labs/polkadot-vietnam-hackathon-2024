"use client";
import { Navbar } from "@/components";
import PreviewPage from "./preview";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";

const ProjectDetail = () => {
  return (
    <div className="h-screen bg-primary">
      <Navbar />
      <div>
        <Provider store={store}>
          <PreviewPage />
        </Provider>
      </div>
    </div>
  );
};

export default ProjectDetail;
