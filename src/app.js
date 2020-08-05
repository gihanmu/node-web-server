const express = require('express');
const hbs = require('hbs');
const log = console.log;
const path = require('path');
const httpRequest = require('./utils/request');
const app = express();

const API_KEY_OPEN_WEATHER = '10d096a2339f19ff4e4262d369461a2f';
const API_KEY_MAP_BOX = 'pk.eyJ1IjoiZ2loYW5tdSIsImEiOiJja2RjMjcxaWkxY2cxMnhwY2J1d3FhYnAxIn0.bIUcoDOPz4e6acDiPOc--g';



const publicDirectory = path.join(__dirname, '../public');
const viewsDirectory = path.join(__dirname, '../templates/views');
const partialsDirectory = path.join(__dirname, '../templates/partials');


app.set('view engine', 'hbs');
app.set('views', viewsDirectory);
hbs.registerPartials(partialsDirectory);

log(publicDirectory);
app.use(express.static(publicDirectory));

app.listen('3000', () => {
    log('Listening on port 3000');
});

app.get('', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        user: 'Gihanmu'
    })
})

app.get('/weather', (req, res) => {
    console.log('here')
    if (!req.query.address) res.send({error: 'No address found'});

    
geocode(req.query.address, (coordinates) => {
    log('coordinates', coordinates);

    forecast(coordinates.latitude, coordinates.longitude, (forecast) => {
        res.send({forecast});
    });
})
   
});

app.get('*', (req, res) => {
    res.render('404');
});



const logError = (error) => {
    console.log('Error', error);
}



const geocode = (address, success) => {
    httpRequest(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${API_KEY_MAP_BOX}`, 
         (error, data) => {
             if (error) logError(error);
             else {
                const res = JSON.parse(data); 
                success(
                    {
                        latitude: res.features[0].center[1], 
                        longitude: res.features[0].center[0], 
                        location: res.features[0].place_name
                    }
                );
             }
         }
    );
    
};

const forecast = (lat, lon, callback) => {
    httpRequest(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${API_KEY_OPEN_WEATHER}`,
        (error, data) => {
            if (error) logError(error);
            else {
                const res = JSON.parse(data); 
                callback({ forecast : res.current});
            }
        }
    )
}


