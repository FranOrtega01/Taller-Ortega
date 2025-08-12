import axiosInstance from "../axiosInstance";

// #region Companies API Service
export const get_companies = async (format = null) => {
    const response = await axiosInstance.get(
        `companies/companies${format ? `?format=${format}` : ""}`,
        {}
    );
    return response.data;
};
// #endregion

// #region Jobs API Service
export const get_jobs = async (page, pageSize, filters) => {
    const response = await axiosInstance.get("jobs/jobs", {
        params: {
            page,
            limit: pageSize,
            ...filters,
        },
    });
    return response.data;
};

export const get_job_by_id = async (id) => {
    const response = await axiosInstance.get(`jobs/job/${id}`, {});
    return response.data;
};

export const create_job = async (jobData) => {
    const response = await axiosInstance.post(`jobs/job`, jobData, {});
    return response.data;
};

export const get_part_statuses = async () => {
    const response = await axiosInstance.get(`jobs/parts/statuses`, {});
    return response.data;
};

export const get_job_statuses = async () => {
    const response = await axiosInstance.get(`jobs/jobs/statuses`, {});
    return response.data;
};

export const get_job_claims = async (jobId) => {
    const response = await axiosInstance.get(`jobs/job/${jobId}/claims`, {});
    return response.data;
};

export const update_part_status = async (jobId, parts) => {
    const response = await axiosInstance.put(
        `jobs/job/${jobId}/parts`,
        parts,
        {}
    );
    return response.data;
};

export const get_all_job_invoices = async (jobId) => {
    const response = await axiosInstance.get(`jobs/job/invoices/${jobId}`, {});
    return response.data;
};

export const activate_job = async (jobId, data) => {
    const response = await axiosInstance.post(
        `jobs/job/${jobId}/activate`,
        data,
        {}
    );
    return response.data;
};

export const complete_job = async (jobId) => {
    const response = await axiosInstance.post(`jobs/job/${jobId}/complete`, {});
    return response.data;
};

export const update_job_general_info = async (jobId, payload) => {
    const response = await axiosInstance.put(
        `jobs/job/${jobId}/general`,
        payload,
        {}
    );
    return response.data;
};

// #endregion

// #region Invoices API Service
export const get_invoices = async (page, pageSize, filters) => {
    const response = await axiosInstance.get("invoices/invoices", {
        params: {
            page,
            limit: pageSize,
            ...filters,
        },
    });
    return response.data;
};

export const get_invoices_statuses = async () => {
    const response = await axiosInstance.get(
        "invoices/invoices/invoice-statuses",
        {}
    );
    return response.data;
};

export const get_invoices_types = async () => {
    const response = await axiosInstance.get(
        "invoices/invoices/invoice-types",
        {}
    );
    return response.data;
};

export const set_invoice_payments = async (id, data) => {
    const response = await axiosInstance.post(
        `invoices/invoice/${id}/payments`,
        data,
        {}
    );

    return response.data;
};

export const create_invoice = async (data) => {
    const response = await axiosInstance.post(`invoices/invoice`, data, {});

    return response.data;
};

export const get_invoice_stats = async (filters = {}) => {
    const response = await axiosInstance.get(
        "invoices/invoices/general-stats",
        {
            params: filters,
        }
    );
    return response.data;
};

// #endregion

// #region Vehicles API Service
export const get_vehicles = async () => {
    const response = await axiosInstance.get("vehicles/vehicles", {});
    return response.data;
};

export const create_new_vehicle = async (data) => {
    const response = await axiosInstance.post("vehicles/vehicle", data, {});
    return response.data;
};

export const get_vehicle_by_license_plate = async (lp) => {
    const response = await axiosInstance.get(`vehicles/vehicle/${lp}`, {});
    return response.data;
};

export const get_vehicle_owner_by_license_plate = async (lp) => {
    const response = await axiosInstance.get(
        `vehicles/vehicle/${lp}/owner`,
        {}
    );
    return response.data;
};

// #endregion

// #region Claims API Service
export const get_claims = async () => {
    const response = await axiosInstance.get("/claims/claims", {});
    return response.data;
};

export const activate_claim = async (claimCode, data) => {
    const response = await axiosInstance.put(
        `/claims/claim/${claimCode}/activate`,
        data,
        {}
    );
    return response.data;
};

export const create_claim_amp = async (claimCode, data) => {
    const response = await axiosInstance.post(
        `/claims/claim/${claimCode}/amp`,
        data,
        {}
    );
    return response.data;
};

export const update_active_claim = async (claimCode, data) => {
    const response = await axiosInstance.put(
        `/claims/claim/${claimCode}`,
        data,
        {}
    );
    return response.data;
};
// #endregion

// #region Clients API Service
export const get_clients = async () => {
    const response = await axiosInstance.get("clients/clients", {});
    return response.data;
};

export const get_client_by_id = async (id) => {
    const response = await axiosInstance.get(`clients/client/${id}`, {});
    return response.data;
};

export const update_client = async (id, data) => {
    const response = await axiosInstance.put(`clients/client/${id}`, data, {});
    return response.data;
};

export const create_client = async (data) => {
    const response = await axiosInstance.post("clients/client", data, {});
    return response.data;
};

export const get_client_associated_jobs = async (id) => {
    const response = await axiosInstance.get(`jobs/client/${id}`);

    return response.data;
};

// #endregion

// #region Suppliers API Service
export const get_suppliers = async () => {
    const response = await axiosInstance.get(`suppliers/suppliers`);

    return response.data;
};

export const get_supplier_by_id = async (id) => {
    const response = await axiosInstance.get(`suppliers/suppliers/${id}`);

    return response.data;
};

// #endregion

// #region Suppliers Account Movement API Service
export const get_ledger_by_supplier = async (id, filters = {}) => {
    const response = await axiosInstance.get(`ledger/suppliers/${id}/ledger`, {
        params:{
            ...filters
        }
    });

    return response.data;
};
// #endregion

// #region Purchases API Service

// #endregion
