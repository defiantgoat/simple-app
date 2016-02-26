<<<<<<< HEAD
define([
        "dojo/_base/declare"
        ,"dojo/_base/config"
        ,"dojo/_base/lang"
        ,"dojo/dom"
        ,"dojo/dom-class"
        ,"dojo/dom-construct"
        ,"dojo/dom-style"
        ,"dojo/on"
        ,"dojox/gfx"
        ,"dijit/_WidgetBase"
        ,"dijit/_TemplatedMixin"
        ,"dijit/form/CheckBox"
        ,"dojo/text!./template/DGLayerItem.html"
        ,"esri/layers/FeatureLayer"
        ,"esri/InfoTemplate"
        ,"esri/symbols/jsonUtils"
        ],
        function(
    		declare
    		,config
    		,lang
    		,dom
    		,domClass
    		,domConstruct
    		,domStyle
    		,on
    		,gfx
    		,_WidgetBase
    		,_TemplatedMixin
    		,CheckBox
    		,template
    		,FeatureLayer
    		,InfoTemplate
    		,jsonUtils
    		){
	
	var configError;
	
	(function(){
		if(config.hasOwnProperty("paths")){
			if(config.paths.hasOwnProperty("dg")){
				var link = document.createElement("link");
				link.type = "text/css";
				link.rel = "stylesheet";
				link.href = config.paths.dg + "/DGLayerList/css/DGLayerItem.css";
				document.getElementsByTagName("head")[0].appendChild(link);
			}else{
				var configError = true;
				console.error("dojoConfig 'dg' path attribute doesn't exist. Cannot load DGLayerItem css file.");
			}
		}else{
			var configError = true;
			console.error("dojoConfig packages and paths attributes are not set up property. Cannot load DGLayerItem css file.");
		}
	})();
	
	return declare([_WidgetBase,_TemplatedMixin],{
		
		templateString: template,
		
		baseClass: "dg-layer-item",
		
		startup: function(){		
		},
		
		postCreate: function () {
			console.log(this.layer);
			
			// Create the layer on/off checkbox object for this layer
			this.cBox = new CheckBox({
	                value: this.layer.layerConfig.url, // this is the feature service url
	                name: this.layer.name, // name from returned data
	                "layerURL": this.layer.layerConfig.url,
	                "layerConfig" : this.layer.layerConfig, // an object that holds config data for this layer
	                checked: false,
	                id: "cb_"+this.layer.layerConfig.id // dynamically set id for this checkbox
	            }).placeAt(this.layerToggle);
			
			
			/* set the on change event handler for the checkbox */					 
            on(this.cBox, "change", lang.hitch(this, function (checkbox) {
            	
            	console.log(checkbox);
               
            	// Checkbox is checked
            	if (checkbox.checked) {
            		/* 
            		 * If the map doesn't have a layer with that id, then it needs to
            		 * be created and the layer needs to be loaded from the server
            		 */
                	if(!this.map.getLayer(checkbox.layerConfig.id)){

                		
                		var thisFL = new FeatureLayer(checkbox.layerConfig.url, {
    						mode: FeatureLayer.MODE_AUTO,
    						id : checkbox.layerConfig.id,
    				        infoTemplate : new InfoTemplate("Attributes", "${*}")
    					});
                		
                		thisFL.layerConfig = checkbox.layerConfig;
                		   		                        		
                		on(thisFL, "load", lang.hitch(this, function(id){  
                			// ANY TYPE OF ON FINISHED LOADING LOGIC HERE
                			//domClass.add(dom.byId("updating_"+id),"off");
                			console.log("layer load");
                		},thisFL.id));
                		
                		on(thisFL, "update-start", lang.hitch(this, function(id){
                			//domClass.remove(dom.byId("updating_"+id),"off");
                			console.log('udpate-start');
                		},thisFL.id));
                		
                		on(thisFL, "update-end", lang.hitch(this, function(id){             
                			//domClass.add(dom.byId("updating_"+id),"off");
                			console.log('update-end');
                		},thisFL.id));
                		
                		on(thisFL, "suspend", lang.hitch(this, function(id){
                			console.log('suspend');
                		},thisFL.id));
                		
                		
                		// Add the layer to the map
                		this.map.addLayer(thisFL);
                    	
               	
                	}
                	// The map already has this layer id loaded, so just show it.
                	// THERE IS NO REFRESH AT THIS POINT FROM THE SERVER.
                	else{
                		this.map.getLayer(checkbox.layerConfig.id).show();
                		this.map.getLayer(checkbox.layerConfig.id).resume();
                	}

                }
            	// Checkbox is unchecked
            	else {
            		// If the map has a layer with that id then simply hide it
            		// Layer isn't loaded again from the server
            		// TODO : May want to have a refresH layer button in case user wants to reload layer
                	if(this.map.getLayer(checkbox.layerConfig.id)){
                		this.map.getLayer(checkbox.layerConfig.id).suspend();
                		this.map.getLayer(checkbox.layerConfig.id).hide();
                	}
                		


                }
            	
            }, this.cBox)); //at the end of the hitch function, pass the cBox element and the counter as parameters to the anonymous function
			
			this.title.innerHTML = this.layer.layerConfig.title;
			
			// Create the list item for the layer
			this.li = domConstruct.create("div", {
				"class" : "layer",
				id: "parent_li_" + this.layer.layerConfig.id
			}, this.legend);
			
	        // Create a ul dom node to hold all the fields and symbols
			// This functions as a legend as well for each layer
			this.fieldsUL = domConstruct.create("ul", {
	        	"class" : "off",
     			"style" : "list-style-type:none;padding:0;",
     			"id" : this.layer.layerConfig.id+"_fields"
     		}, this.li);
			
			// If the layer has multiple symbol types
         	if(this.layer.drawingInfo.renderer.uniqueValueInfos){
         		
         		// create a local variable to hold the uniqueValueInfos array just to
         		// make the for loop logic cleaner
         		var uniqueValues = this.layer.drawingInfo.renderer.uniqueValueInfos;
         		
         		// Loop through all the uniqueValues and create a li with associated
         		// symbol and label
         		for(var y=0; y < uniqueValues.length; y++){
         			
         			var uniqueValueLI = domConstruct.create("li", {}, this.fieldsUL);
         			
         			var icon = domConstruct.create("div", {
         				style: "width:20px;height:20px;overflow:hidden;display:inline-block;position:relative;top:6px;",
		                //style: "width:"+uniqueValues[y].symbol.width+"px;height:"+uniqueValues[y].symbol.height+"px;overflow:hidden;display:inline-block;position:relative;top:6px;",
		                id: this.layer.layerConfig.id + "_symbol_" + uniqueValues[y].label
		            }, uniqueValueLI);

         			var label = domConstruct.create("label", {
		                innerHTML: uniqueValues[y].label,
		                style: "margin-left:12px;font-size:.8em;"
		            }, uniqueValueLI);
		             			
         			// Symbol drawing logic
         			var symbol = jsonUtils.getShapeDescriptors(jsonUtils.fromJson(uniqueValues[y].symbol));
                    var surface = gfx.createSurface(icon, 40, 40);
                    var shape = surface.createShape(symbol.defaultShape).setFill(symbol.fill).setStroke(symbol.stroke);
                    shape.applyTransform({ dx: 10, dy: 10 });	
                    
         		}// end for loop
         	}
         	else{
         		// There is only one field/symbol
         		
         		var uniqueValueLI = domConstruct.create("li", {}, this.fieldsUL);
         		
     			this.icon = domConstruct.create("div", {
	                style: "width:20px;height:20px;overflow:hidden;display:inline-block;position:relative;top:6px;",
	                id: this.layer.layerConfig.id + "_single_symbol_" + (Date.now().toString())
	            }, uniqueValueLI);

     			var label = domConstruct.create("label", {
	                innerHTML:this.layer.drawingInfo.renderer.label,
	                style: "margin-left:12px;font-size:.8em;"
	            }, uniqueValueLI);
     			

     			     			
     			console.log(this.layer.drawingInfo);
     			console.log(document.getElementById(this.icon.id));
     			
     			// Symbol drawing logic
	         	var symbol = jsonUtils.getShapeDescriptors(jsonUtils.fromJson(this.layer.drawingInfo.renderer.symbol));
	         	var surface = gfx.createSurface(this.icon, 40, 40);
	         	var shape = surface.createShape(symbol.defaultShape).setFill(symbol.fill).setStroke(symbol.stroke);
	         	shape.applyTransform({ dx: 10, dy: 10 });
                
         	}//end else/if logic
			
		}
		
	});//end declare
	
=======
define([
        "dojo/_base/declare"
        ,"dojo/_base/config"
        ,"dojo/_base/lang"
        ,"dojo/dom"
        ,"dojo/dom-class"
        ,"dojo/dom-style"
        ,"dojo/on"
        ,"dijit/_WidgetBase"
        ,"dijit/_TemplatedMixin"
        ,"dojo/text!./template/DGLayerItem.html"
        ],
        function(
    		declare
    		,config
    		,lang
    		,dom
    		,domClass
    		,domStyle
    		,on
    		,_WidgetBase
    		,_TemplatedMixin
    		,template
    		){
	
	var configError;
	
	/*(function(){
		if(config.hasOwnProperty("paths")){
			if(config.paths.hasOwnProperty("dg")){
				var link = document.createElement("link");
				link.type = "text/css";
				link.rel = "stylesheet";
				link.href = config.paths.dg + "/DGLayerList/css/DGLayerItem.css";
				document.getElementsByTagName("head")[0].appendChild(link);
			}else{
				var configError = true;
				console.error("dojoConfig 'dg' path attribute doesn't exist. Cannot load DGLayerItem css file.");
			}
		}else{
			var configError = true;
			console.error("dojoConfig packages and paths attributes are not set up property. Cannot load DGLayerItem css file.");
		}
	})();*/
	
	return declare([_WidgetBase,_TemplatedMixin],{
		
		templateString: template,
		
		baseClass: "dg-layer-item",
		
		startup: function(){		
		},
		
		postCreate: function () {
			console.log(this.layer);
			this.title.innerHTML = this.layer.layerConfig.title;
		}
		
	});//end declare
	
>>>>>>> origin/master
});//end define