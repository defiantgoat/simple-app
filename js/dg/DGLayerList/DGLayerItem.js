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
	
});//end define