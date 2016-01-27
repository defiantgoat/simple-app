define([
        "dojo/_base/lang"
        ,"dojo/dom"
        ,"dojo/dom-construct"
        ,"dojo/dom-style"
        ,"config/config"
        ,"esri/map"
        ],
        function(
        	lang
			,dom
			,domConstruct
			,domStyle
			,config
			,Map
        ){
		return{	
			startup: function(){	
				
				this.initMap();
	
				if(config.hasOwnProperty("application")){
					this.initAppDesign();
				}else{
					console.warn("application property isn't set properly in config.js");
				}
				
				if(config.hasOwnProperty("widgets")){
					this.initWidgets();
				}else{
					console.warn("widgets property isn't set properly in config.js");
				}
			},
			
			initMap: function(){
				if(dom.byId("map")){
					this.map = new Map("map", config.mapOptions);				
				}else{
					console.warn("dom element with id='map' does not exist");
				}
				
			},
			
			initAppDesign: function(){
				if(config.application.hasOwnProperty("title")){
					dom.byId("appTitle").innerHTML = config.application.title != null ? config.application.title : "";
				}
				if(config.application.hasOwnProperty("logo")){
					if(config.application.logo != null){
						var appLogo = domConstruct.create("img",{
							"src" : config.application.logo
						},dom.byId("logo"));
					}
				}
				if(config.application.hasOwnProperty("header_footer_background_color")){
					if(config.application.header_footer_background_color != null){
						domStyle.set(dom.byId("header"), "background-color", config.application.header_footer_background_color);
						if(dom.byId("footer")){
							domStyle.set(dom.byId("footer"), "background-color", config.application.header_footer_background_color);
						}
					}
				}
			},
			
			initWidgets: function(){
				if(config.widgets.hasOwnProperty("DGLayerList")){
					if(config.widgets.DGLayerList == true){
						require(["dg/DGLayerList/DGLayerList"],lang.hitch(this,function(DGLayerList){
							this.dgLayerList = new DGLayerList({
								map:this.map
							},"dgLayerList");
							this.dgLayerList.startup();
						}));
					}	
				}
				
			}
		}; //end return object	
}); //end define