(function($, undefined) {
    'use strict';
    
    this.Crosscut = {
        Models: {}
    };
    
    this.Crosscut.exports = function(where, what) {
        $.extend(true, where, what);
    };

}).call(this, this.jQuery);
(function(undefined) {
    'use strict';
    
    this.Constants = {
        PLACE: {
            URL: {
                SEARCH: 'https://gcdc2013-crosscut.appspot.com/_ah/api/places/v1/places?lat={lat}&long={lng}&type={type}',
                GET: 'https://gcdc2013-crosscut.appspot.com/_ah/api/places/v1/places/{guid}',
                ADD: 'https://gcdc2013-crosscut.appspot.com/_ah/api/places/v1/add/{type}'
            },

            TYPE: {
                SHELTER: 'SHELTER',
                FOOD_PANTRIES: 'FOOD_PANTRIES',
                FOOD_BANK: 'FOOD_BANK',
                TRANSITIONAL_HOUSING: 'TRANSITIONAL_HOUSING',
                HEALTH: 'HEALTH'
            }
        },

        LOCATION: {
            URL: {
                GEOCODE: 'https://gcdc2013-crosscut.appspot.com/_ah/api/location/v1/locations?lat={lat}&long={lng}'
            }
        }
    };

}).call(this.Crosscut);
(function(ng, undefined) {
    'use strict';
   
    var module = ng.module('Crosscut', [
        'ui.router',
        'geolocation'
    ]);
    
    module.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                controller: 'MainCtrl',
                views: {
                    'content': {
                        templateUrl: 'views/home.html',
                        controller: 'HomeCtrl'
                    }
                }    
            })
            
            .state('places', {
                url: '/places/{type}',
                views: {
                    'content': {
                        templateUrl: 'views/places.html',
                        controller: 'PlacesCtrl'
                    },
                    'addPlace': {
                        templateUrl: 'views/addplace.html',
                        controller: 'AddPlaceCtrl'
                    }
                }    
            })

            .state('place', {
                url: '/places/{type}/place/{id}',
                views: {
                    'content': {
                        templateUrl: 'views/place.html',
                        controller: 'PlaceCtrl'
                    }
                }
            })
            
            .state('jobs', {
                url: '/jobs',
                views: {
                    'content': {
                        templateUrl: 'views/jobs.html',
                        controller: 'JobsCtrl'
                    }
                }    
            })
            
            .state('news', {
                url: '/news',
                views: {
                    'content': {
                        templateUrl: 'views/news.html',
                        controller: 'NewsCtrl'
                    }
                }    
            });
    });
    
    this.exports(this, {
        Main: module
    });
    
}).call(this.Crosscut, this.angular);
(function (undefined) {
    'use strict';

    this.Main.directive('rating', [
        function () {
            return {
                restrict: 'E',
                transclude: false,
                replace: true,
                scope: {
                    value: '='
                },
                templateUrl: 'views/directives/rating.html',

                controller: function ($scope) {
                    $scope.getRatingClass = function () {
                        return ('r' + (Math.ceil($scope.value * 2) / 2).toFixed(1)).replace('.', '');
                    };
                }
            };
        }
    ]);

}).call(this.Crosscut);
(function (maps, undefined) {
    'use strict';

    this.Main.directive('map', [
        function () {
            return {
                restrict: 'E',
                transclude: false,
                replace: true,
                scope: {
                    location: '=',
                    title: '='
                },
                templateUrl: 'views/directives/map.html',

                controller: function ($scope, $element) {
                    var map, marker, center;

                    var mapOptions = {
                        zoom: 8,
                        mapTypeId: maps.MapTypeId.ROADMAP
                    };

                    map = new maps.Map($element[0], mapOptions);

                    $scope.$watch('location', function (newData, oldData) {
                        if (oldData === undefined && newData !== undefined) {
                            center = new maps.LatLng($scope.location.lat, $scope.location.lng);

                            map.panTo(center);

                            marker = new maps.Marker({
                                position: center,
                                map: map,
                                title: $scope.title
                            });

                        }
                    }, true);
                }
            };
        }
    ]);

}).call(this.Crosscut, this.google.maps);
(function ($, undefined) {
    'use strict';

    this.Main.directive('isFocused', [
        function () {
            return {
                restrict: 'A',

                controller: function ($scope, $element) {
                    $element.focus(function () {
                        $(this).parent().delay(100).queue(function(next){
                            $(this).addClass('focused');
                            next();
                        });
                    });

                    $element.blur(function () {
                        $(this).parent().delay(500).queue(function (next) {
                            $(this).removeClass('focused');
                            next();
                        });
                    });
                }
            };
        }
    ]);

}).call(this.Crosscut, this.jQuery);
(function (undefined) {
    'use strict';

    function Place(data, type) {
        this.id = data.gReference;
        this.image = '';
        this.title = data.name || '';
        this.description = data.description || '';
        this.address = data.address.formatedAddress || '';
        this.phone = data.address.formatedPhone || '';
        this.rating = data.averageRating || 0;
        this.location = {
            lat: data.address.latitude || 0,
            lng: data.address.longitude || 0
        };
        this.type = type || '';
    }

    this.exports(this.Models, {
        Place: Place
    });

}).call(this.Crosscut);
(function (undefined) {
    'use strict';

    function Job(data) {
        this.icon = data.icon || '';
        this.date = data.date || '';
        this.title = data.title || '';
        this.address = data.address || '';
    }

    this.exports(this.Models, {
        Job: Job
    });

}).call(this.Crosscut);
(function (undefined) {
    'use strict';

    function NewsArticle(data) {
        this.image = data.image || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.date = data.date || '';
    }

    this.exports(this.Models, {
        NewsArticle: NewsArticle
    });

}).call(this.Crosscut);
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
(function(undefined) {
    'use strict';
   
    var C = this.Constants;

    this.Main.factory('PlacesSrvc', [
        '$rootScope',
        '$http',
        'LocationSrvc',
        'PlacesMapper',

        function ($rootScope, $http, location, placesMapper) {
            
            function get(type, id, callback) {
                var url = C.PLACE.URL.GET
                                .replace('{guid}', id);

                $http.get(url).success(function (data) {
                    callback.call(undefined, placesMapper.mapOne(data, type));
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
(function (_, undefined) {
    'use strict';

    var Place = this.Models.Place;

    this.Main.factory('PlacesMapper', [
       '$rootScope',

       function ($rootScope) {

           function map(data, type) {
               return _.map(data, function (item) {
                   return mapOne(item, type);
               });
           }

           function mapOne(data, type) {
               return new Place(data, type);
           }

           function unmapOne(place) {
               return {
                   name: place.title,
                   description: place.description,
                   address: {
                       formatedAddress: place.address,
                       formatedPhone: '',
                       longitude: place.location.lng,
                       latitude: place.location.lat
                   }
               };
           }

           return {
               map: map,
               mapOne: mapOne,
               unmapOne: unmapOne
           };
       }
    ]);

}).call(this.Crosscut, this._);
(function(undefined) {
    'use strict';
   
    this.Main.controller('MainCtrl', [
        '$scope', 
        
        function($scope) {
            $scope.mainMenuIsClosed = true;
            $scope.accountMenuIsClosed = true;
            $scope.modalIsVisible = false;
            
            $scope.toggleMainMenu = function() {
                $scope.mainMenuIsClosed = !$scope.mainMenuIsClosed;
            };
            
            $scope.toggleAccountMenu = function() {
                $scope.accountMenuIsClosed = !$scope.accountMenuIsClosed;
            };

            $scope.$on('showModal', function () {
                $scope.modalIsVisible = true;
            });

            $scope.$on('hideModal', function () {
                $scope.modalIsVisible = false;
            });
        }
    ]);
        
}).call(this.Crosscut);
(function(undefined) {
    'use strict';
   
    this.Main.controller('HomeCtrl', [
        '$scope', 
        
        function($scope) {
        }
    ]);
        
}).call(this.Crosscut);
(function(undefined) {
    'use strict';

    var Place = this.Models.Place;
   
    var C = this.Constants;

    this.Main.controller('PlacesCtrl', [
        '$scope',
        '$stateParams',
        '$rootScope',
        'PlacesSrvc',
        
        function ($scope, $stateParams, $rootScope, places) {
            $scope.C = C;

            $scope.places = [];

            function init() {
                places.search($stateParams.type, function (placesList) {
                    $scope.places = placesList;
                });
            }

            $scope.currentTab = function (tab) {
                return $stateParams.type === tab;
            };

            $scope.getPlaceImage = function (src) {
                if (src === '') {
                    return 'images/places.placeholder.png';
                }

                return src;
            };

            $scope.$on('placeAdded', function () {
                init();
            });

            $scope.addPlace = function () {
                $rootScope.$broadcast('addPlace', { type: $stateParams.type });
            };

            init();
        }
    ]);
        
}).call(this.Crosscut);
(function(undefined) {
    'use strict';

    var Place = this.Models.Place;
   
    this.Main.controller('PlaceCtrl', [
        '$scope', 
        '$stateParams',
        'PlacesSrvc',

        function ($scope, $stateParams, places) {
            $scope.place = {};

            $scope.currentTab = function (tab) {
                return $stateParams.type === tab;
            };

            places.get($stateParams.type, $stateParams.id, function (place) {
                $scope.place = place;
            });
        }
    ]);
        
}).call(this.Crosscut);
(function(undefined) {
    'use strict';
   
    var Place = this.Models.Place;

    this.Main.controller('AddPlaceCtrl', [
        '$scope', 
        '$rootScope',
        'PlacesSrvc',
        'LocationSrvc',

        function ($scope, $rootScope, places, location) {
            $scope.visible = false;

            $scope.place = null;

            $scope.currentTab = function (tab) {
                if (!$scope.place) {
                    return false;
                }

                return $scope.place.type === tab;
            };

            $scope.$on('addPlace', function (e, config) {
                $scope.place = new Place({ address: {} }, config.type);                

                $rootScope.$broadcast('showModal');
                $scope.visible = true;
            });

            $scope.setLocation = function () {
                location.get(function (latLng) {
                    $scope.place.location = latLng;
                    if ($scope.place.address === '') {
                        location.geocode(latLng, function (address) {
                            $scope.place.address = address;
                        });
                    }
                });
                
            };

            $scope.clear = function (fieldName) {
                $scope.place[fieldName] = '';
            };

            function hide() {
                $rootScope.$broadcast('hideModal');
                $scope.visible = false;
            }

            $scope.cancel = hide;

            $scope.save = function () {
                places.add($scope.place, function () {
                    $rootScope.$broadcast('placeAdded');
                    hide();
                })
            };
        }
    ]);
        
}).call(this.Crosscut);
(function(undefined) {
    'use strict';
   
    var Job = this.Models.Job;

    this.Main.controller('JobsCtrl', [
        '$scope', 
        
        function ($scope) {
            $scope.getJobIcon = function (type) {
                if (type === '') {
                    return 'images/blank.png';
                }

                return 'images/jobs.icon.' + type + '.png';
            };

            $scope.jobs = [
                new Job({
                    icon: 'up',
                    date: '27 Oct 2013',
                    title: 'Lorem ipsum dolor sit amet, conse...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: 'check',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: 'check',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: 'up',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: '',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: 'up',
                    date: '27 Oct 2013',
                    title: 'Lorem ipsum dolor sit amet, conse...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: 'check',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: 'check',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: 'up',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: '',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                })
            ];

            $scope.volunteeringJobs = [
                new Job({
                    icon: 'up',
                    date: '27 Oct 2013',
                    title: 'Lorem ipsum dolor sit amet, conse...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: 'check',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: 'up',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                }),

                new Job({
                    icon: '',
                    date: '27 Oct 2013',
                    title: 'Topeka Rescue Missio...',
                    address: 'Topeka, KS 66608'
                })
            ];
        }
    ]);
        
}).call(this.Crosscut);
(function(undefined) {
    'use strict';

    var NewsArticle = this.Models.NewsArticle;
   
    this.Main.controller('NewsCtrl', [
        '$scope', 
        
        function ($scope) {
            $scope.getNewsArticleImage = function (src) {
                if (src === '') {
                    return 'images/news.placeholder.png';
                }

                return src;
            };

            $scope.news = [
               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: '',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: '',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: '',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               })
            ];
        }
    ]);
        
}).call(this.Crosscut);
angular.module('Crosscut').run(['$templateCache', function($templateCache) {

  $templateCache.put('views/addplace.html',
    "<div class=\"background\" ng-show=\"visible\">&nbsp;</div>\r" +
    "\n" +
    "<div class=\"modalwrap\" ng-show=\"visible\">\r" +
    "\n" +
    "    <div class=\"modalview container\" id=\"addplace\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <h1 class=\"title add\">\r" +
    "\n" +
    "            <strong ng-show=\"currentTab('SHELTER')\">Add new shelter</strong>\r" +
    "\n" +
    "            <strong ng-show=\"currentTab('FOOD_PANTRIES')\">Add new food pantry</strong>\r" +
    "\n" +
    "            <strong ng-show=\"currentTab('FOOD_BANK')\">Add new food bank</strong>\r" +
    "\n" +
    "        </h1>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <a href=\"\" class=\"modalclose\" ng-click=\"cancel()\"><span>Close</span></a>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <form name=\"addplace\">\r" +
    "\n" +
    "            <p class=\"input text\" ng-class=\"{'notempty': place.title != ''}\">\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"place.title\" placeholder=\"Name\" is-focused required />\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('title')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"input text\" ng-class=\"{'notempty': place.description != ''}\">\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"place.description\" placeholder=\"Description\" is-focused />\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('description')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"input text\" ng-class=\"{'notempty': place.address != ''}\">\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"place.address\" placeholder=\"Address\" is-focused />\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('address')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"input\">\r" +
    "\n" +
    "                <a class=\"button location\" ng-click=\"setLocation()\"><span>Current location</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"actions\">\r" +
    "\n" +
    "            <a href=\"\" class=\"button save\" ng-click=\"save()\" ng-class=\"{'disabled': addplace.$invalid}\"><span>Save</span></a>\r" +
    "\n" +
    "            <a href=\"\" class=\"button cancel\" ng-click=\"cancel()\"><span>Cancel</span></a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/directives/map.html',
    "<div class=\"map\">&nbsp;</div>"
  );


  $templateCache.put('views/directives/rating.html',
    "<span class=\"rating\" ng-class=\"getRatingClass()\">\r" +
    "\n" +
    "    <span>\r" +
    "\n" +
    "        <span>{{value}}</span>\r" +
    "\n" +
    "    </span>\r" +
    "\n" +
    "</span>"
  );


  $templateCache.put('views/home.html',
    "<div id=\"mainfeature\">\r" +
    "\n" +
    "    <div class=\"container feature\">\r" +
    "\n" +
    "        <div class=\"detail\">\r" +
    "\n" +
    "            <p>Crosscut empowers homeless people to forge their way up and out of homelessness by connecting them with resources and opportunities.</p>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"mainmenu\">\r" +
    "\n" +
    "    <ul class=\"container\">\r" +
    "\n" +
    "        <li class=\"places\">\r" +
    "\n" +
    "            <a ui-sref=\"places({type: 'SHELTER'})\">Places</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"jobs\">\r" +
    "\n" +
    "            <a ui-sref=\"jobs\">Jobs</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"news\">\r" +
    "\n" +
    "            <a ui-sref=\"news\">News</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"about\">\r" +
    "\n" +
    "            <a href=\"\">About Crosscut</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"secondaryfeatures\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"feature willrose\">\r" +
    "\n" +
    "            <div class=\"detail\">\r" +
    "\n" +
    "                <p>�Success is not counted by how high you have climbed but by how many people you brought with you.�</p>\r" +
    "\n" +
    "                <strong>Dr. Will Rose</strong>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div class=\"feature roosevelt\">\r" +
    "\n" +
    "            <div class=\"detail\">\r" +
    "\n" +
    "                <p>�Nobody cares how much you know, until they know how much you care.�</p>\r" +
    "\n" +
    "                <strong>Theodore Roosevelt</strong>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/jobs.html',
    "<div id=\"smallmenu\">\r" +
    "\n" +
    "    <ul class=\"container\">\r" +
    "\n" +
    "        <li class=\"places\">\r" +
    "\n" +
    "            <a ui-sref=\"places({type: 'SHELTER'})\"><span>Places</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"jobs\">\r" +
    "\n" +
    "            <a ui-sref=\"jobs\"><span>Jobs</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"news\">\r" +
    "\n" +
    "            <a ui-sref=\"news\"><span>News</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"about\">\r" +
    "\n" +
    "            <a href=\"\"><span>About Crosscut</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"container active jobs\">&nbsp;</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"jobs\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <ul class=\"tabs\">\r" +
    "\n" +
    "            <li class=\"active\">\r" +
    "\n" +
    "                <a href=\"\">All jobs</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <li>\r" +
    "\n" +
    "                <a href=\"\">Announcements</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"list\">\r" +
    "\n" +
    "            <div class=\"header\">\r" +
    "\n" +
    "                <h2 class=\"title\"><strong>Paid jobs</strong> (74)</h2>\r" +
    "\n" +
    "                <a href=\"\" class=\"button add\">Add job</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"container\">\r" +
    "\n" +
    "                <a href=\"\" class=\"item\" ng-repeat=\"job in jobs\" ng-class=\"job.icon\">\r" +
    "\n" +
    "                    <span class=\"date\">{{job.date}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h3 class=\"title\">{{job.title}}</h3>\r" +
    "\n" +
    "                    <span class=\"address\">{{job.address}}</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a class=\"button more\">Load more</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"list\">\r" +
    "\n" +
    "            <div class=\"header\">\r" +
    "\n" +
    "                <h2 class=\"title\"><strong>Volunteering</strong> (4)</h2>\r" +
    "\n" +
    "                <a href=\"\" class=\"button add\">Add job</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"container\">\r" +
    "\n" +
    "                <a href=\"\" class=\"item\" ng-repeat=\"job in volunteeringJobs\" ng-class=\"job.icon\">\r" +
    "\n" +
    "                    <span class=\"date\">{{job.date}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h3 class=\"title\">{{job.title}}</h3>\r" +
    "\n" +
    "                    <span class=\"address\">{{job.address}}</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a class=\"button more hidden\">Load more</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/news.html',
    "<div id=\"smallmenu\">\r" +
    "\n" +
    "    <ul class=\"container\">\r" +
    "\n" +
    "        <li class=\"places\">\r" +
    "\n" +
    "            <a ui-sref=\"places({type: 'SHELTER'})\"><span>Places</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <li class=\"jobs\">\r" +
    "\n" +
    "            <a ui-sref=\"jobs\"><span>Jobs</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <li class=\"news\">\r" +
    "\n" +
    "            <a ui-sref=\"news\"><span>News</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <li class=\"about\">\r" +
    "\n" +
    "            <a href=\"\"><span>About Crosscut</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"container active news\">&nbsp;</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"news\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <div class=\"list\">\r" +
    "\n" +
    "            <div class=\"header\">\r" +
    "\n" +
    "                <h2 class=\"title\"><strong>News</strong> (26)</h2>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"container\">\r" +
    "\n" +
    "                <a href=\"\" class=\"item\" ng-repeat=\"newsArticle in news\">\r" +
    "\n" +
    "                    <img ng-src=\"{{getNewsArticleImage(newsArticle.image)}}\" alt=\"\" />\r" +
    "\n" +
    "                    <span class=\"date\">{{newsArticle.date}}</span>\r" +
    "\n" +
    "                    <h3 class=\"title\">{{newsArticle.title}}</h3>\r" +
    "\n" +
    "                    <span class=\"description\">{{newsArticle.description}}</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a class=\"button more\">Load more</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/place.html',
    "<div id=\"smallmenu\">\r" +
    "\n" +
    "    <ul class=\"container\">\r" +
    "\n" +
    "        <li class=\"places\">\r" +
    "\n" +
    "            <a ui-sref=\"places({type: 'SHELTER'})\"><span>Places</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"jobs\">\r" +
    "\n" +
    "            <a ui-sref=\"jobs\"><span>Jobs</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"news\">\r" +
    "\n" +
    "            <a ui-sref=\"news\"><span>News</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"about\">\r" +
    "\n" +
    "            <a href=\"\"><span>About Crosscut</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"container active places\">&nbsp;</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"placewrap\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <ul class=\"tabs\">\r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('SHELTER')}\">\r" +
    "\n" +
    "                <a ui-sref=\"places({type: 'SHELTER'})\">Shelters</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('FOOD_PANTRIES')}\">\r" +
    "\n" +
    "                <a ui-sref=\"places({type: 'FOOD_PANTRIES'})\">Food Pantries</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('FOOD_BANK')}\">\r" +
    "\n" +
    "                <a ui-sref=\"places({type: 'FOOD_BANK'})\">Food Banks</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div id=\"place\">\r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <div class=\"header\">\r" +
    "\n" +
    "                <h1 class=\"title\"><strong>{{place.title}}</strong></h1>\r" +
    "\n" +
    "                <rating data-value=\"place.rating\" class=\"inline\"></rating>\r" +
    "\n" +
    "                <span class=\"address\">{{place.address}}</span>\r" +
    "\n" +
    "                <rating data-value=\"place.rating\" class=\"end\"></rating>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <ul class=\"actions\">\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <a href=\"\" class=\"button directions notext\"><span>Directions</span></a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <a href=\"tel:{{place.phone}}\" class=\"button phone notext\"><span>Call phone</span></a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <a href=\"\" class=\"button alarm notext\"><span>Set alarm</span></a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "            </ul>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <map data-location=\"place.location\" data-title=\"place.title\"></map>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <div class=\"section\">\r" +
    "\n" +
    "                <h2 class=\"title\"><strong>About this shelter</strong></h2>\r" +
    "\n" +
    "                <div class=\"description\">Emergency Shelter Families/Singles. Regular Beds 150, Upper Bunks 136, Total Beds 286. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed vestibulum libero, consequat aliquam erat. Nulla in euismod massa, vel vestibulum orci. Donec vehicula risus rutrum laoreet semper. Fusce tincidunt bibendum massa ut fringilla. Suspendisse sed odio vel orci egestas tristique at placerat diam.</div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"section\">\r" +
    "\n" +
    "                <h2 class=\"title\"><strong>Photos</strong> (4)</h2>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"gallery\">\r" +
    "\n" +
    "                    <img class=\"photo\" src=\"images/dynamic/photo1.png\" alt=\"\" />\r" +
    "\n" +
    "                    <img class=\"photo\" src=\"images/dynamic/photo2.png\" alt=\"\" />\r" +
    "\n" +
    "                    <img class=\"photo\" src=\"images/dynamic/photo3.png\" alt=\"\" />\r" +
    "\n" +
    "                    <img class=\"photo\" src=\"images/dynamic/photo4.png\" alt=\"\" />\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"section reviews\">\r" +
    "\n" +
    "                <div class=\"header\">\r" +
    "\n" +
    "                    <h2 class=\"title\"><strong>Reviews</strong> (3)</h2>\r" +
    "\n" +
    "                    <a href=\"\" class=\"button notext add\"><span>&nbsp;</span></a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"review\">\r" +
    "\n" +
    "                    <rating data-value=\"3.5\"></rating>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h3 class=\"username\">A google user</h3>\r" +
    "\n" +
    "                    <span class=\"date\">27 Oct 2013</span>\r" +
    "\n" +
    "                    <div class=\"description\">Donec vehicula risus rutrum laoreet semper. Fusce tincidunt bibendum massa ut fringilla. Suspendisse sed odio vel orci egestas tristique at placerat diam. </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"review\">\r" +
    "\n" +
    "                    <rating data-value=\"2.5\"></rating>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h3 class=\"username\">A google user</h3>\r" +
    "\n" +
    "                    <span class=\"date\">27 Oct 2013</span>\r" +
    "\n" +
    "                    <div class=\"description\">Donec vehicula risus rutrum laoreet semper. Fusce tincidunt bibendum massa ut fringilla. Suspendisse sed odio vel orci egestas tristique at placerat diam. </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"review\">\r" +
    "\n" +
    "                    <rating data-value=\"1\"></rating>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h3 class=\"username\">A google user</h3>\r" +
    "\n" +
    "                    <span class=\"date\">27 Oct 2013</span>\r" +
    "\n" +
    "                    <div class=\"description\">Donec vehicula risus rutrum laoreet semper. Fusce tincidunt bibendum massa ut fringilla. Suspendisse sed odio vel orci egestas tristique at placerat diam. </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/places.html',
    "<div id=\"smallmenu\">\r" +
    "\n" +
    "    <ul class=\"container\">\r" +
    "\n" +
    "        <li class=\"places\">\r" +
    "\n" +
    "            <a ui-sref=\"places({type: 'SHELTER'})\"><span>Places</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"jobs\">\r" +
    "\n" +
    "            <a ui-sref=\"jobs\"><span>Jobs</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"news\">\r" +
    "\n" +
    "            <a ui-sref=\"news\"><span>News</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li class=\"about\">\r" +
    "\n" +
    "            <a href=\"\"><span>About Crosscut</span></a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"container active places\">&nbsp;</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"places\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "        <ul class=\"tabs\">\r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('SHELTER')}\">\r" +
    "\n" +
    "                <a ui-sref=\"places({type: 'SHELTER'})\">Shelters</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('FOOD_PANTRIES')}\">\r" +
    "\n" +
    "                <a ui-sref=\"places({type: 'FOOD_PANTRIES'})\">Food Pantries</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('FOOD_BANK')}\">\r" +
    "\n" +
    "                <a ui-sref=\"places({type: 'FOOD_BANK'})\">Food Banks</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        </ul>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "        <div class=\"list\">\r" +
    "\n" +
    "            <div class=\"header\">\r" +
    "\n" +
    "                <h2 class=\"title\">\r" +
    "\n" +
    "                    <strong ng-show=\"currentTab('SHELTER')\">Shelters</strong>\r" +
    "\n" +
    "                    <strong ng-show=\"currentTab('FOOD_PANTRIES')\">Food Pantries</strong>\r" +
    "\n" +
    "                    <strong ng-show=\"currentTab('FOOD_BANK')\">Food Banks</strong>\r" +
    "\n" +
    "                    ({{places.length}})\r" +
    "\n" +
    "                </h2>\r" +
    "\n" +
    "                <a href=\"\" class=\"button add\" ng-click=\"addPlace()\">\r" +
    "\n" +
    "                    <span ng-show=\"currentTab('SHELTER')\">Add shelter</span>\r" +
    "\n" +
    "                    <span ng-show=\"currentTab('FOOD_PANTRIES')\">Add food pantry</span>\r" +
    "\n" +
    "                    <span ng-show=\"currentTab('FOOD_BANK')\">Add food bank</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <div class=\"container\">\r" +
    "\n" +
    "                <a class=\"item\" ng-repeat=\"place in places\" ui-sref=\"place({type: place.type, id: place.id})\">\r" +
    "\n" +
    "                    <img ng-src=\"{{getPlaceImage(place.image)}}\" alt=\"\" />\r" +
    "\n" +
    "                    <h3 class=\"title\">{{place.title}}</h3>\r" +
    "\n" +
    "                    <span class=\"address\">{{place.address}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <rating data-value=\"place.rating\"></rating>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a class=\"button more\">Load more</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);
