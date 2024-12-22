import axios from "axios";
const baseURL = "https://8e79-103-179-241-38.ngrok-free.app";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export const getItems = async (payload) => {
  let _payload = {
    page: payload.page,
    limit: payload.limit,
  };
  if (payload.qstr) {
    _payload.qstr = payload.qstr;
  }

  try {
    const response = await api.get("/v1/api/customers", {
      params: _payload,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const uploadFileData = async (payload) => {
  try {
    const formData = new FormData();
    formData.append("invoice", payload); // Assuming `payload` is a file object

    const response = await axios.post(
      `${baseURL}/v1/api/invoice/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data; // The server response should match the sample you provided
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const generateInvoiceData = async (customerIds) => {
  try {
    const payload = {
      customerIds: customerIds,
    };

    const response = await axios.post(
      `${baseURL}/v1/api/invoice/generate`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response data
    return response.data?.stats;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteInvoice = async () => {
  try {
    const response = await axios.delete(`${baseURL}/v1/api/invoice`);
    return response.data.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
