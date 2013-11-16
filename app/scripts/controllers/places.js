(function(undefined) {
    'use strict';

    var Place = this.Models.Place;
   
    var C = this.Constants;

    this.Main.controller('PlacesCtrl', [
        '$scope',
        '$stateParams',
        '$rootScope',
        'PlacesSrvc',
        
        function ($scope, $stateParams, $rootScope, places) {
            $scope.C = C;

            $scope.places = [];

            function init() {
                places.search($stateParams.type, function (placesList) {
                    $scope.places = placesList;
                });
            }

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