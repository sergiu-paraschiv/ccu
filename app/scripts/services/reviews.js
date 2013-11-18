(function(undefined) {
    'use strict';
   
    var C = this.Constants;

    this.Main.factory('ReviewsSrvc', [
        '$rootScope',
        '$http',
        'UserSrvc',
        'ReviewsMapper',

        function ($rootScope, $http, user, reviewsMapper) {
            
            function add(review, reference, type, callback) {
                var url = C.REVIEW.URL.ADD
                                .replace('{type}', type);

                var data = reviewsMapper.unmapOne(review);

                user.get(function (author) {
                    data.author = author.name;
                    data.authorId = author.id;
                    data.reference = reference;

                    $http.post(url, data).success(function (data) {
                        callback.call(undefined);
                    });
                });
            }

            return {
                add: add
            };
        }
    ]);
        
}).call(this.Crosscut);