const http = require ('http');
const fs = require ('fs');
const requests = require('requests');


const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {


    let temperature = tempVal.replace("{%tempval%}", orgVal.list[0].main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.list[0].main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.list[0].main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.list[0].name);
    temperature = temperature.replace("{%country%}", orgVal.list[0].sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.list[0].weather[0].main);



    return temperature;

}
const server = http.createServer((req, res) => {
    if (req.url ="/") {
        requests('http://api.openweathermap.org/data/2.5/find?q=kathmandu&units=metric&appid=c0679a48cef8047ed9698495ddce46c4')
        .on('data',  (chunk) => {
            const objectdata =JSON.parse(chunk);
            const arraydata =[objectdata];
        //   console.log(arraydata[0].main.temp);
            const realTimeData = arraydata.map((val) => replaceVal(homeFile, val))
            .join('');
                 res.write( realTimeData ); 
                // console.log( realTimeData );
        })
        .on('end', (err) => {
          if (err) return console.log('connection closed due to errors', err);
         res.end();
        });
    }

 });

 server.listen(8000, '127.0.0.1');