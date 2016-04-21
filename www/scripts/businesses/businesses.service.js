(function() {
	'use strict';

	angular
		.module('bizdir.businesses')
		.factory('businessesService', businessesService);

	businessesService.$inject = ['dataService', '$q', '_'];

	/* @ngInject */
	function businessesService(dataService, $q, _) {
		var service = {
			getBusinesses: getBusinesses,
			getCategorias: getCategorias,
			getDestaques: getDestaques,
			getBusinessesByCategory: getBusinessesByCategory,
			getBusiness: getBusiness,
			getCommon: getCommon,
			getCategories: getCategories
		};
		return service;

		// ***************************************************************

		function getCategories() {
			return dataService.getCategories();
		};


		function getCategorias() {
			return dataService.getCategorias();
		};

		function getBusinesses() {
			return dataService.getBusinesses();
		}

		function getDestaques() {
			return dataService.getDestaques();
		}

		function getBusinessesByCategory(category) {
			return dataService.getBusinessesByCategory(category);
		}

		function getBusiness(businessId) {
			return dataService.getBusiness(businessId);
		}

		function getCommon() {
			return dataService.getCommon();
		}
	}
})();
