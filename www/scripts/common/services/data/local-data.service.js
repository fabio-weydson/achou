(function() {
	'use strict';

	angular
		.module('bizdir.common')
		.factory('localDataService', localDataService);

	localDataService.$inject = ['$http', '$q', '_', 'ENV'];

	/* @ngInject */
	function localDataService($http, $q, _, ENV) {
		var catalogs = {};
		var products = {};
		var services = {};
		var news = {};
		var businesses;
		var destaques={};
		var categorias={};
		var common;
		// ENV.apiUrl + 
		var commonUrl = 'misc/common.json';
		// var businessUrl = 'misc/businesses2.json';
		var destaquesUrl = 'misc/destaques.json';
		// var categoriesUrl = 'misc/categories.json';

		var businessUrl = 'http://helloradio.com.br/apps/achou/businesses2.json';
		var categoriesUrl = 'http://helloradio.com.br/apps/achou/categories.json';
		// var destaquesUrl = 'http://helloradio.com.br/apps/achou/destaques.json';

		var service = {
			getBusinesses: getBusinesses,
			getBusiness: getBusiness,
			getDestaques: getDestaques,
			getCategorias: getCategorias,
			getBusinessesByCategory: getBusinessesByCategory,
			getCategories: getCategories,
			getCatalogs: getCatalogs,
			getCatalog: getCatalog,
			getCommon: getCommon,
			getProducts: getProducts,
			getProduct: getProduct,
			getServices: getServices,
			getService: getService,
			getArticle: getArticle,
			getArticles: getArticles,
			getReviews: getReviews,
			addReview: addReview
		};
		return service;

		// ***********************************************************************

		function getArticles(businessId) {
			return getBusiness(businessId).then(function(business) {
				return $http.get(business.news)
					.then(function(response) {
						news[businessId] = response.data.result;
						return news[businessId];
					});
			})
		}

		function getArticle(businessId, articleId) {
			var promise;
			if (services[businessId]) {
				promise = $q.when(news[businessId]);
			} else {
				promise = getArticles(businessId);
			}

			return promise.then(function(items) {
				return _.find(items, function(item) {
					return item.guid == articleId;
				});
			});
		}

		function getServices(businessId) {
			return getBusiness(businessId).then(function(business) {
				return $http.get(business.services)
					.then(function(response) {
						services[businessId] = response.data.result;
						return services[businessId];
					});
			});
		}

		function getService(businessId, serviceId) {
			var promise;
			if (services[businessId]) {
				promise = $q.when(services[businessId]);
			} else {
				promise = getServices(businessId);
			}

			return promise.then(function(items) {
				return _.find(items, function(item) {
					return item.guid == serviceId;
				});
			});
		}

		function getProducts(businessId) {
			return getBusiness(businessId).then(function(business) {
				return $http.get(business.products)
					.then(function(response) {
						products[businessId] = response.data.result;
						return products[businessId];
					});
			});
		}

		function getProduct(businessId, productId) {
			var promise;
			if (products[businessId]) {
				promise = $q.when(products[businessId]);
			} else {
				promise = getProducts(businessId);
			}

			return promise.then(function(items) {
				return _.find(items, function(item) {
					return item.guid == productId;
				});
			});
		}

		function getCategories() {
			return getBusinesses().then(function(businesses) {
				var categories = _.map(businesses, function(business) {
					return business.category;
				});
				categories = ['Todas'].concat(_.sortBy(_.unique(categories)));
				return categories;
			});
		}

		function getBusinessesByCategory(category) {
			var promise;

			if (businesses) {
				promise = $q.when(businesses);
			} else {
				promise = getBusinesses();
			}

			return promise.then(function(businesses) {
				return _.filter(businesses, function(business) {
					return category === 'Todas' || business.category === category;
				})
			});
		}

		function getBusinesses() {
			return $http.get(businessUrl).then(function(response) {
				businesses = response.data.result;
				return businesses;
			});
		}

		function getDestaques() {
			return $http.get(destaquesUrl).then(function(response) {
				destaques = response.data.result;
				return destaques;
			});
		}

		function getCategorias() {
		
			return $http.get(categoriesUrl).then(function(response) {
				categorias = response.data.categorias;
				return categorias;

			});
		}

		function getBusiness(businessId) {
			var promise;

			if (businesses) {
				promise = $q.when(businesses);
			} else {
				promise = getBusinesses();
			}

			return promise.then(function(businesses) {
				var business = _.find(businesses, function(business) {
					return business.guid === businessId;
				});
				business = enrichBusiness(business);
				return business;
			});
		}

		function enrichBusiness(item) {
			if (!item.rating) {
				item.rating = {
					value: 0,
					reviews: 0
				}
			}
			return item;
		}

		function getCatalogs(businessId) {
			return getBusiness(businessId).then(function(business) {
				return $http.get(business.catalogs)
					.then(function(response) {
						catalogs[businessId] = response.data.result;
						return catalogs[businessId];
					});
			});
		}

		function getCatalog(businessId, catalogId) {
			var promise;
			if (catalogs[businessId]) {
				promise = $q.when(catalogs[businessId]);
			} else {
				promise = getCatalogs(businessId);
			}

			return promise.then(function(items) {
				return _.find(items, function(item) {
					return item.guid == catalogId;
				});
			});
		}

		function getReviews(businessId) {
			return $q.when([{
				author: 'João da Silva',
				comment: 'Ótimo Atendimento',
				date: 1,
				value: 4
			}, {
				author: 'José Augusto',
				comment: 'Pertinho de casa',
				date: 2
			}, {
				author: 'Maria das Graças',
				comment: 'Lindo. Adorei.',
				date: 3
			}]);
		}

		function addReview(review) {
			alert('Em desenvolvimento');
			return $q.when(true);
		}

		function getCommon() {
			return $http.get(commonUrl).then(function(response) {
				common = response.data.result;
				return common;
			});
		}
	}
})();
