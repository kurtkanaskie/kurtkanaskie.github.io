var app = angular.module("app", ['ui.router']);
 
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .state('customers', {
            url: '/customers',
            templateUrl: 'customers.html',
            controller: 'CustomersController'
        });
    $urlRouterProvider.otherwise('/home');
});
 
app.controller("HomeController", function($scope) {
 
	var url = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh&redirect_uri=https://kurtkanaskie.github.io/oidc-implicit-customers/callback.html&response_type=token+id_token&state=A&scope=openid+profile&nonce=" + Date.now();
	$scope.authorize = url;
    $scope.login = function() {
        window.location.href = url;
    }
 
});

app.controller("CustomersController", function($scope, $http) {
 
    var token = JSON.parse(window.localStorage.getItem("oidc")).oauth.access_token;

	$http({
        headers: {"Authorization":"Bearer " + token},
        method : "GET",
        url : "https://tmobileh-sb05.apigee.net/atwork/v5/customers"
    }).then(function mySuccess(response) {
      $scope.customers = response.data.entities;
    }, function myError(response) {
	  alert("Uh oh" + response.status);
      $scope.customers = [];
    });
 
});
