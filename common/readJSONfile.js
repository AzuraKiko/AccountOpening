const fs = require("fs");
const path = require("path");

// Hàm đọc file JSON
const readJSONfile = (relativePath) => {
  try {
    const filePath = path.resolve(__dirname, relativePath);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File không tồn tại tại đường dẫn: ${filePath}`);
      return null;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Lỗi đọc dữ liệu từ file JSON:", error.message);
    return null;
  }
};

module.exports = { readJSONfile };
