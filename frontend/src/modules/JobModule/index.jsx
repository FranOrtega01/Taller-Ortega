import { Routes } from "react-router-dom";
import jobsRoutes from "./routes";
import { JobProvider } from "./contexts/jobContext";

const Jobs = () => {
    return (
        <JobProvider>
            <Routes>{jobsRoutes}</Routes>
        </JobProvider>
    );
};

export default Jobs;
