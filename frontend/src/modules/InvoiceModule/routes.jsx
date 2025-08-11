import { Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import { GeneralStats } from "./pages/stats/GeneralStats";

const routes = (
    <>
        <Route index element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/stats" element={<GeneralStats />} />
    </>
);

export default routes;
