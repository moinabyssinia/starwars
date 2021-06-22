const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const axios = require('axios');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


const PORT = process.env.PORT || 1990;

app.engine('ejs', ejsMate); 
app.use(express.static("public")); // to locate css and other files




// home page route
app.get('/', (req, res) => {
    res.render('home')
})

// films route
app.get('/films', async (req, res) => {

    const starWarsFilms = await axios.get(`https://swapi.dev/api/films/`)
    // console.log(tvDat.data);
    const filmDat = starWarsFilms.data.results;
    
    res.render('films', { filmDat });
})

// people route
app.get('/people', async (req, res) => {

    // use a base url to request people
    baseURL = "https://swapi.dev/api/people/"

    let starWarsPeople = await axios.get(baseURL);
    let peopleDat = [];
    peopleDat.push(starWarsPeople.data.results);
    let nextPageURL = starWarsPeople.data.next;
    // console.log(nextPageURL);

    while(nextPageURL){
        starWarsPeople = await axios.get(nextPageURL);
        const data = starWarsPeople.data.results;
        // console.log(data);
        // console.log(data.length);
        peopleDat.push(data)

        nextPageURL = starWarsPeople.data.next;
        console.log(nextPageURL);

    }
    console.log(peopleDat.length);

    res.render('people', { peopleDat });
})

// vehicles route
app.get('/vehicles', async (req, res) => {
    const baseURL = "https://swapi.dev/api/vehicles/";

    let starWarsVehicle = await axios.get(baseURL);
    let vehicleDat = [];
    vehicleDat.push(starWarsVehicle.data.results);
    let nextPageURL = starWarsVehicle.data.next;
    // console.log(nextPageURL);

    while(nextPageURL){
        starWarsVehicle = await axios.get(nextPageURL);
        const data = starWarsVehicle.data.results;
        // console.log(data);
        // console.log(data.length);
        vehicleDat.push(data)

        nextPageURL = starWarsVehicle.data.next;
        console.log(nextPageURL);

    }
    console.log(vehicleDat.length);

    res.render('vehicles', { vehicleDat });
})


// people detail route
app.get('/people/:name', async (req, res) => {
    const name = req.params.name;
    console.log(name);
    const starWarPeople = await axios.get(`https://swapi.dev/api/people/?search=${name}`);
    const peopleDetail = starWarPeople.data.results;
    console.log(peopleDetail);


    // get film details this character was in
    const filmUrl = peopleDetail[0].films;
    console.log(filmUrl);

    let filmSilo = [];
    for (let url of filmUrl) {
        const filmDat = await axios.get(url);
        const filmTitle = filmDat.data.title;
        console.log(filmTitle);
        filmSilo.push(filmTitle);
    }

    // get vehicles this character piloted
    const vehicleUrl = peopleDetail[0].vehicles;
    console.log(vehicleUrl);

    let vehicleSilo = [];
    for (let url of vehicleUrl) {
        const vehicleDat = await axios.get(url);
        const vehicleTitle = vehicleDat.data.name;
        console.log(vehicleTitle);
        vehicleSilo.push(vehicleTitle);
    }
    console.log(vehicleSilo);

    res.render('peopleDetail', { peopleDetail, filmSilo, vehicleSilo })
})

// films detail route - use search based on the name of the film
app.get('/films/:filmName', async (req, res) => {
    const filmTitle = req.params.filmName;
    console.log(filmTitle);
    const filmDat = await axios.get(`https://swapi.dev/api/films/?search=${filmTitle}`);
    const filmDatClean = filmDat.data.results[0];
    
    // get character/people data
    const people = filmDat.data.results[0].characters;
    const peopleList = [];
    for (let peopleUrl of people) {
        const peopleDat = await axios.get(peopleUrl);
        const peopleName = peopleDat.data.name;
        peopleList.push(peopleName);
    }


    console.log(peopleList);

    res.render('filmDetail', { filmDatClean, peopleList });
})

// vehicles detail router
app.get('/vehicles/:vehicleName', async (req, res) => {
    const vehicleName = req.params.vehicleName;
    console.log(vehicleName);
    const vehicleDat = await axios.get(`https://swapi.dev/api/vehicles/?search=${vehicleName}`);
    const vehicleDatClean = vehicleDat.data.results[0];

    console.log(vehicleDatClean);

    // get pilot/people data
    const pilots = vehicleDat.data.results[0].pilots;

    const pilotList = [];
    for (let pilotUrl of pilots) {
        const pilotDat = await axios.get(pilotUrl);
        const pilotName = pilotDat.data.name;
        pilotList.push(pilotName);
    }

    // get film data
    const films = vehicleDat.data.results[0].films;

    const filmList = [];
    for (let filmUrl of films) {
        const filmDat = await axios.get(filmUrl);
        console.log(filmDat);
        const filmName = filmDat.data.title;
        filmList.push(filmName);
    }


    console.log(filmList);

    res.render('vehicleDetail', { vehicleDatClean, pilotList, filmList });
})


app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
})