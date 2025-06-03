import React, { useEffect } from "react";
import { get_jobs } from "../../../../services/api/general/general";

const Home = () => {
    const getJobs = async () => {
      const jobs = await get_jobs();
      console.log("Jobs: ", jobs);
      
    };

    useEffect(() => {
        getJobs();
    }, []);

    return <h1>Página de Trabajos</h1>;
};

export default Home;
