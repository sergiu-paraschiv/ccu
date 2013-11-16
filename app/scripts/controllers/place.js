(function(undefined) {
    'use strict';

    var Place = this.Models.Place;
   
    this.Main.controller('PlaceCtrl', [
        '$scope', 
        '$stateParams',
        'PlacesSrvc',

        function ($scope, $stateParams, places) {
            $scope.place = {};

            $scope.currentTab = function (tab) {
                return $stateParams.type === tab;
            };

            places.get($stateParams.type, $stateParams.id, function (place) {
                $scope.place = place;
            });
        }
    ]);
        
}).call(this.Crosscut);