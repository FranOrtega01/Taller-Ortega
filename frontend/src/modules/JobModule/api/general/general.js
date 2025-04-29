import axiosInstance from "../axiosInstance";

export const get_jobs = async () => {
    const response = await axiosInstance.get(
        "jobs",
        {}
    );
    return response.data;
}

export const get_job_by_id = async (id) => {
    const response = await axiosInstance.get(
        `jobs/${id}`,
        {}
    );
    return response.data;
}