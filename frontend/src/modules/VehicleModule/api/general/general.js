import axiosInstance from "../axiosInstance";

export const get_jobs = async () => {
    const response = await axiosInstance.get(
        "vehicles",
        {}
    );
    return response.data;
}