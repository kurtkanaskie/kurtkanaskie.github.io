var example = angular.module("example", ['ui.router']);
 
example.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'LoginController'
        })
        .state('secure', {
            url: '/secure',
            templateUrl: 'secure.html',
            controller: 'SecureController'
        });
    $urlRouterProvider.otherwise('/login');
});
 
example.controller("LoginController", function($scope) {
 
	var url = "https://tmobileh-sb05.apigee.net/oidc-core/oauth2/authorize?client_id=AO7wf24CFswJeX6UmaKdbRcJ1uhMJaoh&redirect_uri=https://kurtkanaskie.github.io/oidc-implicit&response_type=token+id_token&state=A&scope=openid+profile&nonce=" + Date.now();
    $scope.login = function() {
        window.location.href = url;
    }
 
});
 
example.controller("SecureController", function($scope) {
 
    $scope.accessToken = JSON.parse(window.localStorage.getItem("oidc")).oauth.access_token;
 
});
