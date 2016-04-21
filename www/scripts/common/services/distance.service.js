(function() {
	'use strict';

	angular
		.module('bizdir.common')
		.factory('distanceService', distanceService);

	distanceService.$inject = ['$cordovaGeolocation', 'convert', 'geolib', '_'];

	/* @ngInject */
	function distanceService($cordovaGeolocation, convert, geolib, _) {
		var service = {
			getDistanceToOrigin: getDistanceToOrigin,
			getDistancesToOrigins: getDistancesToOrigins
		};
		return service;
		
		// ********************************************************

		function getDistancesToOrigins(origins) {
			return getCurrentPosition()
				.then(function(position) {
					return _.map(origins, function(origin) {
						return getDistance(origin, position);
					});
				});
		}

		function getDistanceToOrigin(origin) {
			return getCurrentPosition()
				.then(function(position) {
					return getDistance(origin, position);
				});
		}

		function getDistance(origin, position) {
			if(!origin) {
				origin = '37.798297,-122.417951';
			}

			origin = origin.split(',');
			origin = {
				latitude: origin[0],
				longitude: origin[1]
			};

			var distance = geolib.getDistance({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			}, origin);

			if (distance < 1000) {
				distance = distance + ' m';
			} else {
				distance = convert(distance, 'meters', {
					precision: 4
				}).toKilometers().toFixed() + ' km';
			}
			
			return distance;
		}

		function getCurrentPosition() {
			var posOptions = {
				enableHighAccuracy: true
			};

			return $cordovaGeolocation
				.getCurrentPosition(posOptions);
		}
	}
})();
