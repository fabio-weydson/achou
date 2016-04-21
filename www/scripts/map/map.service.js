(function() {
	'use strict';

	angular
		.module('bizdir.map')
		.factory('mapService', mapService);

	mapService.$inject = ['_', 'businessesService'];

	/* @ngInject */
	function mapService(_, businessesService) {
		var pins;

		var service = {
			getPins: getPins,
			getCommon: getCommon
		};

		return service;

		// ***************************************************************

		function getPins() {
			return businessesService.getBusinesses().then(function(businesses) {

				pins = [];
				_.each(businesses, function(business) {		
					if (business.mapdata) {

						_.each(business.mapdata, function(annotation) {
							var pin = business.mapdata.split(',');
							var latitude = pin[0];
							var longitude = pin[1];
							pins.push({
								title: business.name,
								description: business.description,
								phone: business.phoneNumber,
								logo: business.logo,
								address: business.officeLocation,
								// title: business.name + '. ' + annotation.title,
								lat: latitude,
								lon: longitude,
								businessId: business.guid
							});
						});
					}
				});
				return pins;

			});
		}

		function getCommon() {
			return businessesService.getCommon();
		}
	}
})();
