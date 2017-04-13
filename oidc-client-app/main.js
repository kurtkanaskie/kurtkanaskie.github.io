var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: 'home.html',
			controller: 'HomeController'
		})
		.when('/viewCustomers', {
			templateUrl: 'viewCustomers.html',
			controller: 'CustomerController'
		})
		.otherwise({
			redirectTo: '/home'
		});
});

mainApp.controller('HomeController', function($scope) {
	$scope.message = "Click to view customers.";
});

mainApp.controller('CustomerController', function($scope) {
	$http({
		method : "GET",
		url : "https://apibaas-trial.apigee.net/kurtkanaskie/sandbox/customers"
	}).then(function mySucces(response) {
      $scope.customers = response.data.entities;
    }, function myError(response) {
      $scope.customers = response.status;
	});

});
