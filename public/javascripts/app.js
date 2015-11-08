/*
 * CLX
 */

 (function(){
   angular.module('app', [
     'ngRoute',
     'chart.js'
   ])
   //. other stuff
   .config(['$routeProvider', '$locationProvider',
   function($routeProvider, $locationProvider) {

     $routeProvider
     .when('/metrics', {
       controller: 'MetricsCtrl',
       templateUrl: 'templates/metrics.html'
     })
     .when('/', {
       redirectTo: '/metrics'
     });
   }]);
 })();
