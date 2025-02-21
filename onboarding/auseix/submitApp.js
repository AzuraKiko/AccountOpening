const axios = require("axios");
const { APPLICANT_URL, X_Request_ID } = require("../config/config");
const { token_ausiex } = require("../auseix/tokenAuseix");
const { readJSONfile } = require("../../common/readJSONfile");
const { typeSelect } = require("../config/config");

let requestBody = readJSONfile(`../onboarding/${typeSelect}/auseix.json`);

const createApplicant = async () => {
    try {
        const response = await axios.post(
            APPLICANT_URL,
            requestBody,  
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token_ausiex}`,
                    "X-Request-ID": X_Request_ID
                }
            }
        );
        const data = response.data || {};
        console.log("Tạo thành công:", data);
    } catch (error) {
        console.error("Lỗi khi gửi request tạo applicant:", error.response?.data || error.message);
    }
};

createApplicant();
