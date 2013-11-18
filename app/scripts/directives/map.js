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
                    var map, marker, center, directionsService, directionsDisplay;

                    
                    var mapOptions = {
                        zoom: 14,
                        mapTypeId: maps.MapTypeId.ROADMAP,
                        scrollwheel: false
                    };

                    directionsService = new maps.DirectionsService();
                    directionsDisplay = new maps.DirectionsRenderer();

                    map = new maps.Map($element[0], mapOptions);

                    directionsDisplay.setMap(map);

                    $scope.$watch('location', function (newData, oldData) {
                        if (oldData === undefined && newData !== undefined) {
                            center = new maps.LatLng($scope.location.lat, $scope.location.lng);

                            map.panTo(center);

                            marker = new maps.Marker({
                                position: center,
                                map: map,
                                title: $scope.title
                            });

                            maps.event.addDomListener(window, 'resize', function () {
                                map.setCenter(center);
                            });

                        }
                    }, true);

                    $scope.$on('showDirections', function (e, latLng) {
                        var request = {
                            origin: new maps.LatLng(latLng.lat, latLng.lng),
                            destination: center,
                            travelMode: maps.TravelMode.DRIVING
                        };

                        directionsService.route(request, function (response, status) {
                            if (status === maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                            }
                        });
                    });
                }
            };
        }
    ]);

}).call(this.Crosscut, this.google.maps);