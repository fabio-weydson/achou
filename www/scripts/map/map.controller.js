(function() {
	'use strict';

	angular
		.module('bizdir.map')
		.controller('MapController', MapController);

	MapController.$inject = ['$scope', 'common', 'businessesService', 'distanceService', 'pins', '_'];

	/* @ngInject */
	function MapController($scope, common, businessesService, distanceService, pins, _) {

		var vm = angular.extend(this, {
			origin: {
				lat: common.map.origin.latitude,
				lon: common.map.origin.longitude
			},
			zoom: common.map.zoomLevel,
			markers: loadPoints()

		});
			
		// ******************************************************************

		function loadPoints() {
			var markers = [];
			_.each(pins, function(pin) {
				// console.log(pin);
				// 	businessesService.getBusiness(pin.businessId)
				// .then(function(businesses) {
				// 	vm.businesses = businesses;
				// 	console.log(businesses)
				// })	
				markers.push({
					name:  pin.title,
					html: getBusinessLink(pin.businessId, pin.title, pin.description, pin.phone, pin.address),
					lat: pin.lat,
					logo: pin.logo,
					lon: pin.lon
					
				});
			});
			return markers;
		}

		function getBusinessLink(businessId, title, description, phone, address) {
		
		
			return '<div class="row"><div class="col"><h4>'+title +'</h4><p><b>Endereço: </b>'+address+'</p><p><b>Telefone: </b>'+phone+'</p></div></div><div class="row"><div class="col"><a href="tel:'+phone+'" class="button button-positive button-full icon-left ion-ios-telephone">Ligar</a></div>'+
			'<div class="col"><a href="#/app/businesses/' + businessId + '" class="button button-full icon-left  ion-plus-round">Detalhes</a></div></div>';


		}
			function getDistances(businesses) {
			var origins = _.map(businesses, function(business) {
				return business.mapdata;
			})
			distanceService.getDistancesToOrigins(origins).then(function(distances) {
				for (var i = 0; i < businesses.length; i++) {
					businesses[i].distance = distances[i];
				}
			});
		}
		
	
		
	}

		
})();
