const { truncateStringEnd, truncateStringStart, wrapText } = require("../common/trundicate");
// // Logger table check type
// const loggerTableType = (result) =>
//     console.table(
//         result.map((row) => ({
//             "Auseix Field": wrapText(row["Auseix Field"], 50),
//             "Auseix Value": wrapText(row["Auseix Value"], 80),
//             "Type Valid": row["Type Valid"],
//         }))
//     );
// // Logger table check match
// const loggerTableMatch = (result) =>
//     console.table(
//         result.map((row) => ({
//             "Auseix Field": truncateStringStart(row["Auseix Field"], 20),
//             "Auseix Value": truncateStringEnd(row["Auseix Value"], 20),
//             "Equix Value": wrapText(row["Equix Value"], 30),
//             "Equix Field": wrapText(row["Equix Field"], 30),
//             "Match Result": row["Match Result"],
//         }))
//     );

// module.exports = { loggerTableType, loggerTableMatch };

const Table = require('cli-table3');

const loggerTableType = (result) => {
    const table = new Table({
        head: ['Auseix Field', 'Auseix Value', "Expected Type", 'Type Valid'],
        colWidths: [60, 60, 30, 30],
        wordWrap: true
    });

    result.forEach(row => {
        table.push([
            wrapText(row["Auseix Field"], 60),
            wrapText(row["Auseix Value"], 60),
            wrapText(row["Expected Type"], 30),
            row["Type Valid"]
        ]);
    });

    console.log(table.toString());
};

const loggerTableMatch = (result) => {
    const table = new Table({
        head: ['Auseix Field', 'Equix Field','Auseix Value', 'Equix Value', 'Match Result'],
        colWidths: [50, 50, 50, 50, 10],
        wordWrap: true
    });

    result.forEach(row => {
        table.push([
            wrapText(row["Auseix Field"], 50),
            wrapText(row["Equix Field"], 50),
            wrapText(row["Auseix Value"], 50),
            wrapText(row["Equix Value"], 50),
            row["Match Result"]
        ]);
    });

    console.log(table.toString());
};

module.exports = { loggerTableType, loggerTableMatch };
