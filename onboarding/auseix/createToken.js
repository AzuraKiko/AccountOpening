const axios = require("axios");
const { LOGIN_URL, grant_type, client_id, client_secret } = require("../config/config");
const { saveFile } = require("../../common/savefile");
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
        const content = `const token_ausiex = '${token}';\nmodule.exports = { token_ausiex };\n`;

        // Lưu token vào file 'tokenAuseix.js'
        saveFile(content, "../onboarding/auseix/tokenAuseix.js");
        return token;
    } catch (error) {
        console.error("Error get token:", error.response?.data || error.message);
        throw error;
    }
};

getToken()
    .then((token) => console.log("Token:", token))
    .catch((error) => console.error("Failed to get token:", error));

