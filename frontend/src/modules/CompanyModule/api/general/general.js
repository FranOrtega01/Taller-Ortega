import axiosInstance from "../axiosInstance";

export const get_jobs = async () => {
    const response = await axiosInstance.get(
        "companies",
        {}
    );
    return response.data;
}