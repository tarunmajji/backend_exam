const fs = require('fs');

function getData() {
    const data = fs.readFileSync('./data.json');
    return JSON.parse(data);
}

function saveData(newData) {
    fs.writeFileSync('./data.json', JSON.stringify(newData, null, 2));
}

module.exports = {
    getData,
    saveData
};