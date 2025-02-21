const eql = require('lodash').isEqual;
// So sánh các phần tử trong mảng không quan tâm thứ tự
const compareArrays = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;
 
    // Xác định giá trị so sánh và trạng thái match   
    const normalizeObject = (obj) => {
        if (Array.isArray(obj)) return obj.map(normalizeObject).sort();
        if (typeof obj === "object" && obj !== null) {
            return Object.keys(obj)
                .sort()
                .reduce((acc, key) => {
                    acc[key] = normalizeObject(obj[key]);
                    return acc;
                }, {});
        }
        return obj;
    };

    const normalizedArr1 = arr1.map(normalizeObject);
    const normalizedArr2 = arr2.map(normalizeObject);

    return normalizedArr1.every((item1) =>
        normalizedArr2.some((item2) => eql(item1, item2))
    );
};

module.exports = { compareArrays };