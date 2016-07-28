require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/dijit/Legend",
    "esri/InfoTemplate",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/renderers/ClassBreaksRenderer",
    "esri/renderers/SimpleRenderer",
    "esri/graphic",
    "esri/dijit/Legend",
    "esri/Color",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/io-query",
    "dojo/domReady!"
  ],
  function(
    Map,
    FeatureLayer,
    Legend,
    InfoTemplate,
    SimpleFillSymbol,
    SimpleLineSymbol,
    ClassBreaksRenderer,
    SimpleRenderer,
    Graphic,
    Legend,
    Color,
    Query,
    QueryTask,
    ioQuery
    
  ) {

  	//global to hold layer selection VERY IMPORTANT for feature layer click functionality
  	layer = ''
  	//parameterized URI
  	GET = ioQuery.queryToObject(decodeURIComponent(dojo.doc.location.search.slice(1)));

    var map = new Map("map", {
      basemap: "gray",
      center: [-73.92, 40.72],
      zoom: 10
    });

    /****************************************************************
     * Add feature layer - A FeatureLayer at minimum should point
     * to a URL to a feature service or point to a feature collection 
     * object.
     ***************************************************************/
    // feature layer from ArcGIS Online. This may/may not be available in the future.
    var featureLayer = new FeatureLayer("http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/CommunityDistrictsPortal/FeatureServer/0",{
      outFields:["*"]
    });

    //legend dijit
    var legend = new Legend({
      map: map
    }, "legendDiv");
    legend.startup();

    //default symbol needed for renderers below
    var symbol = ""

    //default renderer for map on initial map load
    var line = new SimpleLineSymbol();
    line.setWidth(0.75);
	line.setColor(new Color([36, 36, 36, 1]));
	var fill = new SimpleFillSymbol();
	fill.setColor(new Color([0, 0, 0, 0.15]));
	fill.setOutline(line);
	var defaultRenderer = new SimpleRenderer(fill);
	featureLayer.setRenderer(defaultRenderer);
	map.addLayer(featureLayer);

    //url parameter boro query
	if (Object.keys(GET).length > 0){
		if ('cd' in GET){
        	var cdQuery = new Query();
        	var cdQueryTask = new QueryTask("http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/CommunityDistrictsPortal/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson");
        	cdQuery.outFields = ["*"]
        	cdQuery.returnGeometry = true;

			cdQuery.where = "BoroCD = '" + GET.cd + "'";
			cdQueryTask.execute(cdQuery, zoomTo);
    	}
    	if ('layer' in GET){
    		layer = "Layer"+GET.layer;
    		map.on('load', clicker);
    	};
    };

    //simulate .Layer click
    function clicker(evt){
        $('.Layer').trigger('click');
    };
    

    function zoomTo(featureSet){
    	var resultFeatures = featureSet.features;
    	//console.log(resultFeatures);
    	var graphic = resultFeatures[0];
    	cdExtent = graphic.geometry.getExtent();
    	map.setExtent(cdExtent.expand(2));

    	var highlightGraphic = new Graphic(graphic.geometry,highlightSymbol);
      	map.graphics.add(highlightGraphic);

      	att1 = "Attribute: "+ resultFeatures[0].attributes[layer];
      	BoroCD = "Community District " + resultFeatures[0].attributes.BoroCD;
      	$('.att1').text(att1);
      	$('.BoroCD').text(BoroCD);
    };

    var highlightSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([0,255,197]), 2.5
          ),
          new Color([0,0,0,0])
    );

    // click functionality popup
    featureLayer.on("click", mapClick);
    function mapClick(evt){
      map.graphics.clear();

      //[layer] == global layer name from layerSelection
      att1 = "Attribute: "+ evt.graphic.attributes[layer];
      BoroCD = "Community District " + evt.graphic.attributes.BoroCD;
      $('.att1').text(att1);
      $('.BoroCD').text(BoroCD);

      // highlight graphic
      var highlightGraphic = new Graphic(evt.graphic.geometry,highlightSymbol);
      map.graphics.add(highlightGraphic);
    };

    //set renderer based on button selection
    $('.Layer').click(function(event) {
      event.preventDefault();
      //console.log(event.target.tagName);
      if (event.target.tagName == 'A'){
      	layer = $(event.target).text();
      	map.removeLayer(featureLayer);
      }

      switch (layer) {
        case 'Layer1':
        var renderer = new ClassBreaksRenderer(symbol, "Layer1");
        renderer.addBreak(0, 25, new SimpleFillSymbol().setColor(new Color([56, 168, 0, 0.5])).setOutline(line));
        renderer.addBreak(26, 50, new SimpleFillSymbol().setColor(new Color([139, 209, 0, 0.5])).setOutline(line));
        renderer.addBreak(51, 75, new SimpleFillSymbol().setColor(new Color([255, 255, 0, 0.5])).setOutline(line));
        renderer.addBreak(76, 100, new SimpleFillSymbol().setColor(new Color([255, 128, 0, 0.5])).setOutline(line));
        $('.layerName').text("Layer1 Description");
        $('.layerDescription').text("Layer1 is this....");
        $('.att1').text("");
        $('.BoroCD').text("");
        break;
        case 'Layer2':
        var renderer = new ClassBreaksRenderer(symbol, "Layer2");
        renderer.addBreak(0, 25, new SimpleFillSymbol().setColor(new Color([75, 110, 0, 0.5])).setOutline(line));
        renderer.addBreak(26, 50, new SimpleFillSymbol().setColor(new Color([120, 200, 0, 0.5])).setOutline(line));
        renderer.addBreak(51, 75, new SimpleFillSymbol().setColor(new Color([55, 55, 0, 0.5])).setOutline(line));
        renderer.addBreak(76, 100, new SimpleFillSymbol().setColor(new Color([128, 255, 0, 0.5])).setOutline(line));
        $('.layerName').text("Layer2 Description");
        $('.layerDescription').text("Layer2 is this....");
        $('.att1').text("");
        $('.BoroCD').text("");
        break;
        case 'Layer3':
        var renderer = new ClassBreaksRenderer(symbol, "Layer3");
        renderer.addBreak(0, 25, new SimpleFillSymbol().setColor(new Color([170, 68, 0, 0.5])).setOutline(line));
        renderer.addBreak(26, 50, new SimpleFillSymbol().setColor(new Color([139, 20, 0, 0.5])).setOutline(line));
        renderer.addBreak(51, 75, new SimpleFillSymbol().setColor(new Color([255, 55, 0, 0.5])).setOutline(line));
        renderer.addBreak(76, 100, new SimpleFillSymbol().setColor(new Color([55, 128, 0, 0.5])).setOutline(line));
        $('.layerName').text("Layer3 Description");
        $('.layerDescription').text("Layer3 is this....");
        $('.att1').text("");
        $('.BoroCD').text("");
        break;
      };

      map.graphics.clear();
      map.addLayer(featureLayer);
      featureLayer.setRenderer(renderer);
      $('.esriLegendLayer').eq(1).remove();
    });

  }); //end
