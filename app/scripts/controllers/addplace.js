(function(undefined) {
    'use strict';
   
    var Place = this.Models.Place;

    this.Main.controller('AddPlaceCtrl', [
        '$scope', 
        '$rootScope',
        'PlacesSrvc',
        'LocationSrvc',

        function ($scope, $rootScope, places, location) {
            $scope.visible = false;

            $scope.place = null;

            $scope.currentTab = function (tab) {
                if (!$scope.place) {
                    return false;
                }

                return $scope.place.type === tab;
            };

            $scope.$on('addPlace', function (e, config) {
                $scope.place = new Place({ address: {} }, config.type);                

                $rootScope.$broadcast('showModal');
                $scope.visible = true;
            });

            $scope.setLocation = function () {

            };

            $scope.clear = function (fieldName) {
                $scope.place[fieldName] = '';
            };

            function hide() {
                $rootScope.$broadcast('hideModal');
                $scope.visible = false;
            }

            $scope.cancel = hide;

            $scope.save = function () {
                places.add($scope.place, function () {
                    $rootScope.$broadcast('placeAdded');
                    hide();
                })
            };
        }
    ]);
        
}).call(this.Crosscut);