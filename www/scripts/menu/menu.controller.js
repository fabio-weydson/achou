(function() {
	'use strict';
	var MenuController = function($scope, businessesService) {
	  $scope.menu = false;
			var vm = angular.extend(this, {
			categorias: null
		});

(function activate() {

			loadCategorias();


		})();

$scope.smenu = function() {
	if($scope.menu==false) {
			$scope.menu = true;
		} else {
			$scope.menu = false;
		}
		localStorage.setItem('categoria', 'Tom');
		}
function loadCategorias() {
			businessesService.getCategorias().then(function(categorias) {
				vm.categorias = categorias;
			});
		}
function loadCat() {
			businessesService.getBusinessesByCategory('Health').then(function(cat) {
				console.log(cat)
			});
		}
	}
	angular
		.module('bizdir.menu')
		.controller('MenuController', MenuController);

	MenuController.$inject = ['$scope','businessesService'];


	
})();