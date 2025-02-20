const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const { PORTAL_URL, refreshToken } = require("../config/config");

const getToken = async () => {
  try {
    const response = await axios.post(PORTAL_URL, { data: { refreshToken } }, {
      headers: { accept: "application/json" }
    });

    const token = response.data.accessToken;
    await updateTokenFile(token); // Cập nhật token vào file
    return token;
  } catch (error) {
    console.error("Error get token:", error.response?.data || error.message);
    throw error;
  }
};

// Cập nhật token trong file 'token.js'
async function updateTokenFile(newToken) {
  try {
    const filePath = path.resolve(__dirname, "token.js");
    const content = `const token = '${newToken}';\nmodule.exports = token;\n`;
    await fs.writeFile(filePath, content, "utf8");
    console.log("Token saved successfully to token.js");
  } catch (err) {
    console.error("Failed to save token:", err);
  }
}

// Thực thi hàm getToken
getToken()
  .then((token) => console.log("Token:", token))
  .catch((err) => console.error("Failed to get token:", err));
