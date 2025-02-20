const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { APPLICANT_URL, token_ausiex, X_Request_ID } = require("../config/config");

const filePath = path.resolve(__dirname, 'auseix.json');  // Đảm bảo file 'auseix.json' nằm cùng thư mục với file này
let requestBody;

try {
    // Kiểm tra sự tồn tại của file trước khi đọc
    if (fs.existsSync(filePath)) {
        // Đọc dữ liệu từ file JSON
        const data = fs.readFileSync(filePath, "utf-8");
        requestBody = JSON.parse(data).data;
    } else {
        console.error("File 'auseix.json' không tồn tại tại đường dẫn:", filePath);
        return;
    }
} catch (error) {
    console.error("Lỗi đọc dữ liệu từ file JSON:", error.message);
    return;  // Dừng chương trình nếu có lỗi khi đọc file
}

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
