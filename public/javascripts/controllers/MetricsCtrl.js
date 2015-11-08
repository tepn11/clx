/**
 * MetricCtrl
 *
 * @description View metrics
 */
(function() {
  angular.module('app')
  /**
   * MetricCtrl.index
   * @description Metrics chart
   */
  .controller('MetricsCtrl', [
    '$scope', '$rootScope',
    function($scope, $rootScope, channel, nsds) {
      $rootScope.pageTitle = 'Metrics';

      //controller code here
      $scope.prices = {};
      $scope.prices.labels = ["Less than $1,000", "$1,000 to $5,000", "$5,001 to $10,000", "$10,001 to $20,000", "$20,001 upwards"];
      $scope.prices.data = [300, 500, 100, 40, 120];

      $scope.mileage = {};
      $scope.mileage.labels = ["Less than 10,000 miles", "10,001 to 25,000 miles", "25,001 to 50,000 miles", "50,001 to 100,000 miles", "100,001 miles upwards"];
      $scope.mileage.data = [30, 300, 180, 150, 220];

      $scope.brands = {};
      $scope.brands.labels = ["July", "August", "September", "October", "November", "December"];
      $scope.brands.series = ["BMW","Ford","GM", "Honda", "Toyota", "Others"];
      $scope.brands.data = [
        [323, 310, 280, 250, 420, 560],
        [313, 330, 220, 210, 390, 490],
        [302, 290, 180, 230, 320, 510],
        [223, 250, 180, 150, 220, 460],
        [253, 210, 80, 130, 220, 470],
        [873, 920, 980, 1250, 1220, 1560],
      ];
    }
  ]);
})();
