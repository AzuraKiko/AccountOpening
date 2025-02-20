const axios = require("axios");
const fs = require("fs");
const path = require("path");

// // Định nghĩa đường dẫn lưu file trong thư mục Individual
// const folderPath = path.resolve(__dirname, "Individual");
// const filePath = path.join(folderPath, "equix.json");

// // Kiểm tra nếu thư mục chưa tồn tại thì tạo mới
// if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath, { recursive: true });
// }

const filePath = path.resolve(__dirname, "equix.json");

const { OPENING_URL, token, equix_id } = require("../config/config");

// Hàm lấy thông tin onboarding theo equix_id và ghi vào file equix.json trong thư mục Individual
const getDetailOnboarding = async () => {
    try {
        const response = await axios.get(
            OPENING_URL, // API endpoint
            {
                params: { equix_id }, // Truyền equix_id bằng query
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = response.data[0] || {}; // Đảm bảo luôn có dữ liệu
        const jsonData = JSON.stringify(data, null, 2);

        // Ghi dữ liệu JSON vào file
        fs.writeFile(filePath, jsonData, "utf8", (err) => {
            if (err) {
                console.error("Lỗi ghi file:", err);
            } else {
                console.log(`Response đã lưu vào: ${filePath}`);
            }
        });

    } catch (error) {
        console.error("Lỗi lấy dữ liệu onboarding:", error.response?.data || error.message);
    }
};

// Thực thi hàm
getDetailOnboarding();
