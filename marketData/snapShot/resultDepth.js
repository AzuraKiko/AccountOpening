const axios = require("axios");
const { tokenASX, tokenCXA, tokenASX_CXA } = require("../authen/tokens");
const {
  urlSnapASX,
  urlDelayASX,
  urlSnapCXA,
  urlDelayCXA,
  urlSnapAll,
  urlDelayAll,
} = require("../base/config");
const { saveFile } = require("../../common/saveFile");
const { compareArrayObjects } = require("../../common/compareArray[Ob2]");
const { getPrice } = require("../base/getData");
const { getDepth } = require("../base/getDepth");

// Hàm delay sử dụng Promise
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Khai báo biến bên ngoài để sử dụng trong toàn bộ IIFE
let priceASX_CXA = {};
let expectedDepth = {};
let priceASX = {};
let priceCXA = {};

// Sử dụng async IIFE để đảm bảo tuần tự
(async () => {
  try {
    // Lấy giá của từng sàn
    priceASX = await getPrice(urlSnapASX, tokenASX);
    const depthASX = priceASX.map((item) => item.depth);
    saveFile(
      JSON.stringify(depthASX, null, 2),
      "../marketData/dataDepth/depthASX.json"
    );

    // Đợi 1 phút (60 giây) trước khi gọi getPrice cho CXA
    await delay(6000);
    priceCXA = await getPrice(urlSnapCXA, tokenCXA);
    const depthCXA = priceCXA.map((item) => item.depth);
    saveFile(
      JSON.stringify(depthCXA, null, 2),
      "../marketData/dataDepth/depthCXA.json"
    );

    // Lấy giá ASX_CXA và gán cho biến bên ngoài
    priceASX_CXA = await getPrice(urlSnapAll, tokenASX_CXA);
    const depthASX_CXA = priceASX_CXA.map((item) => {
      return {
        symbol: item.symbol,
        depth: item.depth,
      };
    });
    saveFile(
      JSON.stringify(depthASX_CXA, null, 2),
      "../marketData/dataDepth/depthASX_CXA.json"
    );

    // Tạo expectedQuote dựa trên ASX và CXA
    expectedDepth = getDepth(priceASX, priceCXA);
    saveFile(
      JSON.stringify(expectedDepth, null, 2),
      "../marketData/dataDepth/expectedDepth.json"
    );

    //So sánh giá trị sau khi đã có giá trị của priceASX_CXA
    if (priceASX_CXA && Object.keys(priceASX_CXA).length > 0) {
      compareArrayObjects(depthASX_CXA, expectedDepth, ["symbol"]);
    } else {
      console.log("priceASX_CXA is empty or undefined");
    }
  } catch (error) {
    console.error("Failed :", error.message);
  }
})();
