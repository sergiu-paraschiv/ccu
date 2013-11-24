(function (maps, undefined) {
    'use strict';

    this.Main.directive('map', [
        function () {
            return {
                restrict: 'E',
                transclude: false,
                replace: true,
                scope: {
                    id: '=',
                    location: '=',
                    title: '=',
                    readOnly: '=',
                    setFunction: '='
                },
                templateUrl: 'views/directives/map.html',

                controller: function ($scope, $element) {
                    var map, marker, center, directionsService, directionsDisplay;
                    var initialized = false;

                    var mapOptions = {
                        zoom: 14,
                        mapTypeId: maps.MapTypeId.ROADMAP
                    };

                    if ($scope.readOnly) {
                        mapOptions.scrollwheel = false;
                    }

                    directionsService = new maps.DirectionsService();
                    directionsDisplay = new maps.DirectionsRenderer();

                    map = new maps.Map($element[0], mapOptions);

                    function centerMap() {
                        center = new maps.LatLng($scope.location.lat, $scope.location.lng);
                        map.panTo(center);
                        marker.setPosition(center);
                    }

                    function initMap() {
                        if (initialized) {
                            centerMap();
                            return;
                        }

                        initialized = true;

                        var markerOptions = {
                            position: center,
                            map: map,
                            title: $scope.title
                        };

                        if (!$scope.readOnly) {
                            markerOptions.draggable = true;
                        }

                        marker = new maps.Marker(markerOptions);

                        centerMap();

                        if (!$scope.readOnly) {
                            maps.event.addListener(marker, 'mouseup', function () {
                                var position = marker.getPosition();

                                $scope.setFunction.call(undefined, {
                                    lat: position.lat(),
                                    lng: position.lng()
                                });
                            });
                        }
                       
                        maps.event.addDomListener(window, 'resize', function () {
                            map.setCenter(center);
                        });
                    }

                    directionsDisplay.setMap(map);

                    if ($scope.location !== undefined) {
                        initMap();
                    }

                    $scope.$watch('location', function (newData) {
                        if (newData !== undefined) {
                            initMap();
                        }
                    }, true);

                    $scope.$on('fixMaps', function (e, id) {
                        if (id !== true && $scope.id !== id) {
                            return;
                        }

                        setTimeout(function () {
                            maps.event.trigger(map, 'resize');
                            map.panTo(center);
                        }, 100);
                    });

                    $scope.$on('resetMaps', function (e, id) {
                        if (id !== true && $scope.id !== id) {
                            return;
                        }
                        centerMap();
                    });

                    $scope.$on('showDirections', function (e, config) {
                        if ($scope.id !== config.id) {
                            return;
                        }
                        
                        var request = {
                            origin: new maps.LatLng(config.latLng.lat, config.latLng.lng),
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