(function(undefined) {
    'use strict';
   
    var C = this.Constants;

    this.Main.factory('PlacesSrvc', [
        '$rootScope',
        '$http',
        'LocationSrvc',
        'PlacesMapper',
        'ReviewsMapper',

        function ($rootScope, $http, location, placesMapper, reviewsMapper) {
            
            function get(type, id, callback) {
                var url = C.PLACE.URL.GET
                                .replace('{guid}', id);

                $http.get(url).success(function (data) {
                    var place = placesMapper.mapOne(data, type);
                    place.reviews = reviewsMapper.map(data.reviews);
                    callback.call(undefined, place);
                });
            }

            function search(type, callback) {
                location.get(function (latLng) {
                    var url = C.PLACE.URL.SEARCH
                                .replace('{lat}', latLng.lat)
                                .replace('{lng}', latLng.lng)
                                .replace('{type}', type);

                    $http.get(url).success(function (data) {
                        callback.call(undefined, placesMapper.map(data.items, type));
                    });
                });
            }

            function add(place, callback) {
                var url = C.PLACE.URL.ADD
                                .replace('{type}', place.type);

                var data = placesMapper.unmapOne(place);

                $http.post(url, data).success(function (data) {
                    callback.call(undefined);
                });
            }

            return {
                get: get,
                add: add,
                search: search
            };
        }
    ]);
        
}).call(this.Crosscut);