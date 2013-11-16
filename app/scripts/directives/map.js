(function (maps, undefined) {
    'use strict';

    this.Main.directive('map', [
        function () {
            return {
                restrict: 'E',
                transclude: false,
                replace: true,
                scope: {
                    location: '=',
                    title: '='
                },
                templateUrl: 'views/directives/map.html',

                controller: function ($scope, $element) {
                    var map, marker, center;

                    var mapOptions = {
                        zoom: 8,
                        mapTypeId: maps.MapTypeId.ROADMAP
                    };

                    map = new maps.Map($element[0], mapOptions);

                    $scope.$watch('location', function (newData, oldData) {
                        if (oldData === undefined && newData !== undefined) {
                            center = new maps.LatLng($scope.location.lat, $scope.location.lng);

                            map.panTo(center);

                            marker = new maps.Marker({
                                position: center,
                                map: map,
                                title: $scope.title
                            });

                        }
                    }, true);
                }
            };
        }
    ]);

}).call(this.Crosscut, this.google.maps);