let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const { Cheerio } = require("cheerio");
const request= require("request");
const cheerio = require("cheerio");
const allmatch = require("./allmatch");
const path = require("path");
const fs = require("fs");


const iplPath = path.join(__dirname , "ipl");

dirCreater(iplPath);
request(url,cb);
function cb(err,response,html){
    if(err){
        console.log(err);
    }else{
        //console.log(response);
        extractLink(html);
    }
}


function extractLink(html){
   let $=  cheerio.load(html);
   let anchorElem =  $("a[data-hover='View All Results']");
   let link = anchorElem.attr("href");
   //console.log(link);
   let fullLink = "https://www.espncricinfo.com" + link;
   //console.log(fullLink);
   allmatch.getAllMatches(fullLink);
}

function dirCreater(filePath){
   if(fs.existsSync(filePath) == false){
       fs.mkdirSync(filePath);
   }
}