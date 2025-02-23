// Import EventSource từ thư viện eventsource
const EventSource = require('eventsource');

function streamLatestResponse(url, token) {
  const latestResponses = {};

  // Thêm token vào URL do EventSource không hỗ trợ headers
  const requestUrl = `${url}?access_token=${token}`;

  const eventSource = new EventSource(requestUrl);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const type = data.type;

      // Lưu lại response mới nhất theo type
      latestResponses[type] = data;

      console.log('Dữ liệu mới nhất:', latestResponses[type]);
    } catch (error) {
      console.error('Lỗi khi parse dữ liệu:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('Có lỗi xảy ra:', error);
  };

  // Để lấy response mới nhất theo type
  function getLatestResponseByType(type) {
    return latestResponses[type] || null;
  }

  // Để lấy tất cả response mới nhất
  function getAllLatestResponses() {
    return latestResponses;
  }

  return {
    getLatestResponseByType,
    getAllLatestResponses
  };
}

module.exports = { streamLatestResponse };

// Sử dụng hàm:
const url1 = 'https://dev2-market-feed.equix.app/v1/price/ANZ.ASX';
const token1 = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodXllbi50cmFuYXN4QGVxdWl4LmNvbS5hdSIsInN1YiI6ImVxMTc0MDIwNjQ1NTAyNyIsImV4cCI6MTc0MDI3OTM1Ni40MzcsImRldmljZV9pZCI6IjI2MTEzMzg1LTIzMDMtNGVkNy1hZWMwLWJiODY1YTQzMmQxZCIsImlhdCI6MTc0MDI3ODE1Nn0.O9le2o8OnhiIbZquCSPhzOTcwtmrdLCf4zg68sl2uyWl4Xdfz4zfoFSEligXftOniWkHdfg3JokKiHqa-3lMVHuiSiMRAzqa6rvZ2R6uMFl8YnqeiiwgI9qs5_YZi9qBIZfbu4jiPWYV_bJVm9ZWjPjrLUKPX2dIGjWn_7M5z2s3yriQf_o35MYpUu2D8aEov4NB_Jw4Kzgrjdlwf0iYUJiINoaW_T-ypRpR3xEq-kkXMsGKiAU8lhp2EiH9ZXIegoA_vLRCy7jJQSwONW0_b9Uat1lyfUfV-cl6ClLvYfHzLZv5cyGwN5940682cfC6V18b9gj1Xlc9_dRCuR3bkauM_ph2n2zLMOj4lJTZcBQb8BBsdFFbgBMHAc6nqLlM_wuOH7F7Afojwxi_dnc3MdiACSvGU8SnqkeG_boTs7iHQ91k7yqYFklgsfhKYD7A3aElnm4Phbf3aItJ-pfIJOWIZbiwCieZ06SrbYsjMGs-J5M4620JWnLwQVUxBWkd25DxvOmSzNPDp4hEi2FyIg4m7iX91_jKd6DzmTq52uo5LlqIueaPgSEx1Wovvl-g0YFO4P1MH9NbisLoSzjsqCsAW618w0wbDYgJjFQMUD3-Cf-iMDTTb_d0aD6wIRdyh80fVHBMlEQC_sUghi_9SjoMjqY1bh_YNH-kvc5cotU'; // Thay token của bạn ở đây

const stream = streamLatestResponse(url1, token1);

// Để lấy response mới nhất theo type
setTimeout(() => {
  const latestTrade = stream.getLatestResponseByType('quotes');
  console.log('Response mới nhất cho TRADE:', latestTrade);
}, 5000);
