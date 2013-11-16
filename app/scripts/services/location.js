(function(undefined) {
    'use strict';

    var C = this.Constants;
   
    this.Main.factory('LocationSrvc', [
        '$rootScope',
        '$http',
        'geolocation',

        function ($rootScope, $http, geolocation) {
            var self = this;

            this.location = null;

            function get(callback) {
                if (self.location === null) {
                    geolocation.getLocation()
                        .then(
                            function (data) {
                                self.location = {
                                    lat: data.coords.latitude,
                                    lng: data.coords.longitude
                                };

                                callback.call(undefined, self.location);
                            },

                            function (error) {
                                // TODO: handle this
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