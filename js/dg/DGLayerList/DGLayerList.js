define([
        "dojo/_base/declare"
        ,"dojo/_base/config"
        ,"dojo/_base/lang"
        ,"dojo/dom"
        ,"dojo/dom-class"
        ,"dojo/dom-geometry"
        ,"dojo/dom-style"
        ,"dojo/on"
        ,"dojo/window"
        ,"dojo/request/xhr"
        ,"dijit/_WidgetBase"
        ,"dijit/_TemplatedMixin"
        ,"dojo/text!./template/DGLayerList.html"
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
    		,win
    		,xhr
    		,_WidgetBase
    		,_TemplatedMixin
    		,template
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
			
			this.setEventHandlers();
			this.setUIPositions();
			
			if(configError !== true){
				xhr(config.paths.dg+"/DGLayerList/rest.json",{
					handleAs: "json"
				}).then(
					lang.hitch(this,function(data){
						this.rest = data;
						for(layer in this.rest){
							console.log(this.rest[layer]);
						}
	
					}),
					function(err){
						console.error(err);
					}
				);
					
			}else{
				this.dgLayerListToggleButton.innerHTML = "Error";
			}
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