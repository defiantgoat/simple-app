define([
        "dojo/_base/declare"
        ,"dojo/_base/config"
        ,"dojo/_base/lang"
        ,"dojo/request/xhr"
        ,"dijit/_WidgetBase"
        ,"dijit/_TemplatedMixin"
        ,"dojo/text!./template/DGLayerList.html"
        ],
        function(
    		declare
    		,config
    		,lang
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
			if(configError !== true){
				xhr(config.paths.dg+"/DGLayerList/rest.json",{
					handleAs: "json"
				}).then(
					lang.hitch(this,function(data){
						this.rest = data;
						console.log(this.rest);
					}),
					function(err){
						console.log(err);
					}
				);
				
				
			}else{
				this.dgLayerListToggleButton.innerHTML = "Error";
			}
		}
		
	});
	
});