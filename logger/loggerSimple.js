
const { wrapText } = require("../common/trundicate");

const loggerSimpleMatch = (result) => {
    result.forEach(row => {
        console.log('--------------------------');
        console.log('Auseix Field:', wrapText(row["Auseix Field"], 50));
        console.log('Equix Field:', wrapText(row["Equix Field"], 50));
        console.log('Auseix Value:', wrapText(row["Auseix Value"], 20));
        console.log('Equix Value:', wrapText(row["Equix Value"], 20));
        console.log('Match Result:', wrapText(row["Match Result"], 20));
    });
    console.log('--------------------------');
};

module.exports = { loggerSimpleMatch };
