// Create a map variable
var map;

// var styles = [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"transit.line","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
var styles = [
  {
    "featureType": "poi.attraction",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ff962a" },
      { "hue": "#ffdd00" }
    ]
  },
  {
    "featureType": "landscape.natural.terrain",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ff962a" },
      { "hue": "#ffdd00" }
    ]
  }
]
// Function to initialize the map within the map div
function initMap() {
 map = new google.maps.Map(document.getElementById('map'), {
   center: {lat: 40.7128, lng: -74.0059},
   zoom: 10,
   styles: styles
});
 // var trafficLayer = new google.maps.TrafficLayer();
 //  trafficLayer.setMap(map);
   // setMarkers(map);
  // var image = 'https://d30y9cdsu7xlg0.cloudfront.net/png/39868-200.png'
  var empireStateMarker = new google.maps.Marker({
        position: {lat: 40.7128, lng: -74.0059},
        map: map,
        title: "Empire State"
  });
  var marker = new google.maps.Marker({
    position: {lat: 40.7028, lng: -74.128},
    map: map,
    title: 'First Marker'
  });

  var empireContent = `<div id="content">
      <div id="siteNotice">
      </div> <h1 id="firstHeading" class="firstHeading">Empire State Building</h1>
      <div id="bodyContent"><p>The tallest building in the United States located at ${marker.position}</p>`
  var empireInfo = new google.maps.InfoWindow({
    content: empireContent,
    maxwidth: 50
  });
 // TODO: create a single infowindow, with your own content.
 // It must appear on the marker
  var contentString = `<div id="content">
      <div id="siteNotice">
      </div> <h1 id="secondHeading" class="firstHeading">New York</h1>
      <div id="bodyContent"><p>The largest city in the United States located at ${marker.position}</p>`
  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxwidth: 50
  });

 // TODO: create an EVENT LISTENER so that the infowindow opens when
 // the marker is clicked!
 marker.addListener('click', function() {
    infowindow.open(map, marker);
    empireInfo.close()
  });
 empireStateMarker.addListener('click', function() {
    empireInfo.open(map, empireStateMarker);
    infowindow.close()
  });
}

// Data for the markers consisting of a name, a LatLng and a zIndex for the
// order in which these markers should display on top of each other.
//  var monuments = [
//   ['Empire State', 40.7484, -73.9857, 4],
//   ['Statue of Liberty', 40.6892, -74.0445, 5],
//   ['Grand Army Plaza', 40.7644, -73.9734, 3],
//   ['Columbus Circle Fountain', 40.7851, -73.9683, 2],
//   ['911 Memorial', 40.7116, -74.0132, 1]
// ];

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
 
// }