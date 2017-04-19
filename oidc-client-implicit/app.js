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
 
app.controller("HomeController", function($scope, $state, $window) {
 
    var url = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize" 
		+ "?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh"
		+ "&redirect_uri=https://kurtkanaskie.github.io/oidc-client-implicit/callback.html"
		+ "&response_type=token+id_token"
		+ "&state=A"
		+ "&scope=openid+profile&nonce=" + Date.now();

		console.log( "Home URI: " + $window.location.href );

    $scope.login = function() {
        $window.location.href = url;
    }
    $scope.logout = function() {
        $window.localStorage.setItem("oidc", "");
        $state.reload();
    }

    var oidc = $window.localStorage.getItem("oidc");
    if( oidc === null || oidc === "" ) {
        $scope.inOrOut = "out";
    } else {
		$scope.inOrOut = "in";
	}
 
});

app.controller("CustomersController", function($scope, $http, $window) {
 
    var oidc = $window.localStorage.getItem("oidc");
    // local storage can only hold strings, if not set "null"
    if( oidc === null || oidc === "" ) {
          $scope.status = 401;
          $scope.message = "You are not logged in";
    } else {

        var token = JSON.parse($window.localStorage.getItem("oidc")).oauth.access_token;

        $http({
            headers: {"Authorization":"Bearer " + token},
            method : "GET",
            url : "https://tmobileh-sb05.apigee.net/atwork/v5/customers"
        }).then(function (response) {
          // console.log( "Customers OK: " + response.status + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = "OK";
          $scope.customers = response.data.entities;
        }, function (response) {
          // console.log( "Customers ERROR: " + response.status + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = JSON.stringify(response.data);
          $scope.customers = [];
        });
    }
 
});
