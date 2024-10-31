// import { Footer, Navbar } from "@/components"
"use client";
import { Navbar } from "@/components";
import ProjectDetailPage from "./projectDetail";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";

const ProjectDetail = () => {
  return (
    <div className="h-screen bg-primary">
      <Navbar />
      <div>
        <Provider store={store}>
          <ProjectDetailPage />
        </Provider>
      </div>
    </div>
  );
};

export default ProjectDetail;
