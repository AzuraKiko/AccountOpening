const axios = require("axios");
const { tokenASX, tokenCXA, tokenASX_CXA } = require("../authen/tokens");
const { urlRealtimeASX, urlRealtimeCXA, urlRealtimeAll } = require("../base/config");
const { saveFile } = require("../../common/saveFile");
const { compareArrayObjects } = require("../../common/compareArray[Ob1]");
const { getQuote } = require("../base/getQuote");
const { streamLatestResponse } = require("../base/streaming");

// Hàm delay sử dụng Promise
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Khai báo biến bên ngoài để sử dụng trong toàn bộ IIFE
let priceASX_CXA = {};
let expectedQuote = {};
let priceASX = {};
let priceCXA = {};


const streamASX = streamLatestResponse(urlRealtimeASX, tokenASX);

// Để lấy response mới nhất theo type
setTimeout(() => {
  priceASX = streamASX.getLatestResponseByType('quotes');
  console.log('Response mới nhất cho quotes:', priceASX);
}, 5000);
const quoteASX = priceASX.map(item => item.quote);
saveFile(JSON.stringify(quoteASX, null, 2), "../marketData/realtimeQuote/quoteASX.json");

const streamCXA = streamLatestResponse(urlRealtimeCXA, tokenCXA);

setTimeout(() => {
  priceCXA = streamCXA.getLatestResponseByType('quotes');
  console.log('Response mới nhất cho quotes:', priceCXA);
}, 5000);
const quoteCXA = priceCXA.map(item => item.quote);
saveFile(JSON.stringify(quoteCXA, null, 2), "../marketData/realtimeQuote/quoteCXA.json");

const streamAll = streamLatestResponse(urlRealtimeAll, tokenASX_CXA);

setTimeout(() => {
  priceASX_CXA = streamAll.getLatestResponseByType('quotes');
  console.log('Response mới nhất cho quotes:', priceASX_CXA);
}, 5000);
const quoteASX_CXA = priceASX_CXA.map(item => item.quote);
saveFile(JSON.stringify(quoteASX_CXA, null, 2), "../marketData/realtimeQuote/quoteASX_CXA.json");

// Lấy giá trị expectedQuote
 expectedQuote = getQuote(priceASX, priceCXA);
 // Lấy giá trị expectedQuote
 saveFile(JSON.stringify(expectedQuote, null, 2), "../marketData/realtimeQuote/expectedQuote.json");

//So sánh giá trị sau khi đã có giá trị của priceASX_CXA
if (priceASX_CXA && Object.keys(priceASX_CXA).length > 0) {
  compareArrayObjects(quoteASX_CXA, expectedQuote, ['symbol']);
} else {
  console.log("priceASX_CXA is empty or undefined");
}

