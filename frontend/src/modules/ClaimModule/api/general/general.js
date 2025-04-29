import axiosInstance from "../axiosInstance";

export const get_jobs = async () => {
    const response = await axiosInstance.get(
        "claims",
        {}
    );
    return response.data;
}