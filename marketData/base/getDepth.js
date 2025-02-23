const { tradePrices } = require("../dataQuote/trade_price");

// Hàm lấy trade_price từ file previous_close.json
const getTradePrice = (symbol) => {
  const found = tradePrices.find((item) => item.symbol === symbol);
  return found ? found.trade_price : null;
};

function getDepth(priceASX, priceCXA) {
  const expected = [];

  // Lấy danh sách unique symbol từ 2 sàn
  const symbols = [
    ...new Set([
      ...priceASX.map((item) => item.symbol),
      ...priceCXA.map((item) => item.symbol),
    ]),
  ];

  symbols.forEach((symbol) => {
    const dataASX = priceASX.find((item) => item.symbol === symbol) || {};
    const dataCXA = priceCXA.find((item) => item.symbol === symbol) || {};

    // Tổng hợp depth từ 2 sàn
    const trade_price = getTradePrice(symbol);
    console.log("trade_price", trade_price);
    console.log("------------------------------------------");

    const depthASX = dataASX.depth || { ask: {}, bid: {} };
    const depthCXA = dataCXA.depth || { ask: {}, bid: {} };

    let depth = {
      ask: {},
      bid: {},
      total_ask_size: 0,
      total_bid_size: 0,
    };

    const sides = ["ask", "bid"];

    sides.forEach((side) => {
      const allPrices = {};

      // Gộp dữ liệu từ cả hai sàn
      [depthASX, depthCXA].forEach((sourceData, index) => {
        const source = index === 0 ? "ASX" : "CXA";
        const data = sourceData[side];

        for (const key in data) {
          const { price, quantity, number_of_trades } = data[key];
          const parsedPrice = parseFloat(price);

          // Điều kiện lọc giá
          const isValidPrice =
            (side === "ask" && parsedPrice > trade_price) ||
            (side === "bid" && parsedPrice < trade_price);

          if (isValidPrice) {
            if (!allPrices[parsedPrice]) {
              allPrices[parsedPrice] = {
                symbol: symbol,
                // exchanges: exchanges,
                exchanges: "ASX",
                side: side.charAt(0).toUpperCase() + side.slice(1),
                quantity: quantity,
                number_of_trades: number_of_trades || null,
                price: parsedPrice,
                source: source,
              };
            } else {
              // Nếu giá đã tồn tại, cộng dồn quantity và cập nhật source
              allPrices[parsedPrice].quantity += quantity;
              allPrices[parsedPrice].number_of_trades +=
                number_of_trades || null;
              if (allPrices[parsedPrice].source !== source) {
                allPrices[parsedPrice].source = "MIX";
              }
            }
          }
        }
      });

      // Sắp xếp và chọn top 10
      const sortedPrices = Object.values(allPrices).sort((a, b) => {
        return side === "ask" ? a.price - b.price : b.price - a.price;
      });

      sortedPrices.slice(0, 10).forEach((item, index) => {
        depth[side][index] = item;
      });

      // Tính tổng size cho ask và bid
      if (side === "ask") {
        depth.total_ask_size = sortedPrices.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      } else {
        depth.total_bid_size = sortedPrices.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      }
    });

    expected.push({
        symbol: symbol,
        depth: depth,
      });
  });

  return expected;
}

module.exports = { getDepth };
