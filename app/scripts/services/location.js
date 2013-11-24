(function(ng, undefined) {
    'use strict';

    var C = this.Constants;
   
    this.Main.factory('LocationSrvc', [
        '$rootScope',
        '$http',
        '$window',
        '$cookieStore',

        function ($rootScope, $http, $window, $cookieStore) {
            var self = this;

            this.location = null;

            var cookieLocation = $cookieStore.get('location');
            if (cookieLocation) {
                this.location = cookieLocation;
            }

            function getLocation(successCallback, errorCallback) {
                if ($window.navigator && $window.navigator.geolocation) {
                    $window.navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { timeout: 10000 });
                }
                else {
                    errorCallback.call(undefined);
                }
            }

            function get(callback) {
                if (self.location === null) {
                    getLocation(
                        function (position) {
                            self.location = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };

                            callback.call(undefined, self.location);
                        },

                        function () {
                            self.location = C.LOCATION.DEFAULT;
                            callback.call(undefined, self.location);
                        }
                    );
                }
                else {
                    callback.call(undefined, self.location);
                }
            }

            function getReal(callback) {
                getLocation(
                       function (position) {
                           var real = {
                               lat: position.coords.latitude,
                               lng: position.coords.longitude
                           };

                           callback.call(undefined, real);
                       },

                       function () {
                           var real = C.LOCATION.DEFAULT;
                           callback.call(undefined, real);
                       }
                   );
            }

            function set(position) {
                self.location = position;
                $cookieStore.put('location', position, {
                    path: '/',
                    expires: 9999
                });
            }

            function geocode(latLng, callback) {
                $rootScope.$broadcast('preloadStart');

                var url = C.LOCATION.URL.GEOCODE
                            .replace('{lat}', latLng.lat)
                            .replace('{lng}', latLng.lng);

                $http.get(url).success(function (data) {
                    callback.call(undefined, data.formatedAddress);
                    $rootScope.$broadcast('preloadEnd');
                });
            }

            return {
                get: get,
                getReal: getReal,
                set: set,
                geocode: geocode
            };
        }
    ]);
        
}).call(this.Crosscut, this.angular);