var app = angular.module("app", ['ui.router']);

var REDIRECT_URL = "https://kurtkanaskie.github.io/oidc-client-code-google-x/callback.html";
var API_HOST = "https://xapi-test.kurtkanaskie.net";
var OIDC_BASEPATH = API_HOST + "/oidc-google/v1/oauth";
var OIDC_AUTH = API_HOST + "/oidc-google/v1/oauth/authorize";
var OIDC_TOKEN = API_HOST + "/oidc-google/v1/oauth/token";
var OIDC_REVOKE = API_HOST + "/oidc-google/v1/oauth/revoke";
var HEALTHCARE_BASESPATH = API_HOST + "/google-healthcare/v1beta1";
var HEALTHCARE_LOCATION_DATASETS = HEALTHCARE_BASESPATH + "/projects/edge-oidc-demo/locations/us/datasets/demo";

// App = oidc-v1-google-demo-app-test
var CLIENT_ID = "BSfd4gOSAE3AIO0WGEh2Y4JLUYx2MhgoltvH3PHLpXDoy2dL";
var CLIENT_SECRET = "yCL5DNiLUllbdyxIz6c1kZXdEomG4RYkpVyjFGlX5CAnI8ZOsiv1MgAmQGz3Gx7C";

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .state('callback', {
            url: '/callback',
            templateUrl: 'callback.html',
            controller: 'CallbackController'
        })
        .state('userinfo', {
            url: '/userinfo',
            templateUrl: 'userinfo.html',
            controller: 'UserinfoController'
        })
        .state('ping', {
            url: '/ping',
            templateUrl: 'ping.html',
            controller: 'PingstatusPingController'
        })
        .state('demo', {
            url: '/location_datasets',
            templateUrl: 'location_datasets.html',
            controller: 'LocationDatasetController'
        });
    $urlRouterProvider.otherwise('/home');
});

app.controller("CallbackController", function($scope, $http, $window) {
    console.log( "CallbackController" );

    var oidc = $window.localStorage.getItem("oidc");
    // local storage can only hold strings, if not set "null"
    if( oidc === null || oidc === "" ) {
      $scope.status = 401;
      $scope.message = "You are not authorized";
    } else {
      var code = JSON.parse($window.localStorage.getItem("oidc")).oauth.code;
      var data = { 
        grant_type:'authorization_code',
        code:code,
        redirect_uri:REDIRECT_URL
      };
      var fpdata = Object.keys(data).map((key) => { 
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]); 
      }).join('&');

      console.log( "FPDATA: " + JSON.stringify(fpdata));

      $http({
        headers: {
          "Content-Type":"application/x-www-form-urlencoded",
          "Authorization":"Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET)
        },
        method : "POST",
        url : OIDC_BASEPATH + "/token",
        data : fpdata
      }).then(function successCallback(response) {
        console.log( "POST /token request: " + OIDC_BASEPATH + "/token" );
        console.log( "POST /token OK: " + response.status);
        console.log( "POST /token response: " + JSON.stringify(response.data) );
        $scope.status = response.status;
        $scope.message = "OK";
        $scope.tokenResponse = response.data;

        var oidc = {
          oauth: {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token
          }
        };
        window.localStorage.setItem("oidc", JSON.stringify(oidc));
        console.log( "OIDC: " + JSON.stringify(oidc));
      }, function errorCallback(response) {
        console.log( "POST /token ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
        $scope.status = response.status;
        $scope.message = response.statusText;
        $scope.tokenResponse = {};
        window.localStorage.setItem("oidc", "");
        alert("Problem getting access_token");
      });
    }
    var url = $window.location.href;
    var gohome = url.replace("#/callback","#/home");
    $window.location.href = gohome;
});

app.controller("HomeController", function($scope, $http, $state, $window) {
    console.log( "HomeController" );

    $scope.login = function() {
      var url = $window.location.href;
      var redirect = url.replace("index.html#/home","callback.html");
      var authorize = OIDC_BASEPATH + "/authorize" 
          + "?client_id=" + CLIENT_ID
          + "&redirect_uri=" + REDIRECT_URL
          + "&response_type=code"
          + "&state=PA-code"
          + "&scope=READ WRITE CODE";

      console.log( "URL: " + url );
      console.log( "REDIRECT: " + redirect);
      console.log( "AUTHORIZE: " + authorize );

      $window.location.href = authorize;
    };

    $scope.logout = function() {
      var token = JSON.parse($window.localStorage.getItem("oidc")).oauth.access_token;
      console.log( "LOGOUT token: " + token );
      $window.localStorage.setItem("oidc", "");
      
      $http({
            headers: {"Authorization":"Bearer " + token},
            method : "POST",
            url : OIDC_REVOKE
        }).then(function successCallback(response) {
          // console.log( "Setting SCOPE out via REVOKE POST" );
          $scope.inOrOut = "out";
        }, function errorCallback(response) {
          alert("Error Logging out!\n" + response.status + "\n" + response.statusText + "\n" + JSON.stringify(response.data, undefined, 2) );
        });
    };

    var oidc = $window.localStorage.getItem("oidc");
    // console.log( "SCOPE: " + $scope.inOrOut + " oidc " + oidc);
    if( oidc === null || oidc === "" ) {
      $scope.inOrOut = "out";
    } else {
		  $scope.inOrOut = "in";
	}
 
});

app.controller("PingstatusPingController", function($scope, $http, $window) {
    console.log( "PingstatusPingController" );
 
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
            url : API_HOST + "/pingstatus-oauth/v1/ping"
        }).then(function successCallback(response) {
          // console.log( "Ping OK: " + response.status + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = "OK";
          $scope.ping = JSON.stringify(response.data, undefined, 2);
        }, function errorCallback(response) {
          // console.log( "Ping ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
          $scope.status = response.status;
          $scope.message = response.statusText;
          $scope.ping = JSON.stringify(response.data, undefined, 2);
        });
    }
 
});

app.controller("UserinfoController", function($scope, $http, $window) {
    console.log( "UserinfoController" );
 
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
          url : OIDC_BASEPATH + "/userinfo"
      }).then(function successCallback(response) {
        // console.log( "Profile OK: " + response.status + JSON.stringify(response.data) );
        $scope.status = response.status;
        $scope.message = "OK";
        $scope.userinfo = JSON.stringify(response.data, undefined, 2);
      }, function errorCallback(response) {
        // console.log( "Profile ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
        $scope.status = response.status;
        $scope.message = response.statusText;
        $scope.userinfo = JSON.stringify(response.data, undefined, 2);
      });
    }
 
});

app.controller("LocationDatasetController", function($scope, $http, $window) {
    console.log( "LocationDatasetController" );
 
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
          url : HEALTHCARE_LOCATION_DATASETS
      }).then(function successCallback(response) {
        console.log( "Location Dataset OK: " + response.status + JSON.stringify(response.data) );
        $scope.status = response.status;
        $scope.message = "OK";
        $scope.location_datasets = JSON.stringify(response.data, undefined, 2);
      }, function errorCallback(response) {
        console.log( "Location Dataset ERROR: " + response.status + " - " + response.statusText + " - " + JSON.stringify(response.data) );
        $scope.status = response.status;
        $scope.message = response.statusText;
        $scope.location_datasets = JSON.stringify(response.data, undefined, 2);
      });
    }
 
});

