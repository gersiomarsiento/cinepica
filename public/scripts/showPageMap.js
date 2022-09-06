mapboxgl.accessToken = mapToken;
const countryCodes = filmCountries.map(film=>film.shortName)
console.log(filmCountries)
const colorsForCountries = [
    "#FF89FF",
    "#E73AE4",
    "#B816C4",
    "#970BB3",
    "#560778",
    "#350663"
]
const colorFilmsByCountry = []
for (let country of filmCountries){
    colorFilmsByCountry.push(new Array(country.shortName, ( country.count > 5 ? colorsForCountries[5] : colorsForCountries[country.count-1] )))
}

const map = new mapboxgl.Map({  // Base map
    container: 'map', // container ID
    style: 'mapbox://styles/gersiomarsiento/cl7e3oice005114p9vt3za77p', // style URL
    center: [-30, 15], // starting position [lng, lat]
    zoom: 1.6, // starting zoom
    projection: 'mercator',
});

map.addControl(new mapboxgl.NavigationControl())

map.on("load", () => { //Layer for countries that have films
    // Set a layer so country names sit on top
    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    let firstSymbolId;
    for (const layer of layers) {
        if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
        }
    }

    map.addSource("country-boundaries", {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
    })

    map.addLayer({
        "id": "countries",
        "source": "country-boundaries",
        "source-layer": "country_boundaries",
        "type": "fill",
        "filter": [
            "in",
            [
            "get",
            "iso_3166_1_alpha_3"
            ],
            ["literal", countryCodes]
        ],
        "paint": {
            'fill-opacity': .7,
            'fill-color':  {
                property: "iso_3166_1_alpha_3",
                type: "categorical",
                default: "#f08",
                stops: [
                    ...colorFilmsByCountry
                ]
            }
        }        
    }, firstSymbolId);
});

// When a click event occurs on a feature in the countries layer,
// open a popup at the location of the click, with description
// HTML from the click event's properties.
const popUpMarkup = (e)=>{ // Find and display country name through 3 letters code
    return `<h3>`+ filmCountries.find(film => film.shortName == (e.features[0].properties.iso_3166_1_alpha_3)).name +`</h3><br>`
}
let amountOfFilms = 0;
const popUpFilmsList = (e)=>{ //Find all films by country, store the html and hide all
    const data = filmCountries.find(film => film.shortName == (e.features[0].properties.iso_3166_1_alpha_3));
    const filmsHtml = [];
    console.log(data)

    amountOfFilms = data.filmsList.length;
    for (let film of data.filmsList){
        const html = `<div class="film-html"><h3>`+ film.title.toUpperCase() + `</h3><div class="map-scroll-container"><span class="map-scroll map-scroll-left"><i class="fa-solid fa-arrow-left"></i></span><a href="/films/`+ film.id +`"><img src="`+ film.image1 +`"></a><span class="map-scroll map-scroll-right"><i class="fa-solid fa-arrow-right"></i></span></div></div>`
        filmsHtml.push(html)
    }
    return filmsHtml.join("")
}    

const setPopupListeners = () =>{ //create event listeners for buttons to access other country's films
    document.querySelectorAll(".map-scroll-right").forEach(
        (e)=>e.addEventListener('click', nextFilm)
    );
    document.querySelectorAll(".map-scroll-left").forEach(
        (e)=>e.addEventListener('click', prevFilm)
    );
}

let currentFilm = 1; // Store current film displayed

const nextFilm = () => { 
    if(amountOfFilms>currentFilm){
        currentFilm++;  
    } else {
        currentFilm = 1;
    }
    document.querySelector(".display-block").classList.remove("display-block");
    document.querySelector(`.film-html:nth-child(${currentFilm+2})`).classList.add("display-block");
}

const prevFilm = () => { 
    if(currentFilm>1){
        currentFilm--;  
    } else {
        currentFilm = amountOfFilms;
    }
    document.querySelector(".display-block").classList.remove("display-block");
    document.querySelector(`.film-html:nth-child(${currentFilm+2})`).classList.add("display-block");
}

map.on('click', 'countries', (e) => {
    currentFilm = 1;
    map.easeTo({center: [e.lngLat.lng, e.lngLat.lat-10 ]}) // Center camera on country
    new mapboxgl.Popup({offset: 25, closeButton: false}) // Show popup
    .setLngLat(e.lngLat)
    .setHTML(popUpMarkup(e) + popUpFilmsList(e)) //Display Films
    .addTo(map);
    setPopupListeners() // Scrolling event listeners
    document.querySelector(".film-html").classList.add("display-block"); //Display first film
    console.log()
    });

map.on('mouseenter', 'countries', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
map.on('mouseleave', 'countries', () => {
    map.getCanvas().style.cursor = '';
    });
