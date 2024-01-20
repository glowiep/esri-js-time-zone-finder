require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Legend"
], function(Map, MapView, FeatureLayer) {

  const map = new Map({
      basemap: "streets"
  });


  const view = new MapView({
      container: "mapDiv",
      map: map,
      center: [0, 30], // longitude, latitude to center map
      zoom: 2,
      constraints: {
        minZoom: 1 // Use this constraint to avoid zooming out too far
      }
  });

  view.when(function() {
    limitMapView(view);
  });

  function limitMapView(view) {
    let initialExtent = view.extent;
    let initialZoom = view.zoom;
    view.watch('stationary', function(event) {
      if (!event) {
        return;
      }
      // If the center of the map has moved outside the initial extent,
      // then move back to the initial map position (i.e. initial zoom and extent
      let currentCenter = view.extent.center;
      if (!initialExtent.contains(currentCenter)) {
        view.goTo({
          target: initialExtent,
          zoom: initialZoom
        });
      }
    });
  }


  const featureLayer = new FeatureLayer({
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Time_Zones/FeatureServer/0",
      outFields: ["*"], // Adjust based on the data you need
      popupTemplate: {
          title: "Zone: {ZONE}", // Replace with your field
      }
  });
  map.add(featureLayer);

});

