const { previousCloses } = require("../dataQuote/previous_close");

// Hàm lấy previous_close từ file previous_close.json
const getPreviousClose = (symbol) => {
    const found = previousCloses.find(item => 
        item.symbol === symbol
    );
    return found ? found.previous_close : null;
};

// Hàm lấy giá trị mặc định nếu undefined hoặc null
const getValueOrDefault = (value, defaultValue = null) =>
    (value !== undefined && value !== null) ? Number(value) : defaultValue;

// Hàm làm tròn 4 chữ số sau dấu thập phân
const roundToFour = (value) =>
    (value !== null && !isNaN(value))
        ? (Math.round(value * 10000) / 10000).toFixed(4)
        : value;

// Hàm lấy giá trị nhỏ nhất hoặc lớn nhất giữa 2 giá trị (min hoặc max)
const getMinOrMax = (val1, val2, type) => {
    if (val1 === null) return val2;
    if (val2 === null) return val1;
    return type === 'min' ? Math.min(val1, val2) : Math.max(val1, val2);
};

// Hàm tổng hợp size nếu giá bằng nhau
const getTotalSize = (price1, size1, price2, size2, compareType) => {
    if (price1 === getMinOrMax(price1, price2, compareType) && price2 === price1) {
        return size1 + size2;
    }
    if (price1 === getMinOrMax(price1, price2, compareType)) {
        return size1;
    }
    if (price2 === getMinOrMax(price1, price2, compareType)) {
        return size2;
    }
    return 0;
};

function getQuote(priceASX, priceCXA) {
    const expected = [];

    // Lấy danh sách unique symbol từ 2 sàn
    const symbols = [...new Set([...priceASX.map(item => item.symbol), ...priceCXA.map(item => item.symbol)])];


    symbols.forEach((symbol) => {
        const dataASX = priceASX.find(item => item.symbol === symbol) || {};
        const dataCXA = priceCXA.find(item => item.symbol === symbol) || {};

        const quoteASX = dataASX.quote || {};
        const quoteCXA = dataCXA.quote || {};

        const getData = (field) => ({
            ASX: getValueOrDefault(quoteASX[field]),
            CXA: getValueOrDefault(quoteCXA[field])
        });

        // Lấy dữ liệu từ 2 sàn
        const askPrice = getData('ask_price');
        const askSize = getData('ask_size');
        const bidPrice = getData('bid_price');
        const bidSize = getData('bid_size');
        const close = getData('close');
        const open = getData('open');
        const high = getData('high');
        const low = getData('low');
        const volume = getData('volume');
        const tradePrice = getData('trade_price');
        const tradeSize = getData('trade_size');
        const valueTraded = getData('value_traded');
        const indicativePrice = getData('indicative_price');
        const auctionVolume = getData('auction_volume');
        const surplusVolume = getData('surplus_volume');
        const numberOfTrades = getData('number_of_trades');
        const previousClose = getPreviousClose(symbol);


        const quote = {
            // exchange: dataASX.exchange || dataCXA.exchange,
            exchange: 'ASX',
            symbol: symbol,
            // ask_price: lấy giá nhỏ nhất từ ask_price của 2 sàn
            ask_price: getMinOrMax(askPrice.ASX, askPrice.CXA, 'min'),

            // ask_size: tổng ask_size của 2 sàn ở cùng mức giá
            ask_size: getTotalSize(askPrice.ASX, askSize.ASX, askPrice.CXA, askSize.CXA, 'min'),

            // bid_price: lấy giá lớn nhất từ bid_price của 2 sàn
            bid_price: getMinOrMax(bidPrice.ASX, bidPrice.CXA, 'max'),

            // bid_size: tổng bid_size của 2 sàn ở cùng mức giá
            bid_size: getTotalSize(bidPrice.ASX, bidSize.ASX, bidPrice.CXA, bidSize.CXA, 'max'),

            // close: giá đóng cửa mới nhất từ 2 sàn
            close: quoteASX.updated > quoteCXA.updated ? close.ASX : close.CXA,

            // high: giá cao nhất từ 2 sàn
            high: getMinOrMax(high.ASX, high.CXA, 'max'),

            // low: giá thấp nhất từ 2 sàn 
            low: getMinOrMax(low.ASX, low.CXA, 'min'),

            // open: giá mở cửa sớm nhất từ 2 sàn
            open: quoteASX.updated < quoteCXA.updated ? open.ASX : open.CXA,

            // trade_price: giá giao dịch mới nhất từ 2 sàn
            trade_price: quoteASX.updated > quoteCXA.updated ? tradePrice.ASX : tradePrice.CXA,

            // trade_size: kích thước giao dịch tương ứng với trade_price mới nhất
            trade_size: quoteASX.updated > quoteCXA.updated ? tradeSize.ASX : tradeSize.CXA,

            // updated: thời gian giao dịch mới nhất
            updated: Math.max(quoteASX.updated, quoteCXA.updated),

            // volume: tổng volume của 2 sàn
            volume: (volume.ASX || 0) + (volume.CXA || 0),

            // previous_close: giá đóng cửa của ngày trước
            previous_close: previousClose,

            // value_traded: tổng giá trị giao dịch của 2 sàn
            value_traded: (valueTraded.ASX || 0) + (valueTraded.CXA || 0),

            // indicative_price: giá indicative mới nhất từ 2 sàn
            indicative_price: quoteASX.updated > quoteCXA.updated ? indicativePrice.ASX : indicativePrice.CXA || null,

            // auction_volume: auction_volume mới nhất từ 2 sàn
            auction_volume: quoteASX.updated > quoteCXA.updated ? auctionVolume.ASX : auctionVolume.CXA || null,

            // surplus_volume: surplus_volume mới nhất từ 2 sàn
            surplus_volume: quoteASX.updated > quoteCXA.updated ? surplusVolume.ASX : surplusVolume.CXA || null,

            // side: lấy side của sàn có indicative_price mới nhất  
            side: quoteASX.updated > quoteCXA.updated ? quoteASX.side : quoteCXA.side || null,


            // Các field không có giá trị hoặc mặc định là null
            open_interest: null,
            implied_volatility: null,
            break_even: null,
            break_even_percent: null,
            in_the_money: null,
            delta: null,
            vega: null,
            theta: null,
            gamma: null,
            rho: null,
            ['5d_change_percent']: null,
            price_lower_1: null,
            price_lower_2: null,
            price_higher_1: null,
            price_higher_2: null,
            long_lower_1: null,
            long_lower_2: null,
            long_higher_1: null,
            long_higher_2: null,
            short_lower_1: null,
            short_lower_2: null,
            short_higher_1: null,
            short_higher_2: null,
            // number_of_trades: tổng number_of_trades của 2 sàn
            number_of_trades: (numberOfTrades.ASX || 0) + (numberOfTrades.CXA || 0),
            market_cap: null,
            theo_price: null,
            iv_change: null,
            is_closed_price_updated: quoteASX?.is_closed_price_updated ?? quoteCXA?.is_closed_price_updated ?? null,
            pnl_price_type: quoteASX?.pnl_price_type ?? quoteCXA?.pnl_price_type ?? null,
        };

        // Tính toán change_point và change_percent sau khi khởi tạo quote
        quote.change_point = roundToFour(quote.trade_price - quote.previous_close);
        quote.change_percent = (quote.previous_close > 0) ? roundToFour((quote.change_point / quote.previous_close) * 100) : 0;

        // vwap: tính trung bình gia quyền của 2 sàn
        quote.vwap = quote.volume === 0 ? null : quote.value_traded === null ? null : quote.value_traded / quote.volume,

            expected.push(quote);
    });

    return expected;
};

module.exports = { getQuote };