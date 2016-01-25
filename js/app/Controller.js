define([
        "dojo/_base/lang"
        ,"dojo/dom"
        ,"dojo/dom-construct"
        ,"config/config"
        ,"esri/map"
        ],
        function(
        	lang
			,dom
			,domConstruct
			,config
			,Map
        ){
		return{	
			startup: function(){	
							
				//this.map = new Map("map", config.mapOptions);
				
				if(config.hasOwnProperty("application")){
					this.initAppDesign();
				}
				if(config.hasOwnProperty("widgets")){
					this.initWidgets();
				}
				
				console.log(this);
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
			},
			
			initWidgets: function(){
				if(config.widgets.hasOwnProperty("DGLayerList")){
					if(config.widgets.DGLayerList == true){
						require(["dg/DGLayerList/DGLayerList"],lang.hitch(this,function(DGLayerList){
							this.dgLayerList = new DGLayerList({},"dgLayerList");
							this.dgLayerList.startup();
						}));
					}	
				}
				
			}
		}; //end return object	
}); //end define