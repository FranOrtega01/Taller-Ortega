import axiosInstance from "../axiosInstance";

export const get_clients= async () => {
    const response = await axiosInstance.get(
        "clients",
        {}
    );
    return response.data;
}

export const get_client_by_id = async (id) => {
    const response = await axiosInstance.get(
        `clients/${id}`,
        {}
    );
    return response.data;
}

export const update_client = async (id, data) => {
    const response = await axiosInstance.put(
        `clients/${id}`, data,
        {}
    );
    return response.data;
}