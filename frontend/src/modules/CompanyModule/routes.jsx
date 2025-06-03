import { Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";

const jobsRoutes = (
    <>
        <Route index element={<Home />} />
        <Route path="/search" element={<Search />} />
    </>
);

export default jobsRoutes;
