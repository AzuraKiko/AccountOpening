const eql = require("deep-equal");
const { Parser } = require("json2csv");

const { typeSelect} = require("../onboarding/config/config");
const mapType = "mapJoint";
const { fields } = require(`../onboarding/config/${mapType}`);
const { equixData } = require("../onboarding/config/hodingAddress");

const { readJSONfile } = require("./readJSONfile");
const { checkType } = require("./checkType");
const { normalizeValue } = require("./normalizeValue");
const { getValueArray } = require("./getValue");
const { compareArrays } = require("./compareArrays");
const { saveFile } = require("./savefile");

const { loggerTableType, loggerTableMatch } = require("../logger/loggerTableAll");
const { loggerSimpleMatch } = require("../logger/loggerSimple");
const { loggerFailType, loggerFailMatch } = require("../logger/loggerTableFail");


// Đường dẫn tới file JSON Auseix
let auseixData = readJSONfile(`../onboarding/${typeSelect}/auseix.json`);

// Định nghĩa field mappings (Auseix -> Equix)
const fieldMappings = fields;

// Xử lý từng field và so sánh dữ liệu
const processField = (auseixKey, mapping) => {
  const { target, type, defaultValue, enumMap } = mapping;
  const auseixValue = getValueArray(auseixData, auseixKey);
  let equixValue;
  if (Array.isArray(target)) {
    equixValue = target.map((t) => getValueArray(equixData, t)).join(" ");
  } else {
    equixValue = target ? getValueArray(equixData, target) : undefined;
  }

  const finalAuseixValue = auseixValue ?? defaultValue;
  const isTypeValid = checkType(finalAuseixValue, type);
  const mappedAuseixValue = enumMap && finalAuseixValue in enumMap ? enumMap[finalAuseixValue] : finalAuseixValue;
  const mappedEquixValue = equixValue;
  const normalizedEquixValue = normalizeValue(mappedEquixValue, type);

  let matchResult = "";
  if (target) {
    if (Array.isArray(mappedAuseixValue) && Array.isArray(normalizedEquixValue)) {
      matchResult = compareArrays(mappedAuseixValue, normalizedEquixValue) ? "✅" : "❌";
    } else {
      matchResult = isTypeValid && eql(mappedAuseixValue, normalizedEquixValue) ? "✅" : "❌";
    }
  } else {
    matchResult = isTypeValid && eql(mappedAuseixValue, defaultValue) ? "✅" : "❌";
  }

  return {
    "Auseix Field": auseixKey,
    "Equix Field": Array.isArray(target) ? target.join(", ") : target || "N/A",
    "Auseix Value": mappedAuseixValue,
    "Equix Value": target ? mappedEquixValue : "🪅",
    "Type Valid": isTypeValid ? "✅" : `❌ (Expected ${type})`,
    "Match Result": matchResult,
  }
};

const resultTable = Object.keys(fieldMappings).map((auseixKey) => processField(auseixKey, fieldMappings[auseixKey]));


// In kết quả vào bảng điều khiển
// loggerTableType(resultTable);
// loggerTableMatch(resultTable);

// loggerSimpleMatch(resultTable);

loggerFailType(resultTable);
loggerFailMatch(resultTable);

// Ghi kết quả vào file CSV
const content = new Parser().parse(resultTable);

saveFile(content, `../onboarding/${typeSelect}/result.csv`);