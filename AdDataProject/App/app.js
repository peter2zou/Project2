angular.module('adApp', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate'])
.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
        controller: "adDataAllCtrl",
        templateUrl: "app/templates/adDataAll.tpl.html"
       })
       .when("/Cover", {
           controller: "adDataCoverCtrl",
           templateUrl: "app/templates/adDataCover.tpl.html"
       })
       .when("/Top5Ads", {
           controller: "adDataTop5AdsCtrl",
           templateUrl: "app/templates/adDataTop5Ads.tpl.html"
       })
       .when("/Top5Brands", {
           controller: "adDataTop5BrandsCtrl",
           templateUrl: "app/templates/adDataTop5Brands.tpl.html"
       })
       .otherwise({
           redirectTo: "/"
       });
    $locationProvider.html5Mode(true);
}])
.factory("dataService", ["$http", "$q", function ($http, $q) {
      var _getAds = function (url) {
          var deferred = $q.defer();
          $http.get(url).then(
            function (result) {
                deferred.resolve(result.data);
            },
            function () {
                deferred.reject();
            });
          return deferred.promise;
      };
      return {
          getAds: _getAds
      };
  }])
 .controller("adDataAllCtrl", ["$scope", "dataService",
        function ($scope, dataService) {
            $scope.ads = [];
            $scope.totalItems = $scope.ads.length;
            $scope.sortKey = 'BrandName';
            $scope.sortReverse = false;
            $scope.currentPage = 1;
            $scope.order = function (sortKey) {
                $scope.sortReverse = ($scope.sortKey === sortKey) ? !$scope.sortReverse : false;
                $scope.sortKey = sortKey;
            };
            $scope.pageSize = 10;
            dataService.getAds('api/AdDataService/GetAll').then(
            function (result) {
                $scope.ads = result;
                $scope.totalItems = $scope.ads.length;
            },
            function () {
                alert("Error: unable to get data");
            });
  }])
 .controller("adDataCoverCtrl", ["$scope", "dataService",
         function ($scope, dataService) {
            $scope.ads = [];
            $scope.totalItems = $scope.ads.length;
            $scope.sortKey = 'BrandName';
            $scope.sortReverse = false;
            $scope.currentPage = 1;
            $scope.order = function (sortKey) {
                $scope.sortReverse = ($scope.sortKey === sortKey) ? !$scope.sortReverse : false;
                $scope.sortKey = sortKey;
            };
            $scope.pageSize = 10;
            dataService.getAds('api/AdDataService/GetCover').then(
            function (result) {
                $scope.ads = result;
                $scope.totalItems = $scope.ads.length;
            },
            function () {
                alert("Error occured: unable to get data");
            });
  }])
 .controller("adDataTop5AdsCtrl", ["$scope", "dataService",
        function ($scope, dataService) {
            $scope.ads = [];
            $scope.sortKey = 'NumPages';
            $scope.sortReverse = true;
            $scope.pageSize = 5;
            dataService.getAds('api/AdDataService/GetTop5Ads').then(
            function (result) {
                $scope.ads = result;
            },
            function () {
                alert("an error occured: unable to get data");
            });
  }])
 .controller("adDataTop5BrandsCtrl", ["$scope", "dataService",
        function ($scope, dataService) {
            $scope.ads = [];
            $scope.sortKey = 'NumPages';
            $scope.sortReverse = true;
            $scope.pageSize = 5;
            dataService.getAds('api/AdDataService/GetTop5ByBrands').then(
            function (result) {
                $scope.ads = result;
            },
            function () {
                alert("Error occured: unable to get data");
            });
 }]);



