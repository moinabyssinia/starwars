const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const axios = require('axios');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate); 
app.use(express.static("public")); // to locate css and other files




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

// people detail route
app.get('/people/:name', async (req, res) => {
    const name = req.params.name;
    console.log(name);
    const starWarPeople = await axios.get(`https://swapi.dev/api/people/?search=${name}`);
    const peopleDetail = starWarPeople.data.results;
    res.render('peopleDetail', { peopleDetail })
})


app.listen(1990, () => {
    console.log("app running on port 1990");
})