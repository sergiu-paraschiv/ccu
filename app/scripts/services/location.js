(function(undefined) {
    'use strict';

    var C = this.Constants;
   
    this.Main.factory('LocationSrvc', [
        '$rootScope',
        '$http',
        '$window',

        function ($rootScope, $http, $window) {
            var self = this;

            this.location = null;

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
                        }
                    );
                }
                else {
                    callback.call(undefined, self.location);
                }
            }

            function geocode(latLng, callback) {
                var url = C.LOCATION.URL.GEOCODE
                            .replace('{lat}', latLng.lat)
                            .replace('{lng}', latLng.lng);

                $http.get(url).success(function (data) {
                    callback.call(undefined, data.formatedAddress);
                });
            }

            return {
                get: get,
                geocode: geocode
            };
        }
    ]);
        
}).call(this.Crosscut);