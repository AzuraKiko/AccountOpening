const eql = require("deep-equal");
const { fields } = require("../config/mapIndividual");
const { equixData } = require("../config/hodingAddress");
const { readJSONfile } = require("../../common/readJSONfile");
const { checkType } = require("../../common/checkType");
const { normalizeValue } = require("../../common/normalizeValue");
const { getValueArray } = require("../../common/getValue");
const { loggerTableType, loggerTableMatch } = require("../../logger/loggerTableAll");
const { saveFile } = require("../../common/saveFile");
const { loggerSimpleMatch } = require("../../logger/loggerSimple");
const { loggerFailType ,loggerFailMatch } = require("../../logger/loggerTableFail");

// Đường dẫn tới file JSON Auseix
let auseixData = readJSONfile("../onboarding/individual/auseix.json");

// Định nghĩa field mappings (Auseix -> Equix)
const fieldMappings = fields;
// Kiểm tra từng field
let resultTable = [];

for (let auseixKey in fieldMappings) {
  const { target, type, defaultValue, enumMap } = fieldMappings[auseixKey];

  const auseixValue = getValueArray(auseixData, auseixKey);
  let equixValue;
  if (Array.isArray(target)) {
    equixValue = target
      .map((t) => getValueArray(equixData, t))
      .filter((v) => v !== undefined) // Lọc giá trị `undefined`
      .join(" "); // Gộp lại thành chuỗi
  } else {
    equixValue = target ? getValueArray(equixData, target) : undefined;
  }

  // Áp dụng defaultValue nếu cần
  const finalAuseixValue = auseixValue ?? defaultValue;

  // Kiểm tra kiểu dữ liệu hợp lệ
  const isTypeValid = checkType(finalAuseixValue, type);

  // Nếu có enumMap, ánh xạ giá trị
  const mappedAuseixValue =
    enumMap && finalAuseixValue in enumMap
      ? enumMap[finalAuseixValue]
      : finalAuseixValue;
  const mappedEquixValue = equixValue;

  // Chuẩn hóa dữ liệu trước khi so sánh
  const normalizedEquixValue = normalizeValue(mappedEquixValue, type);

  // Xác định giá trị so sánh và trạng thái match
  let matchResult = ""; // Mặc định nếu không có target
  if (target) {
    matchResult =
      isTypeValid && eql(mappedAuseixValue, normalizedEquixValue) ? "✅" : "❌";
  } else
    matchResult =
      isTypeValid && eql(mappedAuseixValue, defaultValue) ? "✅" : "❌";

  resultTable.push({
    "Auseix Field": auseixKey,
    "Equix Field": Array.isArray(target) ? target.join(", ") : target || "N/A",
    "Auseix Value": mappedAuseixValue,
    "Equix Value": target ? mappedEquixValue : "👀",
    "Expected Type": type,
    "Type Valid": isTypeValid ? "✅" : `❌ (Expected ${type})`,
    "Match Result": matchResult,
  });
}

// In kết quả vào bảng điều khiển
// loggerTableType(resultTable);
// loggerTableMatch(resultTable);

// loggerSimpleMatch(resultTable);

loggerFailType(resultTable);
loggerFailMatch(resultTable);

// Ghi kết quả vào file CSV
const { Parser } = require("json2csv");
const content = new Parser().parse(resultTable);

saveFile(content, "../onboarding/individual/result.csv");