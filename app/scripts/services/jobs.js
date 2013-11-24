(function(undefined) {
    'use strict';
   
    var C = this.Constants;

    this.Main.factory('JobsSrvc', [
        '$rootScope',
        '$http',
        'LocationSrvc',
        'UserSrvc',
        'JobsMapper',

        function ($rootScope, $http, location, user, jobsMapper) {

            function search(type, callback) {
                $rootScope.$broadcast('preloadStart');
                location.get(function (latLng) {
                    var url = C.JOB.URL.SEARCH
                                .replace('{lat}', latLng.lat)
                                .replace('{lng}', latLng.lng)
                                .replace('{type}', type);

                    $http.get(url).success(function (data) {
                        callback.call(undefined, jobsMapper.map(data.items, type));
                        $rootScope.$broadcast('preloadEnd');
                    });
                });
            }

            function add(job, callback) {
                $rootScope.$broadcast('preloadStart');

                var url = C.JOB.URL.ADD
                                .replace('{due}', '12.12.2014')
                                .replace('{type}', job.type);

                var data = jobsMapper.unmapOne(job);

                user.get(function (publisher) {
                    data.publisherId = publisher.id;

                    $http.post(url, data).success(function (data) {
                        callback.call(undefined);
                        $rootScope.$broadcast('preloadEnd');
                    });
                });
                
            }

            return {
                add: add,
                search: search
            };
        }
    ]);
        
}).call(this.Crosscut);