const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const axios = require('axios');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate); 
app.use(express.static("public")); // to locate css and other files





app.get('/films', async (req, res) => {

    const tvDat = await axios.get(`https://swapi.dev/api/films/`)
    // console.log(tvDat.data);
    const filmDat = tvDat.data.results;
    
    res.render('home', { filmDat });
})




app.listen(1990, () => {
    console.log("app running on port 1990");
})