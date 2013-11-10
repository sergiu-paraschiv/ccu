(function (maps, undefined) {
    'use strict';

    this.Main.directive('map', [
        function () {
            return {
                restrict: 'E',
                transclude: false,
                replace: true,
                scope: {
                },
                templateUrl: 'views/directives/map.html',

                controller: function ($scope, $element) {
                    var map;

                    var mapOptions = {
                        zoom: 8,
                        center: new maps.LatLng(-34.397, 150.644),
                        mapTypeId: maps.MapTypeId.ROADMAP
                    };

                    map = new maps.Map($element[0], mapOptions);
                }
            };
        }
    ]);

}).call(this.Crosscut, this.google.maps);