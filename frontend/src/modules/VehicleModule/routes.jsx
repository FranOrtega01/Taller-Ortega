import { Route } from "react-router-dom";
import Home from "./pages/home/Home";
import { Create } from "./pages/create/Create";
import Search from "./pages/search/Search";
import View360 from './pages/view360/View360'

const jobsRoutes = (
    <>
        <Route index element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/search" element={<Search />} />
        <Route path="/view/:licensePlate" element={<View360 />} />
    </>
);

export default jobsRoutes;
