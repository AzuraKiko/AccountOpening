const { wrapText } = require("../common/trundicate");

const Table = require('cli-table3');

const loggerFailType = (result) => {
    const table = new Table({
        head: ['Auseix Field', 'Auseix Value', "Expected Type", 'Type Valid'],
        colWidths: [60, 60, 30, 30],
        wordWrap: true
    });

    result
        .filter(row => row["Type Valid"].includes('❌')) // Chỉ lấy những hàng Type Valid là ❌
        .forEach(row => {
            table.push([
                wrapText(row["Auseix Field"], 60),
                wrapText(row["Auseix Value"], 60),
                wrapText(row["Expected Type"], 30),
                row["Type Valid"]
            ]);
        });

    if (table.length > 0) {
        console.log(table.toString());
    } else {
        console.log("All Type Valid checks passed!");
    }
};

const loggerFailMatch = (result) => {
    const table = new Table({
        head: ['Auseix Field', 'Equix Field','Auseix Value', 'Equix Value', 'Match Result'],
        colWidths: [50, 50, 50, 50, 10],
        wordWrap: true
    });

    result
        .filter(row => row["Match Result"].includes('❌')) // Chỉ lấy những hàng Match Result là ❌
        .forEach(row => {
            table.push([
                wrapText(row["Auseix Field"], 50),
                wrapText(row["Equix Field"], 50),
                wrapText(row["Auseix Value"], 50),
                wrapText(row["Equix Value"], 50),
                row["Match Result"]
            ]);
        });

    if (table.length > 0) {
        console.log(table.toString());
    } else {
        console.log("All Match Result checks passed!");
    }
};

module.exports = { loggerFailType, loggerFailMatch };

