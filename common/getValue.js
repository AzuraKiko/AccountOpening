// Hàm lấy giá trị từ object, hỗ trợ đường dẫn key kiểu `a.b[0].c`
const getValueArray = (obj, key) => {
  return key.split(".").reduce((acc, k) => {
    if (!acc) return undefined;
    const match = k.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      const [, arrayKey, index] = match;
      return acc[arrayKey] && acc[arrayKey][index] !== undefined
        ? acc[arrayKey][index]
        : undefined;
    }
    return acc[k] !== undefined ? acc[k] : undefined;
  }, obj);
};

// Hàm lấy giá trị từ object, hỗ trợ đường dẫn key kiểu `a.b.c`
const getValueObject = (obj, key) => {
  return key.split('.').reduce((acc, k) => acc ? acc[k] : undefined, obj);
};

module.exports = { getValueArray, getValueObject };