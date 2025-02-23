const compareObjects = (obj1, obj2) => {
    let result = [];

    // Lấy danh sách các key có chung giữa obj1 và obj2
    let commonKeys = Object.keys(obj1).filter(key => Object.keys(obj2).includes(key));

    // So sánh từng key chung
    commonKeys.forEach(key => {
        result.push({
            fieldName: key,
            compareValue: obj1[key],      // Giá trị của obj1
            expectedValue: obj2[key],     // Giá trị của obj2
            matchResult: obj1[key] === obj2[key] ? "✅" : "❌"
        });
    });

    return result;
};

module.exports = { compareObjects };
