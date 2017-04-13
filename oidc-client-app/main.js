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

mainApp.controller('CustomerController', function($scope, $http) {
    $scope.message = "Here";
	$http({
		method : "GET",
		url : "https://apibaas-trial.apigee.net/kurtkanaskie/sandbox/customers"
	}).then(function mySucces(response) {
      $scope.message = "OK";
      $scope.customers = response.data.entities;
    }, function myError(response) {
      $scope.message = "Uh oh";
      $scope.customers = response.status;
	});

});
