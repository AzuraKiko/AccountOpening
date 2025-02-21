const axios = require("axios");
const { PORTAL_URL, refreshToken } = require("../config/config");
const { saveFile } = require("../../common/savefile");

const getToken = async () => {
  try {
    const response = await axios.post(PORTAL_URL, { data: { refreshToken } }, {
      headers: { accept: "application/json" }
    });

    const token = response.data.accessToken;
    // Tạo đoạn mã JavaScript chứa token
    const content = `const token = '${token}'; \nmodule.exports = { token };`; // Tạo đoạn mã JavaScript chứa token
    // Lưu token vào file
    saveFile(content, "../onboarding/portal/tokenPortal.js");
    return token;
  } catch (error) {
    console.error("Error get token:", error.response?.data || error.message);
    throw error;
  }
};

// Thực thi hàm getToken
getToken()
  .then((token) => console.log("Token:", token))
  .catch((err) => console.error("Failed to get token:", err));
