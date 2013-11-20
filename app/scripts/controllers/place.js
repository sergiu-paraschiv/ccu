(function(undefined) {
    'use strict';

    var Place = this.Models.Place;
   
    this.Main.controller('PlaceCtrl', [
        '$scope',
        '$rootScope',
        '$stateParams',
        'PlacesSrvc',
        'LocationSrvc',

        function ($scope, $rootScope, $stateParams, places, location) {
            $scope.place = {};

            $scope.currentTab = function (tab) {
                return $stateParams.type === tab;
            };

            $scope.showDirections = function () {
                location.get(function (latLng) {
                    $rootScope.$broadcast('showDirections', {
                        latLng: latLng,
                        id: 'place'
                    });
                })                
            };

            $scope.$on('reviewAdded', function () {
                init();
            });

            $scope.addReview = function () {
                $rootScope.$broadcast('addReview', { reference: $scope.place.reference });
            };

            function init() {
                places.get($stateParams.type, $stateParams.id, function (place) {
                    $scope.place = place;
                });
            }

            init();
        }
    ]);
        
}).call(this.Crosscut);