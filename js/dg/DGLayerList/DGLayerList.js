define([
        "dojo/_base/declare"
        ,"dojo/_base/config"
        ,"dojo/_base/lang"
        ,"dojo/dom"
        ,"dojo/dom-class"
        ,"dojo/dom-geometry"
        ,"dojo/dom-style"
        ,"dojo/on"
		,"dojo/promise/all"
        ,"dojo/window"
        ,"dojo/request/xhr"
        ,"dijit/_WidgetBase"
        ,"dijit/_TemplatedMixin"
        ,"dojo/text!./template/DGLayerList.html"
		,"esri/request"
        ],
        function(
    		declare
    		,config
    		,lang
    		,dom
    		,domClass
    		,domGeom
    		,domStyle
    		,on
			,all
    		,win
    		,xhr
    		,_WidgetBase
    		,_TemplatedMixin
    		,template
			,esriRequest
    		){
	
	var configError;
	
	(function(){
		if(config.hasOwnProperty("paths")){
			if(config.paths.hasOwnProperty("dg")){
				var link = document.createElement("link");
				link.type = "text/css";
				link.rel = "stylesheet";
				link.href = config.paths.dg + "/DGLayerList/css/DGLayerList.css";
				document.getElementsByTagName("head")[0].appendChild(link);
			}else{
				var configError = true;
				console.error("dojoConfig 'dg' path attribute doesn't exist. Cannot load DGLayerList css file.");
			}
		}else{
			var configError = true;
			console.error("dojoConfig packages and paths attributes are not set up property. Cannot load DGLayerList css file.");
		}
	})();
	
	return declare([_WidgetBase,_TemplatedMixin],{
		
		templateString: template,
		
		baseClass: "dg-layer-list",
		
		rest: null,
		
		startup: function(){
		
		},
		
		postCreate: function () {
			this.setEventHandlers();
				this.setUIPositions();
				
				if(configError !== true){
					xhr(config.paths.dg+"/DGLayerList/rest.json",{
						handleAs: "json"
					}).then(
						lang.hitch(this,function(data){
							this.rest = data;
							this.getServicesInfo();
		
						}),
						function(err){
							console.error(err);
						}
					);
						
				}else{
					this.dgLayerListToggleButton.innerHTML = "Error";
				}
		
		
		
		
		},
		
		getServicesInfo: function(){
			
			var services = []; // array to hold all the esriRequest objects
			
			// for all layers in config file create an esriRequest and push it to the serviceRequests array
		    for(var service in this.rest){
		    	services.push(esriRequest({
		    			url: this.rest[service].url + "?f=pjson",
		    			handleAs: "json",
		    			callbackParamName: "callback"
		    	}));
		    }
		    
		    /*
		     * esriRequests are Deferred objects, using dojo's all method
		     * allows the application to process all the Deferreds and then
		     * to do something with all the data once they all return data.
		     * all returns all the Deferred objects in the same order they were called
		     */
		    all(services).then(lang.hitch(this, function (results) {
		        this.addToUI(results);
		    }));
		},
		
		addToUI: function(res){
			console.log(res);
		
		},
		
		setEventHandlers: function(){
			
			this.tOut = null; // Regarding this timeout fix See > http://stackoverflow.com/a/6596743
            
			// Add resize event listener to the window for this widget
			on(window, 'resize', lang.hitch(this, function() {
                if (this.tOut !== null) {
                    clearTimeout(this.tOut);
                }
                this.tOut = setTimeout(lang.hitch(this, function() {
                	this.setUIPositions();
                	this.setMapWidth();
                }), 300);
            }));  
			
			on(this.dgLayerListToggleButton, "click", 
					lang.hitch(this, function(evt){
						console.log(evt);
						this.handleEvents("toggle-layer-list")
			}));
		},
		
		setUIPositions: function(){
			var top,height;
			
			top = domGeom.getContentBox(this.dgLayerListToggleButton).h;
			domStyle.set(this.dgLayerList, "top", top+"px");

			if(dom.byId("footer")){
				height = (domGeom.getMarginBox(dom.byId("footer")).t - top) + "px";
				
			}else{
				height = (win.getBox().h - top) + "px";
			}
			domStyle.set(this.dgLayerList, "height", height);
		},
		
		setMapWidth: function(){
			if(dom.byId("map")){
				var width = win.getBox().w - domGeom.getMarginBox(this.dgLayerList).w + "px";
				domStyle.set(dom.byId("map"),"width",width);
				this.map.resize(true);
			}
		},
		
		handleEvents: function(event){
			switch(event){
			
			case "toggle-layer-list":
				if(domClass.contains(this.dgLayerList,"dg-off")){
					domClass.remove(this.dgLayerList, "dg-off");
				}else{
					domClass.add(this.dgLayerList, "dg-off");				
				}
				this.setMapWidth();
				break;
				
			default:
				break;
			
			}
		}
		
	});//end declare
	
});//end define