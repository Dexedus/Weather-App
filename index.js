import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import 'dotenv/config' 

const app = express();
const port = 3000;
const apiKey = process.env.Key;


app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) =>{
    res.render("index.ejs")
})


app.post("/submit", async (req, res) =>{

    console.log(req.body["location"]);

    try{
        const place = await axios.get("http://api.openweathermap.org/geo/1.0/direct?q="+req.body["location"]+"&limit=5&appid="+apiKey)
        const lat = JSON.stringify(place.data[0].lat)
        const lon = JSON.stringify(place.data[0].lon)
        const result = await axios.get("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&appid="+apiKey);

        res.render("index.ejs", {
            temp: JSON.stringify(result.data.main.temp),
            location: JSON.stringify(result.data.name),
            light: JSON.stringify(result.data.visibility),
            weather: JSON.stringify(result.data.weather[0].main),
        });
    } catch (error){
        console.log(error);
        res.status(500);
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });