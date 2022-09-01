mapboxgl.accessToken = mapToken;
const countryCodes = filmCountries.map(film=>film.shortName)
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
    // console.log(map.getLayer('countries'));
    // console.log(map.getSource('country-boundaries'));
    // console.log(map.querySourceFeatures("country-boundaries"))
    // console.log(map.getStyle().sources["country-boundaries"].data.features[0].properties)
});
console.log(filmCountries)

// When a click event occurs on a feature in the countries layer,
// open a popup at the location of the click, with description
// HTML from the click event's properties.

const popUpMarkup = (e)=>{
    return `<h3>`+ filmCountries.find(film => film.shortName == (e.features[0].properties.iso_3166_1_alpha_3)).name +`</h3><br>`
}
const popUpFilmsList = (e)=>{
    const data = filmCountries.find(film => film.shortName == (e.features[0].properties.iso_3166_1_alpha_3)) 
        for (let film of data.filmsList){
            return `<h4>`+ film.title + `</h4><img src="`+ film.image1 +`">`
        } // COME BACK HERE LATER TO SORT THE SETHTML
    }


map.on('click', 'countries', (e) => {
    console.log(e.features[0].properties)
    map.easeTo({center: e.lngLat})
    new mapboxgl.Popup({offset: 25, closeButton: false})
    .setLngLat(e.lngLat)
    .setHTML(popUpMarkup(e) + popUpFilmsList(e))
    .addTo(map);
    });
map.on('mouseenter', 'countries', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
map.on('mouseleave', 'countries', () => {
    map.getCanvas().style.cursor = '';
    });




    //////////////////////////////////////////////// 
   

// // inspect a cluster on click
// map.on('click', 'clusters', (e) => {
//     const features = map.queryRenderedFeatures(e.point, {
//         layers: ['clusters']
//     });
//     const clusterId = features[0].properties.cluster_id;
//     map.getSource('earthquakes').getClusterExpansionZoom(
//         clusterId,
//         (err, zoom) => {
//             if (err) return;
     
//     map.easeTo({
//         center: features[0].geometry.coordinates,
//     zoom: zoom
// });
// }
// );
// });

// // When a click event occurs on a feature in
// // the unclustered-point layer, open a popup at
// // the location of the feature, with
// // description HTML from its properties.
// map.on('click', 'unclustered-point', (e) => {
//     const coordinates = e.features[0].geometry.coordinates.slice();
//     const mag = e.features[0].properties.mag;
//     const tsunami =
//     e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
    

    
//     new mapboxgl.Popup()
//     .setLngLat(coordinates)
//     .setHTML(
//         `magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`
//         )
//         .addTo(map);
//     });

