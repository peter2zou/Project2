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
      var obj = {};
      obj.getAds = function (url) {
          var deferred = $q.defer();
          $http.get(url).then(
            function (result) {
                _ads=result.data;
                deferred.resolve(result.data);
            },
            function () {
                deferred.reject();
            });
          return deferred.promise;
      };
      obj.getMyPageData = function (adData, $scope, pageType) {
          switch (pageType) {
              case 'all':
                  $scope.ads = adData.AdItems;
                  $scope.totalItems = $scope.ads.length;
                  break;
              case 'cover50':
                  $scope.ads = adData.AdItems.filter(function (adItem) {
                      return adItem.Position == 'Cover' && adItem.NumPages >= 0.5;
                  });
                  $scope.totalItems = $scope.ads.length;
                  break;
              case 'top5ads':
                  $scope.ads = adData.Top5Ads;
                  break;
              case 'top5brands':
                  $scope.ads = adData.Top5Brands;
                  break;
          }
      };
      obj.getPageData = function ($window, $scope, pageType) {
          if (!$window.sessionStorage.getItem("AdData")) {
              obj.getAds('api/AdDataService').then(
              function (result) {
                  $window.sessionStorage.setItem("AdData", JSON.stringify(result));
                  obj.getMyPageData(result, $scope, pageType)
              },
              function () {
                  alert("Error: unable to get data");
              });
          }
          else {
              var result = JSON.parse($window.sessionStorage.getItem("AdData"));
              obj.getMyPageData(result, $scope, pageType);
          }
      };
      return obj;
  }])
 .controller("adDataAllCtrl", ["$scope", "dataService","$window",
    function ($scope, dataService,$window) {
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
            dataService.getPageData($window, $scope, 'all');
   }])
 .controller("adDataCoverCtrl", ["$scope", "dataService", "$window",
    function ($scope, dataService, $window) {
            $scope.ads = [];
            $scope.sortKey = 'BrandName';
            $scope.sortReverse = false;
            $scope.currentPage = 1;
            $scope.order = function (sortKey) {
                $scope.sortReverse = ($scope.sortKey === sortKey) ? !$scope.sortReverse : false;
                $scope.sortKey = sortKey;
            };
            $scope.pageSize = 10;
            dataService.getPageData($window, $scope,'cover50');
  }])
 .controller("adDataTop5AdsCtrl", ["$scope", "dataService","$window",
    function ($scope, dataService,$window) {
            $scope.ads = [];
            $scope.sortKey = 'NumPages';
            $scope.sortReverse = true;
            $scope.pageSize = 5;
            dataService.getPageData($window, $scope,'top5ads');
  }])
 .controller("adDataTop5BrandsCtrl", ["$scope", "dataService", "$window",
    function ($scope, dataService, $window) {
            $scope.ads = [];
            $scope.sortKey = 'NumPages';
            $scope.sortReverse = true;
            $scope.pageSize = 5;
            dataService.getPageData($window, $scope,'top5brands');
   }]);

