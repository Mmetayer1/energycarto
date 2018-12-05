mapboxgl.accessToken ="pk.eyJ1IjoibW1ldGF5ZXIiLCJhIjoiY2pvOGpyMnYwMDI1MTNqbnc5OTk0dDN2NyJ9.6_nnN1tLRbPKtSMaYsmzzg";
var map = new mapboxgl.Map({
  container: "carte", // container id
  style: "mapbox://styles/mmetayer/cjoei7hkt52jw2rs0dklspevg" // replace this with your style URL
});

var hoveredStateId =  null;
map.on('load', function() {

	map.addSource("region",{
		"type":"geojson",
		"data":"Co2region.geojson"
	});	

	map.addLayer({
		"id":"survol",
		"type":"fill",
		"source":"region",
		"layout":{},
		"paint":{
	        "fill-color": "white",
	        "fill-opacity": ["case",
	        ["boolean", ["feature-state", "hover"], false],
	        0.5,
	        0
	        ]
	    }
	});
	
	map.on("mousemove", "survol", function(e) {
		//change la couleur de l'élément survoler
        if (e.features.length > 0) {
            if (hoveredStateId) {
                map.setFeatureState({source: 'region', id: hoveredStateId}, { hover: false});
            }
            hoveredStateId = e.features[0].id;
            map.setFeatureState({source: 'region', id: hoveredStateId}, { hover: true});
        }

        //remplis le block avec les données renseignées dans layer nbregion
        var states = map.queryRenderedFeatures(e.point, {
		layers: ['nbregion']
		});
		
		if (states.length > 0) {
			document.getElementById('pd').innerHTML = '<h3><strong>' + states[0].properties.nom + '</strong></h3><p><strong><em>' + states[0].properties.Co2 + '</strong> people per square mile</em></p>';
		} else {
			document.getElementById('pd').innerHTML = '<p>Hover over a state!</p>';}
  	});

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on("mouseleave", "survol", function() {
        if (hoveredStateId) {
            map.setFeatureState({source: 'region', id: hoveredStateId}, { hover: false});
        }
        hoveredStateId =  null;
    });
});


