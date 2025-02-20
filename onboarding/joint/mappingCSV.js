const fs = require("fs");
const eql = require("deep-equal");
const path = require("path");
const { fields } = require("../config/mapJoint");
const { equixData } = require("../config/AddressLines");

const filePath1 = path.resolve(__dirname, "auseix.json");

// Hàm đọc file JSON
const readJsonFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File không tồn tại tại đường dẫn: ${filePath}`);
      process.exit(1);
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error("Lỗi đọc dữ liệu từ file JSON:", error.message);
    process.exit(1);
  }
};

// Đọc dữ liệu từ file
let auseixData = readJsonFile(filePath1);

// Lấy giá trị từ object (hỗ trợ key dạng a.b[0].c)
const getValue = (obj, key) => {
  return key.split(".").reduce((acc, k) => {
    if (!acc) return undefined;
    const match = k.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const [, arrayKey, index] = match;
      return acc[arrayKey] && acc[arrayKey][index] !== undefined
        ? acc[arrayKey][index]
        : undefined;
    }
    return acc[k] !== undefined ? acc[k] : undefined;
  }, obj);
};

// Kiểm tra kiểu dữ liệu
const checkType = (value, expectedType) => {
  if (expectedType === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return true;
    return typeof value === "string";
  }
  if (expectedType === "number")
    return typeof value === "number" && !isNaN(value);
  if (expectedType === "boolean") return typeof value === "boolean";
  return true;
};

// Chuẩn hóa dữ liệu
const normalizeValue = (value, type) => {
  if (value === undefined || value === null) return value;
  switch (type) {
    case "string":
      if (typeof value !== "string") return value;
      if (value.includes("au|")) {
        const parts = value.split("|");
        if (parts.length === 2 && parts[0].toLowerCase() === "au") {
          return parts[1].replace(/^0/, "61");
        }
      }
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        const [dd, mm, yyyy] = value.split("/");
        return `${yyyy}-${mm}-${dd}`;
      }
      if (/^\d{13}$/.test(value)) {
        return new Date(Number(value)).toISOString();
      }
      return value;
    default:
      return value;
  }
};

// So sánh các phần tử trong mảng không quan tâm thứ tự
const compareArrays = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;

  const normalizeObject = (obj) => {
    if (Array.isArray(obj)) return obj.map(normalizeObject).sort();
    if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj)
        .sort()
        .reduce((acc, key) => {
          acc[key] = normalizeObject(obj[key]);
          return acc;
        }, {});
    }
    return obj;
  };

  const normalizedArr1 = arr1.map(normalizeObject);
  const normalizedArr2 = arr2.map(normalizeObject);

  return normalizedArr1.every((item1) =>
    normalizedArr2.some((item2) => eql(item1, item2))
  );
};

// Xử lý từng field và so sánh dữ liệu
const processField = (auseixKey, mapping) => {
  const { target, type, defaultValue, enumMap } = mapping;
  const auseixValue = getValue(auseixData, auseixKey);
  let equixValue;

  if (Array.isArray(target)) {
    equixValue = target
      .map((t) => getValue(equixData, t))
      .filter((v) => v !== undefined)
      .join(" ");
  } else {
    equixValue = target ? getValue(equixData, target) : undefined;
  }

  const finalAuseixValue = auseixValue ?? defaultValue;
  const isTypeValid = checkType(finalAuseixValue, type);
  const mappedAuseixValue =
    enumMap && finalAuseixValue in enumMap
      ? enumMap[finalAuseixValue]
      : finalAuseixValue;
  const mappedEquixValue = equixValue;
  const normalizedEquixValue = normalizeValue(mappedEquixValue, type);

  let matchResult = "";
  if (target) {
    if (Array.isArray(mappedAuseixValue) && Array.isArray(normalizedEquixValue)) {
      matchResult = compareArrays(mappedAuseixValue, normalizedEquixValue)
        ? "✅"
        : "❌";
    } else {
      matchResult =
        isTypeValid && eql(mappedAuseixValue, normalizedEquixValue)
          ? "✅"
          : "❌";
    }
  } else {
    matchResult =
      isTypeValid && eql(mappedAuseixValue, defaultValue) ? "✅" : "❌";
  }

  return {
    "Auseix Field": auseixKey,
    "Equix Field": Array.isArray(target) ? target.join(", ") : target || "N/A",
    "Auseix Value": mappedAuseixValue,
    "Equix Value": target ? mappedEquixValue : "🪅",
    "Type Valid": isTypeValid ? "✅" : `❌ (Expected ${type})`,
    Match: matchResult,
  };
};

// Chạy và ghi kết quả ra file JSON
const resultTable = Object.keys(fields).map((auseixKey) =>
  processField(auseixKey, fields[auseixKey])
);

const filePath = path.resolve(__dirname, "result.json");
try {
  fs.writeFileSync(filePath, JSON.stringify(resultTable, null, 2), "utf-8");
  console.log("Kết quả đã được ghi vào file result.json");
} catch (error) {
  console.error(error);
}



// Ghi kết quả vào file CSV
const { Parser } = require("json2csv");

const csvFilePath = path.resolve(__dirname, "result_joint.csv");

try {
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(resultTable);
  fs.writeFileSync(csvFilePath, csv, "utf-8");
  console.log("Kết quả đã được ghi vào file result_joint.csv");
} catch (error) {
  console.error("Lỗi khi ghi file CSV:", error);
}
