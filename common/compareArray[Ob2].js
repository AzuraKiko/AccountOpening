const compareArrayObjects = (arr1, arr2, matchKeys) => {
  let result = [];

  // Hàm đệ quy để so sánh sâu từng key (kể cả Object lồng nhau)
  const deepCompare = (obj1, obj2, parentKey = '') => {
    let keys = Object.keys(obj1);

    keys.forEach(key => {
      let fullPath = parentKey ? `${parentKey}.${key}` : key;

      if (typeof obj1[key] === 'object' && obj1[key] !== null && !Array.isArray(obj1[key])) {
        // Nếu là Object lồng nhau, đệ quy để so sánh sâu hơn
        deepCompare(obj1[key], obj2[key] || {}, fullPath);

      } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key]) &&
        obj1[key].every(item => typeof item === 'string') &&
        obj2[key].every(item => typeof item === 'string')) {
        // Nếu cả 2 đều là array string, so sánh không quan tâm thứ tự
        const set1 = new Set(obj1[key]);
        const set2 = new Set(obj2[key]);

        const isEqual = set1.size === set2.size && [...set1].every(value => set2.has(value));
        result.push({
          fieldName: fullPath,
          compareValue: obj1[key].join(", "),
          expectedValue: obj2[key].join(", "),
          matchResult: isEqual ? "✅" : "❌",
          matchedBy: matchKeys
            .map(k => obj1[k] !== undefined ? `${k}: ${obj1[k]}` : null)
            .filter(v => v !== null)
            .join(', ')

        });


        //   // Nếu là Array, so sánh từng phần tử
        // } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        //   obj1[key].forEach((item, index) => {
        //     let expectedItem = obj2[key] ? obj2[key][index] : undefined;

        //     // Nếu là chuỗi số, chuyển thành số nguyên để so sánh
        //     const value1 = isNaN(item) ? item : Number(item);
        //     const value2 = isNaN(expectedItem) ? expectedItem : Number(expectedItem);

        //     result.push({
        //       fieldName: `${fullPath}[${index}]`,
        //       compareValue: value1,
        //       expectedValue: value2,
        //       matchResult: value1 === value2 ? "✅" : "❌",
        //       matchedBy: matchKeys
        //       .map(k => obj1[k] !== undefined ? `${k}: ${obj1[k]}` : null)
        //       .filter(v => v !== null)
        //       .join(', ')
        //     });
        //   });

      } else {
        // So sánh giá trị trực tiếp
        result.push({
          fieldName: fullPath,
          compareValue: obj1[key],
          expectedValue: obj2[key],
          matchResult: obj1[key] === obj2[key] ? "✅" : "❌",
          matchedBy: matchKeys
            .map(k => obj1[k] !== undefined ? `${k}: ${obj1[k]}` : null)
            .filter(v => v !== null)
            .join(', ')
        });
      }
    });
  };

  // Hàm tìm Object tương ứng trong arr2 dựa trên matchKeys
  const findMatchingObject = (obj, array) => {
    return array.find(item =>
      matchKeys.every(key => obj[key] === item[key])
    );
  };

  // Duyệt từng Object trong arr1
  arr1.forEach(obj1 => {
    // Tìm Object tương ứng trong arr2
    const obj2 = findMatchingObject(obj1, arr2);

    if (obj2) {
      // Bỏ qua các matchKeys, so sánh các key còn lại
      let obj1Filtered = {};
      let obj2Filtered = {};

      Object.keys(obj1).forEach(key => {
        if (!matchKeys.includes(key)) {
          obj1Filtered[key] = obj1[key];
          obj2Filtered[key] = obj2[key];
        }
      });

      deepCompare(obj1Filtered, obj2Filtered);

      console.table(result);

      // In ra các phần tử không tương ứng
      // console.table(result.filter((r) => r.matchResult === "❌"));
    } else {
      // Nếu không tìm thấy Object tương ứng trong arr2
      result.push({
        matchedBy: matchKeys
          .map(k => obj1[k] !== undefined ? `${k}: ${obj1[k]}` : null)
          .filter(v => v !== null)
          .join(', '),
        message: "❌ Không tìm thấy Object tương ứng"
      });
    }
  });

  return result;
};

module.exports = { compareArrayObjects };

// // Dữ liệu mẫu để kiểm thử
// const arr1 = [
//   {
//     "exchange": "ASX1",
//     "symbol": "ANZ",
//     "depth": {
//       "ask": {
//         "0": {
//           "symbol": "ANZ",
//           "side": "Bid",
//           "quantity": 98,
//           "number_of_trades": 1,
//           "price": 0.047,
//           "exchanges": "ASX1"
//         },
//         "1": {
//           "symbol": "ANZ",
//           "side": "Bid",
//           "quantity": 11,
//           "number_of_trades": 1,
//           "price": 0.046,
//           "exchanges": "ASX1"
//         }
//       },
//       "bid": {
//         "0": {
//           "symbol": "ANZ",
//           "side": "Bid",
//           "quantity": 96,
//           "number_of_trades": 1,
//           "price": 0.047,
//           "exchanges": "ASX1"
//         },
//         "1": {
//           "symbol": "ANZ",
//           "side": "Bid",
//           "quantity": 20,
//           "number_of_trades": 1,
//           "price": 0.046,
//           "exchanges": "ASX1"
//         }
//       },
//       "total_ask_size": 498,
//       "total_bid_size": 409
//     },
//     "quote": {
//       "exchange": "ASX1",
//       "symbol": "ANZ",
//       "ask_price": 0.047,
//       "ask_size": 98,
//       "bid_price": 0.047,
//       "bid_size": 96,
//       "change_percent": 0,
//       "change_point": 0,
//       "close": 29,
//       "open": 85,
//       "trade_price": 61,
//       "trade_size": 29,
//       "updated": 1730091404,
//       "volume": 85,
//       "previous_close": 11,
//       "value_traded": 74,
//       "indicative_price": null,
//       "open_interest": null,
//       "implied_volatility": null,
//       "break_even": null,
//       "break_even_percent": null,
//       "in_the_money": null,
//       "delta": null,
//       "vega": null,
//       "theta": null,
//       "gamma": null,
//       "rho": null,
//       "5d_change_percent": null,
//       "price_lower_1": null,
//       "price_lower_2": null,
//       "price_higher_1": null,
//       "price_higher_2": null,
//       "long_lower_1": null,
//       "long_lower_2": null,
//       "long_higher_1": null,
//       "long_higher_2": null,
//       "short_lower_1": null,
//       "short_lower_2": null,
//       "short_higher_1": null,
//       "short_higher_2": null,
//       "number_of_trades": 50304,
//       "market_cap": null,
//       "theo_price": null,
//       "iv_change": null,
//       "is_closed_price_updated": true,
//       "pnl_price_type": "CLOSE"
//     },
//     "trades": {
//       "965663ad-a52d-4b7b-b2c9-7f48fda92888": {
//         "price": 1,
//         "quantity": 1,
//         "id": 1740146648364,
//         "time": 1730091404
//       },
//       "47867d49-cdbe-4c65-a2a2-3e63613f88ff": {
//         "price": 1,
//         "quantity": 1,
//         "id": 1740149164896,
//         "time": 1730091404
//       }
//     }
//   }
// ]
// const arr2 = [
//   {
//     "exchange": "ASX1",
//     "symbol": "ANZ",
//     "quote": {
//       "exchange": "ASX1",
//       "symbol": "ANZ",
//       "ask_price": 0.047,
//       "ask_size": 196,
//       "bid_price": 0.047,
//       "bid_size": 192,
//       "close": 0,
//       "high": null,
//       "low": null,
//       "open": 0,
//       "trade_price": 61,
//       "trade_size": 29,
//       "updated": 1730091404,
//       "volume": 170,
//       "previous_close": 0.0202,
//       "value_traded": 148,
//       "indicative_price": null,
//       "auction_volume": null,
//       "surplus_volume": null,
//       "side": null,
//       "open_interest": null,
//       "implied_volatility": null,
//       "break_even": null,
//       "break_even_percent": null,
//       "in_the_money": null,
//       "delta": null,
//       "vega": null,
//       "theta": null,
//       "gamma": null,
//       "rho": null,
//       "5d_change_percent": null,
//       "price_lower_1": null,
//       "price_lower_2": null,
//       "price_higher_1": null,
//       "price_higher_2": null,
//       "long_lower_1": null,
//       "long_lower_2": null,
//       "long_higher_1": null,
//       "long_higher_2": null,
//       "short_lower_1": null,
//       "short_lower_2": null,
//       "short_higher_1": null,
//       "short_higher_2": null,
//       "number_of_trades": 100608,
//       "market_cap": null,
//       "theo_price": null,
//       "iv_change": null,
//       "change_point": 60.9798,
//       "change_percent": 301880.198019802,
//       "vwap": 0.8705882352941177
//     },
//     "depth": {
//       "ask": {
//         "0": {
//           "symbol": "ANZ",
//           "side": "Bid",
//           "quantity": 98,
//           "number_of_trades": 1,
//           "price": 0.047,
//           "exchanges": "ASX1"
//         },
//         "1": {
//           "symbol": "ANZ",
//           "side": "Bid",
//           "quantity": 11,
//           "number_of_trades": 1,
//           "price": 0.046,
//           "exchanges": "ASX1"
//         }
//       },
//       "bid": {
//         "0": {
//           "symbol": "ANZ",
//           "side": "Bid",
//           "quantity": 192,
//           "number_of_trades": 2,
//           "price": 0.047,
//           "source": "MIX"
//         },
//         "1": {
//           "symbol": "ANZ",
//           "side": "Bid",
//           "quantity": 40,
//           "number_of_trades": 2,
//           "price": 0.046,
//           "source": "MIX"
//         }
//       },
//       "total_ask_size": 0,
//       "total_bid_size": 818
//     },
//     "trades": {
//       "3d8995c9-fcd9-436c-88c8-c0a30f942567": {
//         "price": 1,
//         "quantity": 1,
//         "id": 1740146648364,
//         "time": 1730091404,
//         "source": "ASX"
//       },
//       "1c408143-99cb-4e39-aa04-ee8b30763095": {
//         "price": 1,
//         "quantity": 1,
//         "id": 1740149164896,
//         "time": 1730091404,
//         "source": "ASX"
//       }
//     }
//   }
// ]

// // // So sánh theo key "exchange" và "symbol"
// const result = compareArrayObjects(arr1, arr2, ['exchange', 'symbol']);
// console.table(result);


