(function(undefined) {
    'use strict';

    var C = this.Constants;
   
    this.Main.factory('LocationSrvc', [
        '$rootScope',
        'geolocation',

        function ($rootScope, geolocation) {
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

                                /*
                                self.location = {
                                    lat: 34.158442,
                                    lng: -118.133423
                                };
                                */

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

            return {
                get: get
            };
        }
    ]);
        
}).call(this.Crosscut);