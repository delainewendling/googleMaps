// Create a map variable
var map;
var markers= [];
var polygon = null;
function initMap() {
var styles = [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"transit.line","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]

// Constructor creates a new map
 map = new google.maps.Map(document.getElementById('map'), {
   center: {lat: 40.7128, lng: -74.0059},
   zoom: 10,
   styles: styles,
   mapTypeControl: false
  });

//These are the monuments that will show up
  var monuments = [
    {title:'Empire State Building', location: {lat: 40.7484, lng: -73.9857}},
    {title: 'Statue of Liberty', location: {lat: 40.6892, lng: -74.0445}},
    {title:'Grand Army Plaza', location:{lat: 40.7644, lng: -73.9734}},
    {title: 'Columbus Circle Fountain', location: {lat: 40.7851, lng: -73.9683}},
    {title: '911 Memorial', location: {lat: 40.7116, lng: -74.0132}}
  ];

  var largeInfowindow = new google.maps.InfoWindow();

  //Initializes Drawing Manager
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON
      ]
    }
  });
  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');
  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');


for (i=0; i < monuments.length; i++){
    var position = monuments[i].location;
    var title = monuments[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      //anitmation for the markers
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
});
    //pushes each of the markers created into the markers array
  markers.push(marker)
  marker.addListener('click', function(){
    // toggleBounce(this)
    populateInfoWindow(this, largeInfowindow);
  });
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });
}
  document.getElementById('show-monuments').addEventListener('click', showMonuments)
  document.getElementById('hide-monuments').addEventListener('click', hideMonuments)
  document.getElementById('toggle-drawing').addEventListener('click', function() {
        toggleDrawing(drawingManager);
  });
  drawingManager.addListener('overlaycomplete', function(event) {
    // First, check if there is an existing polygon.
    // If there is, get rid of it and remove the markers
    if (polygon) {
      polygon.setMap(null);
      hideMonuments(markers);
    }
    // Switching the drawing mode to the HAND (i.e., no longer drawing).
    drawingManager.setDrawingMode(null);
    // Creating a new editable polygon from the overlay.
    polygon = event.overlay;
    polygon.setEditable(true);
    // Searching within the polygon.
    searchWithinPolygon();
    // Make sure the search is re-done if the poly is changed.
    polygon.getPath().addListener('set_at', searchWithinPolygon);
    polygon.getPath().addListener('insert_at', searchWithinPolygon);
    console.log(polygon)
    var area = google.maps.geometry.spherical.computeArea(polygon.getPath())
    console.log("The area of the polygon is: "+Math.round(area) + " square meters")
  });
}

  function populateInfoWindow(marker, infowindow){
    if(infowindow.marker != marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
      // infowindow.open(map, marker);
      infowindow.addListener("closeclick", function(){
        infowindow.marker = null
      });

    var streetViewService = new google.maps.StreetViewService()
    //Radius of 50 m in case a street view doesn't exist at exact lat and long
    var radius = 50;

    function getStreetView(data, status){
      if (status == google.maps.StreetViewStatus.OK){
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
        infowindow.setContent('<div>' + marker.title + '</div> <div id="pano"></div>')
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions)
      } else {
        infowindow.setContent("<div"+ marker.title + "</div>" + "<div> No Street View Found </div>")
      }
    }

    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(map, marker)
  }
}

  function showMonuments(){
    var bounds = new google.maps.LatLngBounds()
    for (i=0; i<markers.length; i++){
      markers[i].setMap(map);
     //extends the boundaries of the map for each marker
      bounds.extend(markers[i].position)
    }
    map.fitBounds(bounds)
  }

  function hideMonuments(){
    for (i=0; i<markers.length; i++){
      markers[i].setMap(null);
    }
  }

  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  function toggleDrawing(drawingManager) {
    if (drawingManager.map) {
      drawingManager.setMap(null);
      // In case the user drew anything, get rid of the polygon
      if (polygon !== null) {
        polygon.setMap(null);
      }
    } else {
      drawingManager.setMap(map);
    }
  }

  function searchWithinPolygon() {
    for (var i = 0; i < markers.length; i++) {
      if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
        markers[i].setMap(map);
      } else {
        markers[i].setMap(null);
      }
    }
  }

  // function toggleBounce(marker){
  //   console.log("this", this)
  //   for (i=0; i<markers.length; i++){
  //     if(markers[i].getAnimation() !== null){
  //       markers[i].setAnimation(null)
  //     } else {
  //       markers[i].setAnimation(google.maps.Animation.BOUNCE)
  //     }
  //   }
  // }

 //  var empireStateMarker = new google.maps.Marker({
 //        position: {lat: 40.7128, lng: -74.0059},
 //        map: map,
 //        title: "Empire State"
 //  });
 //  var marker = new google.maps.Marker({
 //    position: {lat: 40.7028, lng: -74.128},
 //    map: map,
 //    title: 'First Marker'
 //  });

 //  var empireContent = `<div id="content">
 //      <div id="siteNotice">
 //      </div> <h1 id="firstHeading" class="firstHeading">Empire State Building</h1>
 //      <div id="bodyContent"><p>The tallest building in the United States located at ${marker.position}</p>`
 //  var empireInfo = new google.maps.InfoWindow({
 //    content: empireContent,
 //    maxwidth: 50
 //  });
 // // TODO: create a single infowindow, with your own content.
 // // It must appear on the marker
 //  var contentString = `<div id="content">
 //      <div id="siteNotice">
 //      </div> <h1 id="secondHeading" class="firstHeading">New York</h1>
 //      <div id="bodyContent"><p>The largest city in the United States located at ${marker.position}</p>`
 //  var infowindow = new google.maps.InfoWindow({
 //    content: contentString,
 //    maxwidth: 50
 //  });

 // // TODO: create an EVENT LISTENER so that the infowindow opens when
 // // the marker is clicked!
 // marker.addListener('click', function() {
 //    infowindow.open(map, marker);
 //    empireInfo.close()
 //  });
 // empireStateMarker.addListener('click', function() {
 //    empireInfo.open(map, empireStateMarker);
 //    infowindow.close()
 //  });
// }

// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
//  

// function setMarkers(map) {
// // Adds markers to the map.
// // Marker sizes are expressed as a Size of X,Y where the origin of the image
// // (0,0) is located in the top left of the image.
// // Origins, anchor positions and coordinates of the marker increase in the X
// // direction to the right and in the Y direction down.
//   var image = {
//     url: 'http://icons.iconarchive.com/icons/icons8/ios7/512/City-Monument-icon.png',
//     // This marker is 20 pixels wide by 32 pixels high.
//     size: new google.maps.Size(20, 32),
//     // The origin for this image is (0, 0).
//     origin: new google.maps.Point(0, 0),
//     // The anchor for this image is the base of the flagpole at (0, 32).
//     anchor: new google.maps.Point(0, 32)
//   };
// // Shapes define the clickable region of the icon. The type defines an HTML
// // <area> element 'poly' which traces out a polygon as a series of X,Y points.
// // The final coordinate closes the poly by connecting to the first coordinate.
//   var shape = {
//     coords: [1, 1, 1, 20, 18, 20, 18, 1],
//     type: 'poly'
//   };
//   for (var i = 0; i < monuments.length; i++) {
//     var monument = monuments[i];
//     var marker = new google.maps.Marker({
//       position: {lat: monument[1], lng: monument[2]},
//       map: map,
//       icon: image,
//       shape: shape,
//       title: monument[0],
//       zIndex: monument[3]
//     });
//   }
// }
 // var trafficLayer = new google.maps.TrafficLayer();
 //  trafficLayer.setMap(map);
   // setMarkers(map);
  // var image = 'https://d30y9cdsu7xlg0.cloudfront.net/png/39868-200.png'
// }