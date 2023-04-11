const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal ,orgVal) =>{
    let temperature = tempVal.replace("{%temVal%}" , orgVal.main.temp);
     temperature = temperature.replace("{%temminVal%}" , orgVal.main.temp_min);
     temperature = temperature.replace("{%temmaxVal%}" , orgVal.main.temp_max);
     temperature = temperature.replace("{%location%}" , orgVal.name);
     temperature = temperature.replace("{%country%}" , orgVal.sys.country);
     temperature = temperature.replace("{%tempStatus%}" , orgVal.weather[0].main);
     
     return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Mathura&units=metric&appid=fbe4cbb23837ff72b9797dcd08e27d31#", )
            .on('data',  (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                console.log(arrData);
                const realTimeData = arrData.map((val) =>  replaceVal(homeFile, val) ).join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end',  (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end();

                // console.log('end');
            });

    }
});

server.listen(8000,"127.0.0.1");

