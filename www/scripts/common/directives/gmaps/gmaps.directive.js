'use strict';
angular.module('gMaps', [])

/**
 * Handle Google Maps API V3+
 */
// - Documentation: https://developers.google.com/maps/documentation/
.directive('gmaps', function($window) {

	return {
		restrict: 'E',
		replace: true,
		template: '<div class="gmaps"></div>',
		scope: {
			center: '=', 				// Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
			markers: '=', 			// Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: 'hello' }]</code>).
			width: '@', 				// Map width in pixels.
			height: '@', 				// Map height in pixels.
			zoom: '=', 					// Zoom level (one is totally zoomed out, 25 is very much zoomed in).
			mapTypeId: '@', 		// Type of tile to show on the map (roadmap, satellite, hybrid, terrain).
			panControl: '@', 		// Whether to show a pan control on the map.
			zoomControl: '@', 	// Whether to show a zoom control on the map.
			scaleControl: '@' 	// Whether to show scale control on the map.
		},
		link: function(scope, element, attrs) {
			var toResize, toCenter;
			var map;
			var infowindow;
			var currentMarkers;
			var callbackName = 'InitMapCb';
			var google;

			// callback when google maps is loaded
			$window[callbackName] = function() {
				google = window.google;
				console.log('map: init callback');
				createMap();
				updateMarkers();
			};

			if (!$window.google || !$window.google.maps) {
				console.log('map: not available - load now gmap js');
				loadGMaps();
			} else {
				console.log('map: IS available - create only map now');
				google = window.google;
				createMap();
			}

			function loadGMaps() {
				console.log('map: start loading js gmaps');
				var script = $window.document.createElement('script');
				script.type = 'text/javascript';
				script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=InitMapCb';
				$window.document.body.appendChild(script);
			}

			function createMap() {
				console.log('map: create map start');
				// Create an array of styles.
				  var styles = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"labels.text","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#10ade4"},{"visibility":"on"}]}];

						  	 var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});

				var c = scope.center;
				var mapOptions = {
					zoom: scope.zoom || 10,
					// center: new google.maps.LatLng(c.lat, c.lon),
					center: getLocation(c),
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					panControl: true,
					zoomControl: true,
					mapTypeControl: false,
					scaleControl: false,
					streetViewControl: true,
					streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
    },
					navigationControl: true,
					disableDefaultUI: true,
					overviewMapControl: true,
					mapTypeControlOptions: {
      // mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
				};
				if (!(map instanceof google.maps.Map)) {
					console.log('map: create map now as not already available ');
					map = new google.maps.Map(element[0], mapOptions);
					// EDIT Added this and it works on android now
					// Stop the side bar from dragging when mousedown/tapdown on the map
					google.maps.event.addDomListener(element[0], 'mousedown', function(e) {
						e.preventDefault();
						return false;
					});
					infowindow = new google.maps.InfoWindow({
						disableAutoPan: true
					});



					map.mapTypes.set('map_style', styledMap);
  					map.setMapTypeId('map_style');
				}
			}

			scope.$watch('markers', function() {
				updateMarkers();
			});

			// Info window trigger function
			function onItemClick(pin, label) {
				// Create content
				var contentString = label;
				// Replace our Info Window's content and position


				infowindow.setContent(contentString);

				infowindow.setPosition(pin.position);

				infowindow.open(map);

				google.maps.event.addListener(infowindow, 'closeclick', function() {
					// console.log('map: info windows close listener triggered ');
					infowindow.close();
				});
			}
			function onItemClick2(pin, label) {
				// Create content
				var contentString = label;
				infowindow.setContent(contentString);
				infowindow.setPosition(pin.position);
												infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});

				infowindow.open(map);

				// Replace our Info Window's content and position
				document.getElementById('infoBusiness').style.display='block';
				document.getElementById("infoBusiness").style.bottom = "0px";
				document.getElementById('infoBusiness').innerHTML =pin.html;
				google.maps.event.addListener(map, 'click', function() {
					// console.log('map: info windows close listener triggered ');
					infowindow.close();
					document.getElementById("infoBusiness").style.bottom = "-100px";
					document.getElementById('infoBusiness').style.display='none';
				});
			}



			function markerCb(marker, member, location) {
				return function() {
					// console.log('map: marker listener for ' + member.name);
					// var href = 'http://maps.apple.com/?q=' + member.lat + ',' + member.lon;
					map.setCenter(location);
					onItemClick2(marker, member.name);
				};
			}

			// update map markers to match scope marker collection
			function updateMarkers() {
				if (map && scope.markers) {
					// create new markers
					// console.log('map: make markers ');
					currentMarkers = [];
					var markers = scope.markers;
					if (angular.isString(markers)) {
						markers = scope.$eval(scope.markers);
					}
					for (var i = 0; i < markers.length; i++) {
						var m = markers[i];
						var loc = new google.maps.LatLng(m.lat, m.lon);
						var mm = new google.maps.Marker({
							position: loc,
							map: map,
							title: m.name,
							html: m.html,
							icon: 'images/pin.png'
						});
						//console.log('map: make marker for ' + m.name);
						google.maps.event.addListener(mm, 'click', markerCb(mm, m, loc));
						currentMarkers.push(mm);
					}
				}
			}

			// convert current location to Google maps location
			function getLocation(loc) {
				if (loc == null) {
					return new google.maps.LatLng(40, -73);
				}
				if (angular.isString(loc)) {
					loc = scope.$eval(loc);
				}
				console.log(loc.lat+"_"+loc.lon)
				return new google.maps.LatLng(loc.lat, loc.lon);
			}

		} // end of link:
	}; // end of return
})// in your JS source
.directive('something', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                document.getElementById('subcat').style.display = 'block';
            });
        }
    };
}]);;
