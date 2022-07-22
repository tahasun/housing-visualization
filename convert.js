const csvToJson = require('convert-csv-to-json');
 
const input = './data/california_houses.csv'; 
const output = './public/houses.json';
 
csvToJson.fieldDelimiter(',').formatValueByType().generateJsonFileFromCsv(input, output);