const excelJs = require("exceljs");
const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");


async function scrapeJobs() {
    try{
      const response = await axios.get("https://www.quikr.com/jobs/job+zwqxj1519612219");
       const $ = cheerio.load(response.data);
       const jobs =[];

     $(".jsListItems").each((index,element)=>{
         $(element).find(".job-card").each((index,job)=>{
              const title = $(job).find(".job-title").text();
              const city = $(job).find(".city b").text();
              const company = $(job).find(".attributeVal.cursor-default").text();
              const type = $(job).find(".m-salary .attributeVal").text()
              const postDate = $(job).find(".jsPostedOn").text().split(",")[0]
              const monthlyPay = $(job).find(".perposelSalary.attributeVal").text()

             if(title && city && company && type && postDate && monthlyPay){
                jobs.push({title , city , company , type , postDate , monthlyPay})
             }
         });
       
     })
      return jobs;

    }catch(err){
        console.log(err);
        return [];
    }
}

async function saveToExcel(jobs) {
    let workbook = new excelJs.Workbook();
    let worksheet = workbook.addWorksheet();

    worksheet.columns = [
        { header: 'Job Title', key: 'title', width: 30 },
        { header: 'City', key: 'city', width: 15 },
        { header: 'Company', key: 'company', width: 15 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Post Date', key: 'postDate', width: 15 },
        { header: 'Monthly Payment', key: 'monthlyPay', width: 15 },
    ];

    jobs.forEach((job)=>{
         worksheet.addRow(job)
    })
    await workbook.xlsx.writeFile("jobs.xlsx")
    console.log('Data saved to products.xlsx');
}


async function main() {
    try{
       const jobs = await scrapeJobs();
       await saveToExcel(jobs)
    }catch(err){
        console.log(err)
    }
}
main()