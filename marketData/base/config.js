const symbol = "ANZ";
const user = "retail";

module.exports = {
    urlRefresh: "https://dev2-retail-api.equix.app/v1/auth/refresh",

    urlSnapASX: `https://dev2-${user}-api.equix.app/v1/feed-snapshot-aio/price/ASX1/${symbol}`,
    urlDelayASX: `https://dev2-retail-api.equix.app/v1/feed-delayed-snapshot-aio/price/ASX1/${symbol}`,


    urlSnapCXA: `https://dev2-${user}-api.equix.app/v1/feed-snapshot-aio/price/CXA/${symbol}`,
    urlDelayCXA: `https://dev2-retail-api.equix.app/v1/feed-delayed-snapshot-aio/price/CXA/${symbol}`,

    urlSnapAll: `https://dev2-${user}-api.equix.app/v1/feed-snapshot-aio/price/ASX/${symbol}`,
    urlDelayAll: `https://dev2-retail-api.equix.app/v1/feed-delayed-snapshot-aio/price/ASX/${symbol}`,
    deviceID: "26113385-2303-4ed7-aec0-bb865a432d1d",

    urlRealtimeASX: `https://dev2-market-feed.equix.app/v1/price/${symbol}.ASX1`,
    urlRealetimeCXA: `https://dev2-market-feed.equix.app/v1/price/${symbol}.CXA`,
    urlRealtimeAll: `https://dev2-market-feed.equix.app/v1/price/${symbol}.ASX`,

    
    refreshToken_ASX: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodXllbi50cmFuYXN4QGVxdWl4LmNvbS5hdSIsInN1YiI6ImVxMTc0MDIwNjQ1NTAyNyIsInNlc3Npb25faWQiOiI0NmJmY2YyYi1kZTgwLTQ1NjItOTU0Zi0yYzNjMDUwZjFmNjUiLCJleHAiOjE3NzE3NDI3NDQuMTQyLCJpYXQiOjE3NDAyMDY3NDR9.N0ZJSikCJp4WWa8TW41FeDyyGPt17VT_4Undwy0Kbfo",

    refreshToken_CXA: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodXllbi50cmFuY3hhQGVxdWl4LmNvbS5hdSIsInN1YiI6ImVxMTc0MDIwNjgxNzcxNSIsInNlc3Npb25faWQiOiI0MjMzOGIwMy0yOGFkLTRlYjMtYWRkYS04MDc2ZjExZmY2MTciLCJleHAiOjE3NzE3NDM3NDkuOTcsImlhdCI6MTc0MDIwNzc0OX0.4e_KLmx0kKNmju8qPGvtWUHTZhtDJWQ5ZimXDRATz1U",

    refreshToken_ASX_CXA: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodXllbi50cmFuYXN4X2N4YUBlcXVpeC5jb20uYXUiLCJzdWIiOiJlcTE3NDAyMDY4NzMwNDAiLCJzZXNzaW9uX2lkIjoiYjJlZjRmZTgtNWQ3YS00Y2M1LTgxMzQtMmZhZWViOWE1YjUxIiwiZXhwIjoxNzcxNzQzNzQyLjk2MywiaWF0IjoxNzQwMjA3NzQyfQ.xmacSVdqlG0CeZdXlqEpqYCNKg7f75GDTO9_Ocl-tho",

    refreshToken_ASX_Delay: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodXllbi5uZ3V5ZW4zQGVxdWl4LmNvbS5hdSIsInN1YiI6ImVxMTc0MDExMTMyNzU1NiIsInNlc3Npb25faWQiOiIwMjUwZWFlMi1mODIyLTQ5ZjgtODMxNy0zYTZhNDU2MGI0ZDkiLCJleHAiOjE3NzE2ODcwMDUuNzksImlhdCI6MTc0MDE1MTAwNX0.Gydnl2MBIKlDE08hQ7xI3ZWT9xAzrJZxkH8m17Z3Sdk",

    refreshToken_CXA_Delay: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodXllbi5uZ3V5ZW4yQGVxdWl4LmNvbS5hdSIsInN1YiI6ImVxMTc0MDExMTI5MTA0OSIsInNlc3Npb25faWQiOiI1YjFhZmI1OS01ZjZhLTQxNzUtOWM3ZS1iNWQwN2VmNzVkNzMiLCJleHAiOjE3NzE3OTQyODEuMDcxLCJpYXQiOjE3NDAyNTgyODF9.p3TG1mMVDz2vLS4-OE-A3l2OdnylCYf-5IJMtJSIXFo",

    refreshToken_ASX_CXA_Delay: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodXllbi5uZ3V5ZW4xQGVxdWl4LmNvbS5hdSIsInN1YiI6ImVxMTc0MDExMTIyMjcxNiIsInNlc3Npb25faWQiOiJmZDM3ZTdjZC00Y2VkLTQ3ZWYtYTc4NS1iZWMyOWU3OGZhMjQiLCJleHAiOjE3NzE2NTc1ODUuNDgsImlhdCI6MTc0MDEyMTU4NX0.uVexUB0TY7yXzx4vyCcSoSoo4U31vDKpIFMPa04pGaU",

};