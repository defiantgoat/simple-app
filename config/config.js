define([],function(){return{		
		
		/* Edit Below 
		----------------------------------------------------------------------------------------------------*/
		
		"application" : {
			"title": "Sample App",
			"logo": "images/logo.png",
			"header_footer_background_color": "#555"
		},
		
		"widgets" : {
			"geolocate": false,
			"scalebar": false,
			"DGLayerList": true
		},
		
		// map options as of api v3.15
		"mapOptions":{
			//attributionWidth: null,
			autoResize: true,
			basemap: "gray",
			center: [-98, 39.5], //[lat,long]
			displayGraphicsOnPan: true,
			//extent: null,
			//fadeOnZoom: false,
			fitExtent: true,
			force3DTransforms: false,
			//infoWindow: null,
			//lods: null,
			logo: true,
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
			showInfoWindowOnClick: true,
			showLabels: false,
			slider: true,
			//sliderLabels: null,
			sliderOrientation: "vertical",
			sliderPosition: "top-left",
			sliderStyle: "small",
			//smartNavigation: true,
			wrapAround180: true,
			zoom: 5	
		}
			
			
		/* ----------------------------------------------------------------------------------------------------
		Edit Above */
			
}});