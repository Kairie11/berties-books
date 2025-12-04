// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

// Weather route
router.get('/weather', function(req, res, next){
    // If no city is provided, just show the form
    if (!req.query.city) {
        res.render('weather.ejs');
        return;
    }
    
    let apiKey = '118e95cf615538bbe83f6d449dfca0c5'
    let city = req.query.city
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
                 
    request(url, function (err, response, body) {
      if(err){
        next(err)
      } else {
        var weather = JSON.parse(body)
        
        // Check if the weather data is valid
        if (weather !== undefined && weather.main !== undefined) {
            var wmsg = '<p style="font-size: 1.3em; text-align: center; margin-bottom: 20px;">📍 <strong>' + weather.name + ', ' + weather.sys.country + '</strong></p>';
            wmsg += '<p><strong>Weather:</strong> ' + weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1) + '</p>';
            wmsg += '<p><strong>Temperature:</strong> ' + weather.main.temp + '°C</p>';
            wmsg += '<p><strong>Feels like:</strong> ' + weather.main.feels_like + '°C</p>';
            wmsg += '<p><strong>Humidity:</strong> ' + weather.main.humidity + '%</p>';
            wmsg += '<p><strong>Pressure:</strong> ' + weather.main.pressure + ' hPa</p>';
            wmsg += '<p><strong>Wind Speed:</strong> ' + weather.wind.speed + ' m/s</p>';
            wmsg += '<p><strong>Wind Direction:</strong> ' + weather.wind.deg + '°</p>';
            wmsg += '<p><strong>Cloudiness:</strong> ' + weather.clouds.all + '%</p>';
            wmsg += '<p><strong>Visibility:</strong> ' + (weather.visibility / 1000) + ' km</p>';
            
            res.render('weather.ejs', { weatherMessage: wmsg });
        }
        else {
            res.render('weather.ejs', { error: 'No data found. City not found or invalid city name. Please try again.' });
        }
      }
    });
});

// Export the router object so index.js can access it
module.exports = router