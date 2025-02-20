const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { LOGIN_URL, grant_type, client_id, client_secret } = require("../config/config");

// Đường dẫn đến thư mục chứa file token
const folderPath = path.join(__dirname); // Đảm bảo đường dẫn đúng cho thư mục chứa file token
const filePath = path.join(folderPath, "tokenAuseix.js");

// Kiểm tra nếu thư mục chưa tồn tại thì tạo mới
const directory = path.dirname(filePath);
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
};

const getToken = async () => {
    try {
        const response = await axios.post(LOGIN_URL,
            {
                grant_type,
                client_id,
                client_secret
            },
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            }
        );
        const token = response.data.access_token;
        await updateTokenFile(token); // Cập nhật token vào file
        return token;
    } catch (error) {
        console.error("Error get token:", error.response?.data || error.message);
        throw error;
    }
};

// Cập nhật token trong file 'tokenAuseix.js'
const updateTokenFile = async (token) => {
    try {
        const content = `const token_ausiex = '${token}';\nmodule.exports = token_ausiex;\n`;

        // Sử dụng fs.promises.writeFile cho bất đồng bộ
        await fs.promises.writeFile(filePath, content, "utf8");
        console.log("Token saved successfully to tokenAuseix.js");
    } catch (error) {
        console.error("Failed to save token:", error);
    }
};

getToken()
    .then((token) => console.log("Token:", token))
    .catch((error) => console.error("Failed to get token:", error));
