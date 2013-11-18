(function(undefined) {
    'use strict';

    var Place = this.Models.Place;
   
    this.Main.controller('PlacesCtrl', [
        '$scope',
        '$rootScope',
        
        function ($scope, $rootScope) {
            $scope.getPlaceImage = function (src) {
                if (src === '') {
                    return 'images/places.placeholder.png';
                }

                return src;
            };

            $scope.addPlace = function () {
                $rootScope.$broadcast('addPlace', {});
            };

            $scope.places = [
                new Place({
                    id: 1,
                    image: 'images/dynamic/place1.png',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608',
                    rating: 5
                }),

                new Place({
                    id: 2,
                    image: 'images/dynamic/place2.png',
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 4.5
                }),

                new Place({
                    id: 3,
                    image: 'images/dynamic/place3.png',
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 4
                }),

                new Place({
                    id: 4,
                    image: 'images/dynamic/place4.png',
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 3.5
                }),

                new Place({
                    id: 5,
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 3
                }),

                new Place({
                    id: 6,
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 2.5
                }),

                new Place({
                    id: 7,
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 2
                }),

                new Place({
                    id: 8,
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 1.5
                }),

                new Place({
                    id: 9,
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 1
                }),

                new Place({
                    id: 10,
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 0.5
                }),

                new Place({
                    id: 11,
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 0
                }),

                new Place({
                    id: 12,
                    image: 'images/dynamic/place1.png',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608',
                    rating: 3.65
                })
            ];
        }
    ]);
        
}).call(this.Crosscut);