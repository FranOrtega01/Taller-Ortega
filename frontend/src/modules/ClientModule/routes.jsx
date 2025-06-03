import { Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import View from "./pages/view360/View360";
import { Create } from "./pages/create/Create";

const clientsRoutes = (
    <>
        <Route index element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/create" element={<Create />} />
        <Route path="/view/:id" element={<View />} />
    </>
);

export default clientsRoutes;
