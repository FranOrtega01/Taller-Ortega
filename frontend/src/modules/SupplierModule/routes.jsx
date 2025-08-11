import { Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import View from "./pages/view360/View360";

const suppliersRoutes = (
    <>
        <Route index element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/view/:id" element={<View />} />
    </>
);

export default suppliersRoutes;
