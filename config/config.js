define([],function(){
	
	return{		
		
		/* Edit Below */
		
		"application" : {
			"title": "Sample App",
			"logo": "images/logo.png"
		},
		
		"widgets" : {
			"geolocate" : false,
			"scalebar" : false,
			"DGLayerList" : true
		},
		
		// map options as of api v3.15
		"mapOptions":{
			//attributionWidth: null,
			autoResize: true,
			basemap: "gray",
			center: [-78.6389, 35.7806], //[lat,long]
			displayGraphicsOnPan: true,
			//extent: null,
			//fadeOnZoom: false,
			fitExtent: true,
			force3DTransforms: false,
			//infoWindow: null,
			//lods: null,
			logo: false,
			//maxScale: null,
			//maxZoom: null,
			//minScale: null,
			//minZoom: null,
			nav: false,
			navigationMode: "css-transforms",
			optimizePanAnimation: false,
			resizeDisplay: 300,
			//scale: null,
			showAttribution: false,
			showInfoWindowOnClick: false,
			showLabels: false,
			slider: true,
			//sliderLabels: null,
			sliderOrientation: "vertical",
			sliderPosition: "top-left",
			sliderStyle: "small",
			//smartNavigation: true,
			wrapAround180: true,
			zoom: 10	
		}
			
			
		/* Edit Above */
			
	}// end return statement	
});//end define