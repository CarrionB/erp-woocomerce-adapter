import axios from "axios";
import { storage } from "../../utilities/storage";
import { isCookieInvalid } from "./utils";

const { ERP_URL, ERP_USER, ERP_PASSWORD } = process.env;

export const forceLogin = async () => {
  const { headers } = await axios({
    method: "POST",
    url: `${ERP_URL}/api/method/login`,
    data: {
      usr: ERP_USER,
      pwd: ERP_PASSWORD,
    },
    headers: { "Content-Type": "application/json" },
  });
  if ("set-cookie" in headers) {
    const cookieSettings = headers["set-cookie"][0].split(";");
    const cookieId = cookieSettings[0];
    const expirationDateString = cookieSettings[1].split("=")[1];
    storage.setItem("cookieId", cookieId);
    storage.setItem("expirationDateString", expirationDateString);
  }
};

export const erpLogin = async () => {
  if (isCookieInvalid()) {
    await forceLogin();
  }
};

const erpApi = axios.create({});

export const getConfig = async () => {
  await erpLogin();
  const storedCookie = storage.getItem("cookieId");
  const config = {
    baseURL: ERP_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Cookie: `full_name=Administrator;${storedCookie};system_user=yes;user_id=Administrator`,
    },
  };
  return config;
};

erpApi.interceptors.request.use(async (config) => {
  const customConfig = await getConfig();
  return {
    ...config,
    ...customConfig,
  };
});

erpApi.interceptors.response.use((response) => {
  return response;
});

export default erpApi;
