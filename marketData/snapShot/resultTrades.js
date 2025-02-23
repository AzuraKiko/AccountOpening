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
const { getTrades } = require("../base/getTrades");

// Hàm delay sử dụng Promise
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Khai báo biến bên ngoài để sử dụng trong toàn bộ IIFE
let priceASX_CXA = {};
let expectedTrades = {};
let priceASX = {};
let priceCXA = {};

// Sử dụng async IIFE để đảm bảo tuần tự
(async () => {
  try {
    // Lấy giá của từng sàn
    priceASX = await getPrice(urlSnapASX, tokenASX);
    const tradesASX = priceASX.map((item) => item.trades);
    saveFile(
      JSON.stringify(tradesASX, null, 2),
      "../marketData/dataTrades/tradesASX.json"
    );

    // Đợi 1 phút (60 giây) trước khi gọi getPrice cho CXA
    await delay(6000);
    priceCXA = await getPrice(urlSnapCXA, tokenCXA);
    const tradesCXA = priceCXA.map((item) => item.trades);
    saveFile(
      JSON.stringify(tradesCXA, null, 2),
      "../marketData/dataTrades/tradesCXA.json"
    );

    // Lấy giá ASX_CXA và gán cho biến bên ngoài
    priceASX_CXA = await getPrice(urlSnapAll, tokenASX_CXA);
    const tradesASX_CXA = priceASX_CXA.map((item) => {
      const newTrades = {};
      
      // Chuyển đổi từ mảng sang object với key là số thứ tự
      Object.entries(item.trades).forEach(([tradeId, trade], index) => {
        newTrades[index] = trade;
      });
    
      return {
        symbol: item.symbol,
        trades: newTrades, // Gán lại trades đã chuyển đổi
      };
    });

    // tradesASX_CXA = tradesASX_CXA.map(trades => {
    //   const newTrades = {};
    //   // Duyệt qua từng cặp key-value và đổi key thành trade.id
    //   Object.entries(trades).forEach(([tradeId, trade]) => {
    //     newTrades[trade.id] = trade;
    //   });
    //   return newTrades;
    // });

    saveFile(
      JSON.stringify(tradesASX_CXA, null, 2),
      "../marketData/dataTrades/tradesASX_CXA.json"
    );

    // Tạo expectedQuote dựa trên ASX và CXA
    expectedTrades = getTrades(priceASX, priceCXA);
    saveFile(
      JSON.stringify(expectedTrades, null, 2),
      "../marketData/dataTrades/expectedTrades.json"
    );

    //So sánh giá trị sau khi đã có giá trị của priceASX_CXA
    if (priceASX_CXA && Object.keys(priceASX_CXA).length > 0) {
      compareArrayObjects(tradesASX_CXA, expectedTrades, ["symbol"]);
    } else {
      console.log("priceASX_CXA is empty or undefined");
    }
  } catch (error) {
    console.error("Failed :", error.message);
  }
})();
