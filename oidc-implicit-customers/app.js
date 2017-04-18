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
 
app.controller("HomeController", function($scope, $state) {
 
	var url = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh&redirect_uri=https://kurtkanaskie.github.io/oidc-implicit-customers/callback.html&response_type=token+id_token&state=A&scope=openid+profile&nonce=" + Date.now();
	$scope.authorize = url;

	var signedIn = window.localStorage.getItem("signedIn");
	if( signedIn === null || signedIn == "" ) {
		window.localStorage.setItem("signedIn", "not ");
	}

    $scope.login = function() {
		console.log( "log in" );
        window.location.href = url;
    }
    $scope.logout = function() {
		window.localStorage.setItem("signedIn", "not ");
		window.localStorage.setItem("oidc", "");
		$state.reload();
		console.log( "log out" );
    }

	$scope.signedIn = window.localStorage.getItem("signedIn");
	console.log( "SIGNED IN: " + $scope.signedIn );

 
});

app.controller("CustomersController", function($scope, $http) {
 
	var oidc = window.localStorage.getItem("oidc");
	console.log( "CustomersController =" + oidc + "=" );
	if( oidc === null || oidc == "" ) {
		console.log( "not log in" );
		  $scope.status = 401;
		  $scope.message = "You are not logged in";
	} else {

    	var token = JSON.parse(window.localStorage.getItem("oidc")).oauth.access_token;

		$http({
			headers: {"Authorization":"Bearer " + token},
			method : "GET",
			url : "https://tmobileh-sb05.apigee.net/atwork/v5/customers"
		}).then(function (response) {
			console.log( "Customers OK: " + response.status + JSON.stringify(response.data) );
		  $scope.status = response.status;
		  $scope.message = "OK";
		  $scope.customers = response.data.entities;
		}, function (response) {
			console.log( "Customers ERROR: " + response.status + JSON.stringify(response.data) );
		  $scope.status = response.status;
		  $scope.message = JSON.stringify(response.data);
		  $scope.customers = [];
		});
	}
 
});
