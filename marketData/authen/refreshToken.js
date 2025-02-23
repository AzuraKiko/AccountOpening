const axios = require("axios");
const { urlRefresh, refreshToken_ASX, refreshToken_CXA, refreshToken_ASX_CXA, deviceID, refreshToken_ASX_CXA_Delay, refreshToken_ASX_Delay, refreshToken_CXA_Delay } = require("../base/config");
const { saveFile } = require("../../common/saveFile");

const getToken = async (refreshToken) => {
    try {
        const response = await axios.post(urlRefresh, {
            data: {
                refreshToken,
                "stay_sign_in": true,
                deviceID
            }
        }, {
            headers: { accept: "application/json" }
        });
        return response.data.accessToken;
    } catch (error) {
        console.error("Error get token:", error.response?.data || error.message);
        throw error;
    }
};

const updateTokens = async () => {
    try {
        // Khởi tạo đối tượng tokens
        const tokens = {};
        tokens.tokenASX = await getToken(refreshToken_ASX);
        tokens.tokenCXA = await getToken(refreshToken_CXA);
        tokens.tokenASX_CXA = await getToken(refreshToken_ASX_CXA);
        tokens.tokenASX_Delay = await getToken(refreshToken_ASX_Delay);
        tokens.tokenCXA_Delay = await getToken(refreshToken_CXA_Delay);
        tokens.tokenASX_CXA_Delay = await getToken(refreshToken_ASX_CXA_Delay);

        // Tạo nội dung lưu vào file
        const content = `const tokens = ${JSON.stringify(tokens, null, 2)};\nmodule.exports =  tokens ;`;
        // Lưu tất cả token vào cùng một file
        saveFile(content, "../marketData/authen/tokens.js");

        console.log("Tokens:", tokens);
    } catch (error) {
        console.error("Failed to update tokens:", error.message);
    }
};

updateTokens();
