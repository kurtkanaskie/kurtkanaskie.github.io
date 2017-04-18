var app = angular.module("app", ['ui.router']);
 
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'LoginController'
        })
        .state('secure', {
            url: '/secure',
            templateUrl: 'secure.html',
            controller: 'SecureController'
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
    $scope.login = function() {
        window.location.href = url;
    }
 
});

app.controller("LoginController", function($scope) {
 
	var url = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh&redirect_uri=https://kurtkanaskie.github.io/oidc-implicit-customers/callback.html&response_type=token+id_token&state=A&scope=openid+profile&nonce=" + Date.now();
    $scope.login = function() {
        window.location.href = url;
    }
 
});
 
app.controller("SecureController", function($scope) {
 
    $scope.accessToken = JSON.parse(window.localStorage.getItem("oidc")).oauth.access_token;
 
});

app.controller("CustomersController", function($scope, $http) {
 
    $scope.accessToken = JSON.parse(window.localStorage.getItem("oidc")).oauth.access_token;

	$http({
        method : "GET",
        url : "https://apibaas-trial.apigee.net/kurtkanaskie/sandbox/customers"
    }).then(function mySucces(response) {
      $scope.message = "OK";
      $scope.status = response.status;
      $scope.customers = response.data.entities;
    }, function myError(response) {
      $scope.message = "Uh oh";
      $scope.status = response.status;
      $scope.customers = [];
    });
 
});
