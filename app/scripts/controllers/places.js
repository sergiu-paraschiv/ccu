(function(undefined) {
    'use strict';

    var Place = this.Models.Place;
   
    this.Main.controller('PlacesCtrl', [
        '$scope', 
        
        function ($scope) {
            $scope.getPlaceImage = function (src) {
                if (src === '') {
                    return 'images/places.placeholder.png';
                }

                return src;
            };

            $scope.places = [
                new Place({
                    image: 'images/dynamic/place1.png',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608',
                    rating: 5
                }),

                new Place({
                    image: 'images/dynamic/place2.png',
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 4.5
                }),

                new Place({
                    image: 'images/dynamic/place3.png',
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 4
                }),

                new Place({
                    image: 'images/dynamic/place4.png',
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 3.5
                }),

                new Place({
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 3
                }),

                new Place({
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 2.5
                }),

                new Place({
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 2
                }),

                new Place({
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 1.5
                }),

                new Place({
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 1
                }),

                new Place({
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 0.5
                }),

                new Place({
                    title: 'City of Portland, Oxfor...',
                    address: 'St. Johns St, Right on Park Av...',
                    rating: 0
                }),

                new Place({
                    image: 'images/dynamic/place1.png',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608',
                    rating: 3.65
                })
            ];
        }
    ]);
        
}).call(this.Crosscut, this.angular);