import axios from "axios";
import { toast } from "react-toastify";

export const postLoginAPICallFunction = async (payload) => {
  try {
    console.log(payload, "daskjdjlasljkdjkslad");
    const response = await axios.post(payload.url, payload.data.formValue);
    return response;
  } catch (e) {
    if (e.code === "ERR_NETWORK") {
      toast.error("Network error");
    } else {
      toast.error(e.response.data.status.message);
    }
    return e.response;
  }
};
export const getAPICallFunction = async (payload) => {
  try {
    const response = await axios.get(
      payload.url + `${payload.id ? payload.id : ""}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("udsToken")}`,
          "ngrok-skip-browser-warning": "skip-browser-warning",
        },
        params: {
          ...payload?.params,
        },
      },
    );
    return response.data;
  } catch (e) {
    if (
      e.response.data.status.code === 401 ||
      e.response.data.status.code === 403
    ) {
      localStorage.removeItem("udsToken");
      localStorage.removeItem("useFeedbackStore");
      window.location.href = "/";
      toast.error("Error occured please login");
    } else {
      if (e.code === "ERR_NETWORK") {
        toast.error("Network error");
      } else {
        toast.error(e.response.data.status.message);
      }
    }
    return e.response;
  }
};

export const getNoTokenAPICallFunction = async (payload) => {
  try {
    const response = await axios.get(
      payload.url + `${payload.id ? payload.id : ""}`,
      {
        params: {
          ...payload?.params,
        },
      },
    );
    return response.data;
  } catch (e) {
    if (
      e.response.data.status.code === 401 ||
      e.response.data.status.code === 403
    ) {
      localStorage.removeItem("udsToken");
      localStorage.removeItem("useFeedbackStore");
      window.location.href = "/";
      toast.error("Error occured please login");
    } else {
      if (e.code === "ERR_NETWORK") {
        toast.error("Network error");
      } else {
        toast.error(e.response.data.status.message);
      }
    }
    return e.response;
  }
};

export const postAPICallFunction = async (payload) => {
  try {
    const response = await axios.post(
      payload.url + "/" + `${payload.id ? payload.id : ""}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("udsToken")}`,
          "ngrok-skip-browser-warning": "skip-browser-warning",
        },
        params: {
          ...payload?.params,
        },
      },
    );
    return response;
  } catch (e) {
    if (
      e.response.data.status.code === 401 ||
      e.response.data.status.code === 403
    ) {
      localStorage.removeItem("udsToken");
      localStorage.removeItem("useFeedbackStore");
      window.location.href = "/";
      toast.error("Error occured please login");
    } else {
      if (e.code === "ERR_NETWORK") {
        toast.error("Network error");
      } else {
        toast.error(e.response.data.status.message);
      }
    }
    return e.response;
  }
};
export const noTokenPostAPICallFunction = async (payload) => {
  try {
    const response = await axios.post(
      payload.url + "/" + `${payload.id ? payload.id : ""}`,
      payload.data,
      {
        params: {
          ...payload?.params,
        },
      },
    );
    return response;
  } catch (e) {
    if (
      e.response.data.status.code === 401 ||
      e.response.data.status.code === 403
    ) {
      localStorage.removeItem("udsToken");
      localStorage.removeItem("useFeedbackStore");
      window.location.href = "/";
      toast.error("Error occured please login");
    } else {
      if (e.code === "ERR_NETWORK") {
        toast.error("Network error");
      } else {
        toast.error(e.response.data.status.message);
      }
    }
    return e.response;
  }
};

export const patchAPICallFunction = async (payload) => {
  try {
    const response = await axios.patch(
      payload.url + "/" + `${payload.id ? payload.id : ""}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("udsToken")}`,
          "ngrok-skip-browser-warning": "skip-browser-warning",
        },
      },
    );
    return response;
  } catch (e) {
    if (
      e.response.data.status.code === 401 ||
      e.response.data.status.code === 403
    ) {
      localStorage.removeItem("udsToken");
      localStorage.removeItem("useFeedbackStore");
      window.location.href = "/";
      toast.error("Error occured please login");
    } else {
      if (e.code === "ERR_NETWORK") {
        toast.error("Network error");
      } else {
        toast.error(e.response.data.status.message);
      }
    }
    return e.response;
  }
};
export const deleteAPICallFunction = async (payload) => {
  try {
    const response = await axios.delete(
      payload.url + "/" + payload.id,
      // payload?.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("udsToken")}`,
          "ngrok-skip-browser-warning": "skip-browser-warning",
        },
      },
    );
    return response;
  } catch (e) {
    if (
      e.response.data.status.code === 401 ||
      e.response.data.status.code === 403
    ) {
      localStorage.removeItem("udsToken");
      localStorage.removeItem("useFeedbackStore");
      window.location.href = "/";
      toast.error("Error occured please login");
    } else {
      if (e.code === "ERR_NETWORK") {
        toast.error("Network error");
      } else {
        toast.error(e.response.data.status.message);
      }
    }
    return e.response;
  }
};
