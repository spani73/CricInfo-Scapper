let fs = require("fs");
let xlsx = require("xlsx");
//let buffer = fs.readFileSync("./abc.json");
//let data = JSON.parse(buffer);
// data.push({
//     "name" : "tony Stark",
//     "friends" : ["bruce" , "natasha" , "steve"]
// });
// let stringdata = JSON.stringify(data); 
// fs.writeFileSync("abc.json",stringdata);

//excel data 
// let data = require("./abc.json");
// let newWB = xlsx.utils.book_new(); //makes a new workbook
// let newWS = xlsx.utils.json_to_sheet(data);//add sheet to new workbook
// xlsx.utils.book_append_sheet(newWB,newWS,"sheet-1");
// xlsx.writeFile(newWB,"abcd.xlsx");

// function excelWriter(filePath, json , sheetName){
//     let newWB = xlsx.utils.book_new(); //makes a new workbook
//     let newWS = xlsx.utils.json_to_sheet(json);//add sheet to new workbook
//     xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
//     xlsx.writeFile(newWB,filePath);
// }

function excelReader(){
    let wb = xlsx.readFile("./abcd.xlsx");
    let excel = wb.Sheets["sheet-1"];
    let ans = xlsx.utils.sheet_to_json(excel);
    console.log(ans);

}
excelReader();