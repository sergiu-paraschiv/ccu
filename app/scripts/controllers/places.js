(function(undefined) {
    'use strict';

    var Place = this.Models.Place;
   
    var C = this.Constants;

    this.Main.controller('PlacesCtrl', [
        '$scope',
        '$stateParams',
        '$rootScope',
        'PlacesSrvc',
        'ResponsiveSrvc',
        
        function ($scope, $stateParams, $rootScope, places, responsive) {
            $scope.C = C;

            $scope.places = [];
            $scope.haveMore = true;
            $scope.perPage = C.PLACE.PER_PAGE;
            $scope.endAt = C.PLACE.PER_PAGE;

            function setLayout() {
                if (responsive.isXDPI()) {
                    $scope.perPage = C.PLACE.PER_PAGE_XDPI;
                }
                else {
                    $scope.perPage = C.PLACE.PER_PAGE;
                }
            }

            function init() {
                setLayout();

                places.search($stateParams.type, function (placesList) {
                    $scope.places = placesList;
                    $scope.page = 1;
                    $scope.haveMore = true;
                });
            }
            
            $scope.$on('responsiveLayoutChanged', setLayout);

            $scope.pagedPlaces = function () {
                var paged = $scope.places.slice(0, $scope.endAt);

                if (paged.length === $scope.places.length) {
                    $scope.haveMore = false;
                }

                return paged;
            };

            $scope.loadMore = function () {
                $scope.endAt += $scope.perPage;
            };

            $scope.currentTab = function (tab) {
                return $stateParams.type === tab;
            };

            $scope.getPlaceImage = function (src) {
                if (src === '') {
                    return 'images/places.placeholder.png';
                }

                return src;
            };

            $scope.$on('placeAdded', function () {
                init();
            });

            $scope.addPlace = function () {
                $rootScope.$broadcast('addPlace', { type: $stateParams.type });
            };

            init();
        }
    ]);
        
}).call(this.Crosscut);