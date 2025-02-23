const axios = require("axios");
const { tokenASX, tokenCXA, tokenASX_CXA } = require("../authen/tokens");
const { urlSnapASX, urlDelayASX, urlSnapCXA, urlDelayCXA, urlSnapAll, urlDelayAll } = require("../base/config");
const { saveFile } = require("../../common/saveFile");
const { compareArrayObjects } = require("../../common/compareArray[Ob1]");
const { getPrice } = require("../base/getData");
const { getQuote } = require("../base/getQuote");

// Hàm delay sử dụng Promise
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Khai báo biến bên ngoài để sử dụng trong toàn bộ IIFE
let priceASX_CXA = {};
let expectedQuote = {};
let priceASX = {};
let priceCXA = {};


// Sử dụng async IIFE để đảm bảo tuần tự
(async () => {
  try {
    // Lấy giá của từng sàn
    priceASX = await getPrice(urlSnapASX, tokenASX);
    const quoteASX = priceASX.map(item => item.quote);
    saveFile(JSON.stringify(quoteASX, null, 2), "../marketData/dataQuote/quoteASX.json");


    // Đợi 1 phút (60 giây) trước khi gọi getPrice cho CXA
    await delay(6000);
    priceCXA = await getPrice(urlSnapCXA, tokenCXA);
    const quoteCXA = priceCXA.map(item => item.quote);
    saveFile(JSON.stringify(quoteCXA, null, 2), "../marketData/dataQuote/quoteCXA.json");

    // Lấy giá ASX_CXA và gán cho biến bên ngoài
    priceASX_CXA = await getPrice(urlSnapAll, tokenASX_CXA);
    const quoteASX_CXA = priceASX_CXA.map(item => item.quote);
    saveFile(JSON.stringify(quoteASX_CXA, null, 2), "../marketData/dataQuote/quoteASX_CXA.json");

    // Tạo expectedQuote dựa trên ASX và CXA
    expectedQuote = getQuote(priceASX, priceCXA);
    saveFile(JSON.stringify(expectedQuote, null, 2), "../marketData/dataQuote/expectedQuote.json");

    // Kiểm tra và lưu previous_close nếu có giá trị
    if (Array.isArray(expectedQuote) && expectedQuote.length > 0) {
      // Tạo mảng lưu previous_close theo từng symbol và exchange
      const previousCloseArray = expectedQuote
        .filter(item => item.close && !item.is_closed_price_updated) // Lọc các item có giá trị close
        .map(item => ({
          symbol: item.symbol,
          exchange: item.exchange || null,
          previous_close: item.close || null
        }));

      if (previousCloseArray.length > 0) {
        // Chuyển đổi sang nội dung của file
        const content = `const previousCloses = ${JSON.stringify(previousCloseArray, null, 2)};\nmodule.exports = { previousCloses };`;

        // Lưu mảng previous_close vào file JS
        saveFile(content, "../marketData/dataQuote/previous_close.js");
      } else {
        console.log("Không lưu previous_close");
      }
    } else {
      console.log("expectedQuote không phải là mảng hoặc không có phần tử nào");
    }


    // Lưu trade_price vào file JS
    const tradepriceArray = expectedQuote.map(item => ({
      symbol: item.symbol,
      exchange: item.exchange || null,
      trade_price: item.trade_price || null
    }));
    if (tradepriceArray.length > 0) {
      const content = `const tradePrices = ${JSON.stringify(tradepriceArray, null, 2)};\nmodule.exports = { tradePrices };`;
      saveFile(content, "../marketData/dataQuote/trade_price.js");
    } else {
      console.log("Không lưu trade_price");
    };

    //So sánh giá trị sau khi đã có giá trị của priceASX_CXA
    if (priceASX_CXA && Object.keys(priceASX_CXA).length > 0) {
      compareArrayObjects(quoteASX_CXA, expectedQuote, ['symbol']);
    } else {
      console.log("priceASX_CXA is empty or undefined");
    }

  } catch (error) {
    console.error("Failed :", error.message);
  }
})();
