
const request= require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
function processScoreCard(url){
    request(url,cb);
}
function cb(err,response,html){
    if(err){
        console.log(err);
    }else{
        //console.log(response);
        extractMatchDetails(html);
    }
}
function extractMatchDetails(html){
    //.header-info .description - venue
    //.event .status-text
   let $ = cheerio.load(html);
   let descElem = $(".header-info .description");
   let result = $(".event .status-text");
   //console.log(descElem.text());
   //we only need venue and date so split on ,
   let stringArr = descElem.text().split(",");
   let venue = stringArr[1].trim();
   let date = stringArr[2].trim();
   result = result.text();
   let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
   
   //let htmlString = "";
   for(let i = 0;i<innings.length;i++){
       //htmlString =$(innings[i]).html();
       //to find team opponent
       let teamname = $(innings[i]).find("h5").text(); 
       teamname = teamname.split("INNINGS")[0].trim();
       let opponentIndex = i==0 ? 1 : 0;
       let opponentName = $(innings[opponentIndex]).find("h5").text();
       opponentName = opponentName.split("INNINGS")[0].trim();
       //console.log(teamname , " " , opponentName ,"  " ,  venue , " " , date , " " , result );
       let cInnings = $(innings[i]);
       let allRows = cInnings.find(".table.batsman tbody tr");
       for(let j = 0 ;j<allRows.length;j++){
          let allCols =  $(allRows[j]).find("td");
          let isWorthy = $(allCols[0]).hasClass("batsman-cell");//we have some unnecessary tds so we need to find which we actually need 
          if(isWorthy==true){
            //console.log(allCols.text());
              let playerName = $(allCols[0]).text().trim();
              let runs = $(allCols[2]).text().trim();
              let balls = $(allCols[3]).text().trim();
              let fours =$(allCols[5]).text().trim();
              let sixes =$(allCols[6]).text().trim();
              let sr =$(allCols[7]).text().trim();

              console.log(runs);
              processPlayer(teamname , playerName , runs , balls , fours ,sixes , sr , opponentName , venue , date , result);
          }
       }
   }
   //console.log(htmlString);
}
function processPlayer(teamname , playerName , runs , balls , fours ,sixes , sr , opponentName , venue , date , result){
    let teamPath = path.join(__dirname,"ipl" , teamname);
    dirCreater(teamPath);
    let filePath = path.join(teamPath , playerName + ".xlsx");
    let content = excelReader(filePath,playerName);
    let playerObj = {
        teamname,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        result
    }
   content.push(playerObj);
   excelWriter(filePath , content , playerName);
}
function dirCreater(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
 }
 function excelWriter(filePath, json , sheetName){
    let newWB = xlsx.utils.book_new(); //makes a new workbook
    let newWS = xlsx.utils.json_to_sheet(json);//add sheet to new workbook
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName);
    xlsx.writeFile(newWB,filePath);
}

function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }  
    let wb = xlsx.readFile(filePath);
    let excel = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excel);
    return ans;

}
module.exports = {
    ps:processScoreCard
}