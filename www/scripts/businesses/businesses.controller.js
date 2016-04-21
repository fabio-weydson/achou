(function() {
	'use strict';

	angular
		.module('bizdir.businesses')
		.controller('BusinessesController', BusinessesController);

	BusinessesController.$inject = ['$state', 'businessesService', 'distanceService', 'filterModal', '_'];

	/* @ngInject */
	function BusinessesController($state, businessesService, distanceService, filterModal, _) {

		var vm = angular.extend(this, {
			categories: null,
			selectedCategory: 'Todas',
			sortBy: 'name',
			selectedCidade: 'Rio de Janeiro',
			businesses: [],
			navigate: navigate,
			filterByCategory: filterByCategory,
			showFilter: showFilter
		});

		(function activate() {
			loadDestaques();
			loadBusinesses();
			loadCategories();
			loadCategorias();

		})();

		// ********************************************************************

		function applyFilters() {
			filterModal.hide();

			var scope = filterModal.scope;
			vm.selectedCategory = scope.vm.selectedCategory;
			vm.sortBy = scope.vm.sortBy;
			vm.selectedCidade = scope.vm.selectedCidade;
			loadBusinesses();
			
		}

		function showFilter() {
			var scope = filterModal.scope;
			var cidades = ["Rio de Janeiro","Sao Paulo"];
			scope.vm = {
				categories: vm.categories,
				selectedCategory: vm.selectedCategory,
				sortBy: vm.sortBy,
				cidades: cidades,
				selectedCidade: vm.selectedCidade,
				applyFilters: applyFilters
			};

			filterModal.show();
		}

		function filterByCategory(category) {
			vm.selectedCategory = category;
			loadBusinesses();
		}

		function loadCategories() {
			businessesService.getCategories().then(function(categories) {
				vm.categories = categories;
			});
		}
		function loadCategorias() {
			businessesService.getCategorias().then(function(categorias) {
				vm.categorias = categorias;
			});
		}

		function loadBusinesses() {
			businessesService.getBusinessesByCategory(vm.selectedCategory)
				.then(function(businesses) {
					vm.businesses = businesses;
					return businesses
				})
				.then(getDistances);
		}

		function loadDestaques() {
			businessesService.getDestaques().then(function(destaques) {
					vm.destaques = destaques;
					console.log(vm.destaques)
				});
		}

		function navigate(businessId) {
			$state.go('app.business-details', { businessId: businessId });
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
