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
            },

            PER_PAGE: 5,
            PER_PAGE_XDPI: 10
        },

        JOB: {
            URL: {
                SEARCH: 'https://gcdc2013-crosscut.appspot.com/_ah/api/jobs/v1/jobs?lat={lat}&long={lng}&type={type}',
                ADD: 'https://gcdc2013-crosscut.appspot.com/_ah/api/jobs/v1/add/{due}/{type}'
            },

            TYPE: {
                PAID: 'PAID',
                VOLUNTEERING: 'VOLUNTEERING'
            },

            PER_PAGE: 5,
            PER_PAGE_XDPI: 10
        },

        NEWS: {
            PER_PAGE: 5,
            PER_PAGE_XDPI: 10
        },

        LOCATION: {
            URL: {
                GEOCODE: 'https://gcdc2013-crosscut.appspot.com/_ah/api/location/v1/locations?lat={lat}&long={lng}'
            },

            DEFAULT: {
                lat: 34.0483953,
                lng: -118.2025121
            }
        },

        REVIEW: {
            URL: {
                ADD: 'https://gcdc2013-crosscut.appspot.com/_ah/api/reviews/v1/add/{type}'
            }
        },

        XDPI_WIDTH: 960
    };

}).call(this.Crosscut);
(function(ng, undefined) {
    'use strict';
   
    var module = ng.module('Crosscut', [
        'ui.router',
        'ngSanitize'
    ]);
    
    module.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('base', {
                url: '',
                abstract: true,
                views: {
                    'changeLocation': {
                        templateUrl: 'views/changelocation.html',
                        controller: 'ChangeLocationCtrl'
                    },

                    'preloader': {
                        templateUrl: 'views/preloader.html',
                        controller: 'PreloaderCtrl'
                    }
                }
            })

            .state('base.home', {
                url: '/',
                controller: 'MainCtrl',
                views: {
                    'content@': {
                        templateUrl: 'views/home.html',
                        controller: 'HomeCtrl'
                    }
                }    
            })
            
            .state('base.places', {
                url: '/places/{type}',
                views: {
                    'content@': {
                        templateUrl: 'views/places.html',
                        controller: 'PlacesCtrl'
                    },

                    'addPlace@': {
                        templateUrl: 'views/addplace.html',
                        controller: 'AddPlaceCtrl'
                    }
                }    
            })

            .state('base.place', {
                url: '/places/{type}/place/{id}',
                views: {
                    'content@': {
                        templateUrl: 'views/place.html',
                        controller: 'PlaceCtrl'
                    },

                    'addReview@': {
                        templateUrl: 'views/addreview.html',
                        controller: 'AddReviewCtrl'
                    }
                }
            })
            
            .state('base.jobs', {
                url: '/jobs',
                views: {
                    'content@': {
                        templateUrl: 'views/jobs.html',
                        controller: 'JobsCtrl'
                    },

                    'addJob@': {
                        templateUrl: 'views/addjob.html',
                        controller: 'AddJobCtrl'
                    }
                }    
            })
            
            .state('base.news', {
                url: '/news',
                views: {
                    'content@': {
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
(function (ng, undefined) {
    'use strict';

    this.Main.directive('rating', [
        function () {
            return {
                restrict: 'E',
                transclude: false,
                replace: true,
                scope: {
                    value: '=',
                    readOnly: '='
                },
                templateUrl: 'views/directives/rating.html',

                controller: function ($scope) {

                    var maxRange = 5;

                    function createRateObjects() {
                        var states = [];

                        for (var i = 0, n = maxRange; i < n; i++) {
                            states[i] = {
                                index: i
                            };
                        }

                        return states;
                    }

                    $scope.range = createRateObjects();

                    $scope.rate = function (value) {
                        if ($scope.readOnly || $scope.value === value) {
                            return;
                        }

                        $scope.value = value;
                    };

                    $scope.enter = function (value) {
                        if (!$scope.readOnly) {
                            $scope.val = value;
                        }
                    };

                    $scope.reset = function () {
                        $scope.val = ng.copy($scope.value);
                    };

                    $scope.$watch('value', function (value) {
                        $scope.val = value;
                    });
                }
            };
        }
    ]);

}).call(this.Crosscut, this.angular);

(function (maps, undefined) {
    'use strict';

    this.Main.directive('map', [
        function () {
            return {
                restrict: 'E',
                transclude: false,
                replace: true,
                scope: {
                    id: '=',
                    location: '=',
                    title: '=',
                    readOnly: '=',
                    setFunction: '='
                },
                templateUrl: 'views/directives/map.html',

                controller: function ($scope, $element) {
                    var map, marker, center, directionsService, directionsDisplay;
                    var initialized = false;

                    var mapOptions = {
                        zoom: 14,
                        mapTypeId: maps.MapTypeId.ROADMAP
                    };

                    if ($scope.readOnly) {
                        mapOptions.scrollwheel = false;
                    }

                    directionsService = new maps.DirectionsService();
                    directionsDisplay = new maps.DirectionsRenderer();

                    map = new maps.Map($element[0], mapOptions);

                    function centerMap() {
                        center = new maps.LatLng($scope.location.lat, $scope.location.lng);
                        map.panTo(center);
                        marker.setPosition(center);
                    }

                    function initMap() {
                        if (initialized) {
                            centerMap();
                            return;
                        }

                        initialized = true;

                        var markerOptions = {
                            position: center,
                            map: map,
                            title: $scope.title
                        };

                        if (!$scope.readOnly) {
                            markerOptions.draggable = true;
                        }

                        marker = new maps.Marker(markerOptions);

                        centerMap();

                        if (!$scope.readOnly) {
                            maps.event.addListener(marker, 'mouseup', function () {
                                var position = marker.getPosition();

                                $scope.setFunction.call(undefined, {
                                    lat: position.lat(),
                                    lng: position.lng()
                                });
                            });
                        }
                       
                        maps.event.addDomListener(window, 'resize', function () {
                            map.setCenter(center);
                        });
                    }

                    directionsDisplay.setMap(map);

                    if ($scope.location !== undefined) {
                        initMap();
                    }

                    $scope.$watch('location', function (newData) {
                        if (newData !== undefined) {
                            initMap();
                        }
                    }, true);

                    $scope.$on('fixMaps', function (e, id) {
                        if (id !== true && $scope.id !== id) {
                            return;
                        }

                        setTimeout(function () {
                            maps.event.trigger(map, 'resize');
                            map.panTo(center);
                        }, 100);
                    });

                    $scope.$on('resetMaps', function (e, id) {
                        if (id !== true && $scope.id !== id) {
                            return;
                        }
                        centerMap();
                    });

                    $scope.$on('showDirections', function (e, config) {
                        if ($scope.id !== config.id) {
                            return;
                        }
                        
                        var request = {
                            origin: new maps.LatLng(config.latLng.lat, config.latLng.lng),
                            destination: center,
                            travelMode: maps.TravelMode.DRIVING
                        };

                        directionsService.route(request, function (response, status) {
                            if (status === maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                            }
                        });
                    });
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

    var C = this.Constants;

    function Place(data, type) {
        this.id = data.gReference;
        this.reference = data.id;
        this.image = '';
        this.title = data.name || '';
        this.description = data.description || '';
        this.address = data.address.formatedAddress || '';
        this.phone = data.address.formatedPhone || '';
        this.rating = data.averageRating || 0;
        this.location = {
            lat: data.address.latitude || C.LOCATION.DEFAULT.lat,
            lng: data.address.longitude || C.LOCATION.DEFAULT.lng
        };
        this.type = type || '';
        this.reviews = [];
    }

    this.exports(this.Models, {
        Place: Place
    });

}).call(this.Crosscut);
(function (undefined) {
    'use strict';

    var C = this.Constants;

    function Job(data, type) {
        this.reference = data.id;
        this.icon = '';
        this.date = data.dueDate || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.address = data.address.formatedAddress || '';
        this.phone = data.address.formatedPhone || '';
        this.location = {
            lat: data.address.latitude || C.LOCATION.DEFAULT.lat,
            lng: data.address.longitude || C.LOCATION.DEFAULT.lng
        };
        this.type = type || '';
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
        this.url = data.url || '';
    }

    this.exports(this.Models, {
        NewsArticle: NewsArticle
    });

}).call(this.Crosscut);
(function (undefined) {
    'use strict';

    function Review(data) {
        this.author = data.author || '';
        this.comment = data.comment || '';
        this.date = data.date || '';
        this.rating = data.rating || 0;
    }

    this.exports(this.Models, {
        Review: Review
    });

}).call(this.Crosscut);
(function (undefined) {
    'use strict';

    function User(data) {
        this.id = data.id || 123456;
        this.name = data.name || 'John Doe';
    }

    this.exports(this.Models, {
        User: User
    });

}).call(this.Crosscut);
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
(function(window, $, undefined) {
    'use strict';

    var C = this.Constants;
   
    this.Main.factory('ResponsiveSrvc', [
        '$rootScope',

        function ($rootScope) {
            var self = this;

            function isXDPI() {
                return $(window).width() >= C.XDPI_WIDTH;
            }

            $(window).resize(function () {
                $rootScope.$broadcast('responsiveLayoutChanged');
            });

            return {
                isXDPI: isXDPI
            };
        }
    ]);
        
}).call(this.Crosscut, window, this.jQuery);
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
                $rootScope.$broadcast('preloadStart');

                var url = C.PLACE.URL.GET
                                .replace('{guid}', id);

                $http.get(url).success(function (data) {
                    var place = placesMapper.mapOne(data, type);
                    place.reviews = reviewsMapper.map(data.reviews);
                    callback.call(undefined, place);
                    $rootScope.$broadcast('preloadEnd');
                });
            }

            function search(type, callback) {
                $rootScope.$broadcast('preloadStart');

                location.get(function (latLng) {
                    var url = C.PLACE.URL.SEARCH
                                .replace('{lat}', latLng.lat)
                                .replace('{lng}', latLng.lng)
                                .replace('{type}', type);

                    $http.get(url).success(function (data) {
                        callback.call(undefined, placesMapper.map(data.items, type));
                        $rootScope.$broadcast('preloadEnd');
                    });
                });
            }

            function add(place, callback) {
                $rootScope.$broadcast('preloadStart');

                var url = C.PLACE.URL.ADD
                                .replace('{type}', place.type);

                var data = placesMapper.unmapOne(place);

                $http.post(url, data).success(function (data) {
                    callback.call(undefined);
                    $rootScope.$broadcast('preloadEnd');
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
                $rootScope.$broadcast('preloadStart');

                var url = C.REVIEW.URL.ADD
                                .replace('{type}', type);

                var data = reviewsMapper.unmapOne(review);

                user.get(function (author) {
                    data.author = author.name;
                    data.authorId = author.id;
                    data.reference = reference;

                    $http.post(url, data).success(function (data) {
                        callback.call(undefined);
                        $rootScope.$broadcast('preloadEnd');
                    });
                });
            }

            return {
                add: add
            };
        }
    ]);
        
}).call(this.Crosscut);
(function(undefined) {
    'use strict';

    var User = this.Models.User;

    var C = this.Constants;
   
    this.Main.factory('UserSrvc', [
        '$rootScope',
        '$http',

        function ($rootScope, $http) {
            var self = this;

            this.user = new User({});

            function get(callback) {
                callback.call(undefined, self.user);
            }

            return {
                get: get
            };
        }
    ]);
        
}).call(this.Crosscut);
(function (undefined) {
    'use strict';

    var C = this.Constants;

    this.Main.provider('$cookieStore', function () {
        var self = this;
        self.defaultOptions = {};

        self.setDefaultOptions = function (options) {
            self.defaultOptions = options;
        };

        self.$get = function () {
            return {
                get: function (name) {
                    var jsonCookie = $.cookie(name);
                    if (jsonCookie) {
                        return angular.fromJson(jsonCookie);
                    }
                },
                put: function (name, value, options) {
                    options = $.extend({}, self.defaultOptions, options);
                    $.cookie(name, angular.toJson(value), options);
                },
                remove: function (name, options) {
                    options = $.extend({}, self.defaultOptions, options);
                    $.removeCookie(name, options);
                }
            };
        };
    });

}).call(this.Crosscut);
(function(undefined) {
    'use strict';
   
    var NewsArticle = this.Models.NewsArticle;

    this.Main.factory('NewsSrvc', [
        '$rootScope',
        '$http',

        function ($rootScope, $http) {
            
            function search(callback) {
                var news = [
                    new NewsArticle({
                        image: '',
                        title: 'Cold Weather Shelters Open Dec. 1st',
                        description: 'Beginning December 1st, LA County will commence the Winter Shelter Program.  Each program location provides  temporary emergency shelter, meals, supportive services, and housing assistance.  For a list of locations, please follow the link.',
                        date: '26 Nov 2013',
                        url: 'http://www.lahsa.org/winter_shelter_program.asp'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'LA Considers Ban on Charity Meals for Homeless',
                        description: 'Two LA City Counsel Members propose ordinance that would restrict feeding homeless people in public places.  In the past years, many cities, including Philadelphia, Orlando, Raleigh, and Seattle have enacted such legislation.  ',
                        date: '25 Nov 2013',
                        url: 'http://www.nytimes.com/2013/11/26/us/as-homeless-line-up-for-food-los-angeles-weighs-restrictions.html'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'While National Homeless Numbers Decline, LA Homelessness Increases',
                        description: 'Between 2011-2013 homelessness in LA county increased by 15%.  Long-term homelessness increased by 16%, while homeless veterans increased 24%.',
                        date: '21 Nov 2013',
                        url: 'http://www.latimes.com/local/lanow/la-me-ln-hud-homeless-20131121,0,1923578.story#axzz2ll5Mfnjd'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Free Flu Vaccinations',
                        description: 'Flu season is upon us.  Crosscut encourages those experiencing homelessness to take advantage of the free flu vaccinations available throughout LA.  Please visit the link for programs available near you.  If you need assistance finding a free flu vaccination please contact jen@crosscutusa.org.',
                        date: '20 Nov 2013',
                        url: 'http://publichealth.lacounty.gov/ip/flu/FluLocatorMain.htm'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Free Thanksgiving Meals',
                        description: 'Don\'t spend the holiday alone!  There are many events to offering free Thanksgiving meals.  Come share in good food and cheer.',
                        date: '20 Nov 2013',
                        url: 'http://abclocal.go.com/kabc/story?id=7140446'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Nevada Accused of Bussing Homeless Patients to Other Cities',
                        description: 'San Francisco\'s city attorney filed a class action lawsuit against the hospital and the state of Nevada for patient dumping. The suit alleges from 2008 to 2013, the hospital improperly discharged and sent at least two dozen indigent patients by Greyhound bus to San Francisco. The suit claims some of those transported had no connection to their destinations.',
                        date: '13 Nov 2013',
                        url: 'http://www.fox19.com/story/23827863/fox19-investigates-nv-mental-health-patients-dumped-in-ohio'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Several cities providing homeless one-way bus tickets to Portland',
                        description: 'Programs that provide one-way bus tickets to the homeless are supposed to reunite them with families who can help them.  However, more often than not they are used by cities to shift the burden of homeless residents to another city, without providing any benefit to the homeless.',
                        date: '13 Nov 2013',
                        url: 'http://www.nwcn.com/news/230202841.html'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Fresno Destroys Downtown Homeless Encampments',
                        description: 'Despite widespread acknowledgement that the city provides insufficient shelter beds, the city of Fresno, CA has continued to destroy homeless encampments.',
                        date: '11 Nov 2013',
                        url: 'http://www.streetsense.org/2013/11/city-of-fresno-destroys-downtown-homeless-encampments/'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Help the Hungry This Thanksgiving',
                        description: 'Did you know that 1 in 6 Americans experiences food insecurity?  Dedicate some time this holiday to helping the less fortunate by volunteering with one of the many programs that helps make the holidays a little happier for the less fortunate.',
                        date: '9 Nov 2013',
                        url: 'http://losangeles.cbslocal.com/guide/how-to-help-the-hungry-this-thanksgiving/'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'Ontario Homeless Shelter Starts Charging Clients',
                        description: 'A homeless shelter in Ontario has begun charging clients for shelter. John Pencoff, the front-line supervisor at the shelter, says in the real world, anyone who doesn\'t pay their rent sleeps outside.',
                        date: '8 Nov 2013',
                        url: 'http://www.thespec.com/news-story/4200040-ontario-homeless-shelter-starting-to-charge-clients/'
                    }),

                    new NewsArticle({
                        image: '',
                        title: 'CA Homeless Bill of Rights Dies in Committee',
                        description: 'Cost of implementation is cited as the main reason why a bill, which would have extended protections and vital services to the homeless, has been killed.',
                        date: '6 Nov 2013',
                        url: 'http://www.visaliatimesdelta.com/article/20131107/OPINION01/311070008/'
                    })
                ];
                callback.call(undefined, news);
            }

            return {
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
(function (_, undefined) {
    'use strict';

    var Review = this.Models.Review;

    this.Main.factory('ReviewsMapper', [
       '$rootScope',

       function ($rootScope) {

           function map(data) {
               return _.map(data, function (item) {
                   return mapOne(item);
               });
           }

           function mapOne(data) {
               return new Review(data);
           }

           function unmapOne(review) {
               return {
                   rating: review.rating,
                   comment: review.comment
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
(function (_, undefined) {
    'use strict';

    var Job = this.Models.Job;

    this.Main.factory('JobsMapper', [
       '$rootScope',

       function ($rootScope) {

           function map(data, type) {
               return _.map(data, function (item) {
                   return mapOne(item, type);
               });
           }

           function mapOne(data, type) {
               return new Job(data, type);
           }

           function unmapOne(place) {
               return {
                   title: place.title,
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
(function($, window, undefined) {
    'use strict';
   
    this.Main.controller('MainCtrl', [
        '$scope',
        '$rootScope',
        'ResponsiveSrvc',
        
        function ($scope, $rootScope, responsive) {
            $scope.mainMenuIsClosed = true;
            $scope.accountMenuIsClosed = true;
            $scope.modalIsVisible = false;

            function setLayout() {
                $scope.mainMenuIsClosed = true;
                $scope.accountMenuIsClosed = true;

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }

            $scope.toggleMainMenu = function() {
                $scope.mainMenuIsClosed = !$scope.mainMenuIsClosed;
            };

            $scope.changeLocation = function () {
                $scope.mainMenuIsClosed = true;
                $rootScope.$broadcast('changeLocation', {});
            };
            
            $scope.toggleAccountMenu = function() {
                $scope.accountMenuIsClosed = !$scope.accountMenuIsClosed;
            };

            $scope.getFullHeight = function () {
                if ($(window).width() >= 960) {
                    return $(window).height() + 'px';
                }

                return 'auto';
            };

            $scope.getRealFullHeight = function () {
                return $(window).height() + 'px';
            };

            $scope.getMinContentHeight = function () {
                return ($(window).height() - $('#header').outerHeight() - $('#footer').outerHeight() - $('#footer').css('marginTop').replace('px', '')) + 'px';
            };

            $scope.$on('showModal', function () {
                $scope.modalIsVisible = true;
            });

            $scope.$on('hideModal', function () {
                $scope.modalIsVisible = false;
            });

            $scope.$on('responsiveLayoutChanged', setLayout);
        }
    ]);
        
}).call(this.Crosscut, this.jQuery, window);

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

    var C = this.Constants;

    this.Main.controller('PlacesCtrl', [
        '$scope',
        '$stateParams',
        '$rootScope',
        'PlacesSrvc',
        'ResponsiveSrvc',
        
        function ($scope, $stateParams, $rootScope, places, responsive) {
            $scope.C = C;

            $scope.places = [];
            $scope.haveMore = true;
            $scope.perPage = C.PLACE.PER_PAGE;
            $scope.endAt = C.PLACE.PER_PAGE;

            function getPerPage() {
                if (responsive.isXDPI()) {
                    return C.PLACE.PER_PAGE_XDPI;
                }

                return C.PLACE.PER_PAGE;
            }

            function setLayout() {
                $scope.perPage = getPerPage();
            }

            function init() {
                setLayout();

                places.search($stateParams.type, function (placesList) {
                    $scope.places = placesList;
                    $scope.endAt = getPerPage();
                    $scope.haveMore = true;
                });
            }
            
            $scope.$on('responsiveLayoutChanged', setLayout);

            $scope.pagedPlaces = function () {
                var paged = $scope.places.slice(0, $scope.endAt);

                if (paged.length === $scope.places.length) {
                    $scope.haveMore = false;
                }

                return paged;
            };

            $scope.loadMore = function () {
                $scope.endAt += $scope.perPage;
            };

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

            $scope.$on('refresh', function () {
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
        '$rootScope',
        '$stateParams',
        'PlacesSrvc',
        'LocationSrvc',

        function ($scope, $rootScope, $stateParams, places, location) {
            $scope.place = {};

            $scope.currentTab = function (tab) {
                return $stateParams.type === tab;
            };

            $scope.showDirections = function () {
                location.get(function (latLng) {
                    $rootScope.$broadcast('showDirections', {
                        latLng: latLng,
                        id: 'place'
                    });
                });
            };

            $scope.$on('reviewAdded', function () {
                init();
            });

            $scope.addReview = function () {
                $rootScope.$broadcast('addReview', { reference: $scope.place.reference });
            };

            function init() {
                places.get($stateParams.type, $stateParams.id, function (place) {
                    $scope.place = place;
                });
            }

            init();
        }
    ]);
        
}).call(this.Crosscut);
(function($, undefined) {
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
                    if (!$scope.place.address || $scope.place.address === '') {
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
                });
            };

            $scope.getMarginTop = function () {
                var fullHeight = $scope.getFullHeight();

                if (fullHeight === 'auto') {
                    return 0;
                }

                return $scope.getFullHeight().replace('px', '') / 2 - $('#addplace').height() / 2;
            };
        }
    ]);        
}).call(this.Crosscut, this.jQuery);

(function($, undefined) {
    'use strict';
   
    var Review = this.Models.Review;

    this.Main.controller('AddReviewCtrl', [
        '$scope', 
        '$rootScope',
        'ReviewsSrvc',

        function ($scope, $rootScope, reviews) {
            $scope.visible = false;

            $scope.review = null;
            $scope.reference = null;

            $scope.$on('addReview', function (e, config) {
                $scope.review = new Review({});
                $scope.reference = config.reference;

                $rootScope.$broadcast('showModal');
                $scope.visible = true;
            });

            $scope.clear = function (fieldName) {
                $scope.review[fieldName] = '';
            };

            function hide() {
                $rootScope.$broadcast('hideModal');
                $scope.visible = false;
            }

            $scope.cancel = hide;

            $scope.save = function () {
                reviews.add($scope.review, $scope.reference, 'PLACE', function () {
                    $rootScope.$broadcast('reviewAdded');
                    hide();
                });
            };

            $scope.getMarginTop = function () {
                var fullHeight = $scope.getFullHeight();

                if (fullHeight === 'auto') {
                    return 0;
                }

                return $scope.getFullHeight().replace('px', '') / 2 - $('#addreview').height() / 2;
            };
        }
    ]);
        
}).call(this.Crosscut, this.jQuery);
(function($, undefined) {
    'use strict';
   
    var Job = this.Models.Job;

    this.Main.controller('AddJobCtrl', [
        '$scope', 
        '$rootScope',
        'JobsSrvc',
        'LocationSrvc',

        function ($scope, $rootScope, jobs, location) {
            $scope.visible = false;

            $scope.job = null;

            $scope.currentType = function (type) {
                if (!$scope.job) {
                    return false;
                }

                return $scope.job.type === type;
            };

            $scope.selectType = function (type) {
                if (!$scope.job) {
                    return false;
                }

                $scope.job.type = type;
            };

            $scope.$on('addJob', function (e, config) {
                $scope.job = new Job({ address: {} }, config.type);

                $rootScope.$broadcast('showModal');
                $scope.visible = true;
            });

            $scope.setLocation = function () {
                location.get(function (latLng) {
                    $scope.job.location = latLng;
                    if ($scope.job.address === '') {
                        location.geocode(latLng, function (address) {
                            $scope.job.address = address;
                        });
                    }
                });
                
            };

            $scope.clear = function (fieldName) {
                $scope.job[fieldName] = '';
            };

            function hide() {
                $rootScope.$broadcast('hideModal');
                $scope.visible = false;
            }

            $scope.cancel = hide;

            $scope.save = function () {
                jobs.add($scope.job, function () {
                    $rootScope.$broadcast('jobAdded');
                    hide();
                });
            };

            $scope.getMarginTop = function () {
                var fullHeight = $scope.getFullHeight();

                if (fullHeight === 'auto') {
                    return 0;
                }

                return $scope.getFullHeight().replace('px', '') / 2 - $('#addjob').height() / 2;
            };
        }
    ]);
        
}).call(this.Crosscut, this.jQuery);
(function($, ng, undefined) {
    'use strict';
   
    var Job = this.Models.Job;

    var C = this.Constants;

    this.Main.controller('ChangeLocationCtrl', [
        '$scope', 
        '$rootScope',
        'LocationSrvc',

        function ($scope, $rootScope, location) {
            $scope.visible = false;

            var newPosition = null;

            $scope.map = {
                location: C.LOCATION.DEFAULT
            };
     
            $scope.$on('changeLocation', function (e, config) {
                newPosition = null;

                location.get(function (position) {
                    $scope.map.location = position;
                    newPosition = position;

                    $rootScope.$broadcast('fixMaps', 'changelocation');
                    $rootScope.$broadcast('resetMaps', 'changelocation');
                });

                $rootScope.$broadcast('showModal');
                $scope.visible = true;
            });

            function hide() {
                $rootScope.$broadcast('hideModal');
                $scope.visible = false;
            }

            $scope.cancel = hide;

            $scope.setCurrentLocation = function () {
                location.getReal(function (position) {
                    $scope.map.location = position;
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }

                    newPosition = position;
                    $rootScope.$broadcast('resetMaps', 'changelocation');
                }, true);
            };

            $scope.setLocation = function (position) {
                newPosition = position;
            };

            $scope.save = function () {
                if (newPosition !== null) {
                    location.set(newPosition);
                    $rootScope.$broadcast('refresh');
                    hide();
                }
            };

            $scope.getMarginTop = function () {
                var fullHeight = $scope.getFullHeight();

                if (fullHeight === 'auto') {
                    return 0;
                }

                return $scope.getFullHeight().replace('px', '') / 2 - $('#changelocation').height() / 2;
            };
        }
    ]);
        
}).call(this.Crosscut, this.jQuery, this.angular);
(function(undefined) {
    'use strict';
   
    var C = this.Constants;

    this.Main.controller('JobsCtrl', [
        '$scope', 
        '$rootScope',
        'JobsSrvc',
        'ResponsiveSrvc',

        function ($scope, $rootScope, jobs, responsive) {
            $scope.jobs = [];
            $scope.haveMore = true;
            $scope.perPage = C.JOB.PER_PAGE;
            $scope.endAt = C.JOB.PER_PAGE;

            $scope.volunteeringJobs = [];
            $scope.haveMoreVolunteeringJobs = true;
            $scope.endAtVolunteeringJobs = C.JOB.PER_PAGE;

            function getPerPage() {
                if (responsive.isXDPI()) {
                    return C.JOB.PER_PAGE_XDPI;
                }

                return C.JOB.PER_PAGE;
            }

            function setLayout() {
                $scope.perPage = getPerPage();
            }

            function init() {
                setLayout();

                jobs.search(C.JOB.TYPE.PAID, function (jobsList) {
                    $scope.jobs = jobsList;
                    $scope.endAt = getPerPage();
                    $scope.haveMore = true;
                });

                jobs.search(C.JOB.TYPE.VOLUNTEERING, function (jobsList) {
                    $scope.volunteeringJobs = jobsList;
                    $scope.endAtVolunteeringJobs = getPerPage();
                    $scope.haveMoreVolunteeringJobs = true;
                });
            }

            $scope.$on('responsiveLayoutChanged', setLayout);

            $scope.pagedJobs = function () {
                var paged = $scope.jobs.slice(0, $scope.endAt);

                if (paged.length === $scope.jobs.length) {
                    $scope.haveMore = false;
                }

                return paged;
            };

            $scope.pagedVolunteeringJobs = function () {
                var paged = $scope.volunteeringJobs.slice(0, $scope.endAtVolunteeringJobs);

                if (paged.length === $scope.volunteeringJobs.length) {
                    $scope.haveMoreVolunteeringJobs = false;
                }

                return paged;
            };

            $scope.loadMore = function () {
                $scope.endAt += $scope.perPage;
            };

            $scope.loadMoreVolunteeringJobs = function () {
                $scope.endAtVolunteeringJobs += $scope.perPage;
            };

            $scope.$on('jobAdded', function () {
                init();
            });

            $scope.$on('refresh', function () {
                init();
            });

            $scope.addJob = function (type) {
                $rootScope.$broadcast('addJob', { type: type });
            };

            $scope.getJobIcon = function (type) {
                if (type === '') {
                    return 'images/blank.png';
                }

                return 'images/jobs.icon.' + type + '.png';
            };

            init();
        }
    ]);
        
}).call(this.Crosscut);
(function(undefined) {
    'use strict';

    var C = this.Constants;
   
    this.Main.controller('NewsCtrl', [
        '$scope',
        'NewsSrvc',
        'ResponsiveSrvc',
        
        function ($scope, news, responsive) {
            $scope.news = [];
            $scope.haveMore = true;
            $scope.perPage = C.NEWS.PER_PAGE;
            $scope.endAt = C.NEWS.PER_PAGE;

            function getPerPage() {
                if (responsive.isXDPI()) {
                    return C.NEWS.PER_PAGE_XDPI;
                }

                return C.NEWS.PER_PAGE;
            }

            function setLayout() {
                $scope.perPage = getPerPage();
            }

            function init() {
                setLayout();

                news.search(function (newsList) {
                    $scope.news = newsList;
                    $scope.endAt = getPerPage();
                    $scope.haveMore = true;
                });
            }

            $scope.$on('responsiveLayoutChanged', setLayout);

            $scope.pagedNews = function () {
                var paged = $scope.news.slice(0, $scope.endAt);

                if (paged.length === $scope.news.length) {
                    $scope.haveMore = false;
                }

                return paged;
            };

            $scope.loadMore = function () {
                $scope.endAt += $scope.perPage;
            };

            $scope.getNewsArticleImage = function (src) {
                if (src === '') {
                    return 'images/news.placeholder.png';
                }

                return src;
            };

            init();
        }
    ]);
        
}).call(this.Crosscut);
(function($, undefined) {
    'use strict';
   
    this.Main.controller('PreloaderCtrl', [
        '$scope', 

        function ($scope) {
            $scope.preloadCount = 0;
            $scope.visible = false;


            $scope.$on('preloadStart', function () {
                $scope.preloadCount += 1;
                handleCount();
            });

            $scope.$on('preloadEnd', function () {
                if ($scope.preloadCount > 0) {
                    $scope.preloadCount -= 1;
                    handleCount();
                }
            });

            function handleCount() {
                if ($scope.preloadCount > 0 && !$scope.visible) {
                    $scope.visible = true;
                }
                else {
                    $scope.visible = false;
                }
            }

            $scope.getMarginTop = function () {
                return $scope.getRealFullHeight().replace('px', '') / 2 - $('#preloader .container').height() / 2;
            };
        }
    ]);
        
}).call(this.Crosscut, this.jQuery);
(function($, undefined) {
    'use strict';
    
    this.Main.filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

    this.Main.filter('numbersOnly', function () {
        return function (val) {
            if (val) {
                return val.replace(/\D+/g, '');
            }

            return '';
        };
    });

    this.Main.filter('limit', [
        'ResponsiveSrvc',
        function (responsive) {
            return function (input, XDPILimit, limit, cutoff) {
                if (!input) {
                    return '';
                }

                if (responsive.isXDPI()) {
                    limit = XDPILimit;
                }

                var out = input;

                if (out.length > limit) {
                    out = $.trim(out.substring(0, limit)) + cutoff;
                }

                return out;
            };
        }
    ]);

}).call(this.Crosscut, this.jQuery);
angular.module('Crosscut').run(['$templateCache', function($templateCache) {

  $templateCache.put('views/addjob.html',
    "<div class=\"modalwrap\" ng-show=\"visible\" ng-style=\"{'marginTop': getMarginTop() + 'px'}\">\r" +
    "\n" +
    "    <div class=\"modalview container\" id=\"addjob\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <h1 class=\"title add\">\r" +
    "\n" +
    "            <strong>Add new job</strong>\r" +
    "\n" +
    "        </h1>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <a href=\"\" class=\"modalclose\" ng-click=\"cancel()\"><span>Close</span></a>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <form name=\"addjob\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"spaced radiogroup\">\r" +
    "\n" +
    "                <a href=\"\" class=\"option\" ng-class=\"{'active': currentType('PAID')}\" ng-click=\"selectType('PAID')\">Paid job</a>\r" +
    "\n" +
    "                <a href=\"\" class=\"option\" ng-class=\"{'active': currentType('VOLUNTEERING')}\" ng-click=\"selectType('VOLUNTEERING')\">Volunteering</a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"input text\" ng-class=\"{'notempty': job.title != ''}\">\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"job.title\" placeholder=\"Title\" is-focused required />\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('title')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"input textarea\" ng-class=\"{'notempty': job.description != ''}\">\r" +
    "\n" +
    "                <textarea placeholder=\"Description\" ng-model=\"job.description\" is-focused></textarea>\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('description')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"input text\" ng-class=\"{'notempty': job.address != ''}\">\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"job.address\" placeholder=\"Address\" is-focused />\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('address')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"spaced\">\r" +
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
    "            <a href=\"\" class=\"button save\" ng-click=\"save()\" ng-class=\"{'disabled': addjob.$invalid}\"><span>Save</span></a>\r" +
    "\n" +
    "            <a href=\"\" class=\"button cancel\" ng-click=\"cancel()\"><span>Cancel</span></a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/addplace.html',
    "<div class=\"modalwrap\" ng-show=\"visible\" ng-style=\"{'marginTop': getMarginTop() + 'px'}\">\r" +
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
    "            <p class=\"spaced\">\r" +
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


  $templateCache.put('views/addreview.html',
    "<div class=\"modalwrap\" ng-show=\"visible\" ng-style=\"{'marginTop': getMarginTop() + 'px'}\">\r" +
    "\n" +
    "    <div class=\"modalview container\" id=\"addreview\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <h1 class=\"title add\">\r" +
    "\n" +
    "            <strong>Add new review</strong>\r" +
    "\n" +
    "        </h1>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <a href=\"\" class=\"modalclose\" ng-click=\"cancel()\"><span>Close</span></a>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <form name=\"addreview\">\r" +
    "\n" +
    "            <p class=\"input text\" ng-class=\"{'notempty': review.comment != ''}\">\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"review.comment\" placeholder=\"Comment\" is-focused required />\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('comment')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"input rating\">\r" +
    "\n" +
    "                <label>Rating</label>\r" +
    "\n" +
    "                <rating data-value=\"review.rating\" data-read-only=\"false\"></rating>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"actions\">\r" +
    "\n" +
    "            <a href=\"\" class=\"button save\" ng-click=\"save()\" ng-class=\"{'disabled': addreview.$invalid}\"><span>Save</span></a>\r" +
    "\n" +
    "            <a href=\"\" class=\"button cancel\" ng-click=\"cancel()\"><span>Cancel</span></a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/changelocation.html',
    "<div class=\"modalwrap\" ng-show=\"visible\" ng-style=\"{'marginTop': getMarginTop() + 'px'}\">\r" +
    "\n" +
    "    <div class=\"modalview container\" id=\"changelocation\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <h1 class=\"title\">\r" +
    "\n" +
    "            <strong>Change location</strong>\r" +
    "\n" +
    "        </h1>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <a href=\"\" class=\"modalclose\" ng-click=\"cancel()\"><span>Close</span></a>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <form name=\"changelocation\">\r" +
    "\n" +
    "           <p class=\"spaced\">\r" +
    "\n" +
    "               <map \r" +
    "\n" +
    "                   data-location=\"map.location\" \r" +
    "\n" +
    "                   data-title=\"'Choose your current location.'\" \r" +
    "\n" +
    "                   data-read-only=\"false\" \r" +
    "\n" +
    "                   data-id=\"'changelocation'\" \r" +
    "\n" +
    "                   data-set-function=\"setLocation\"\r" +
    "\n" +
    "                   ></map>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"spaced\">\r" +
    "\n" +
    "                <a class=\"button location\" ng-click=\"setCurrentLocation()\"><span>Current location</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"actions\">\r" +
    "\n" +
    "            <a href=\"\" class=\"button save\" ng-click=\"save()\"><span>Save</span></a>\r" +
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
    "<span ng-mouseleave=\"reset()\" class=\"rating\" ng-class=\"{'edit': !readOnly}\">\r" +
    "\n" +
    "    <i ng-repeat=\"r in range track by $index\" ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"star\" ng-class=\"$index < val && (r.stateOn || 'full') || (r.stateOff || 'empty')\"></i>\r" +
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
    "   <ng-include src=\"'views/mainmenu.html'\"></ng-include>\r" +
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
    "    <ng-include src=\"'views/mainmenu.html'\"></ng-include>\r" +
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
    "                <h2 class=\"title\"><strong>Paid jobs</strong> ({{jobs.length}})</h2>\r" +
    "\n" +
    "                <a href=\"\" class=\"button add\" ng-click=\"addJob('PAID')\">Add job</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"container\">\r" +
    "\n" +
    "                <a href=\"\" class=\"item\" ng-repeat=\"job in pagedJobs()\" ng-class=\"job.icon\">\r" +
    "\n" +
    "                    <span class=\"date\">{{job.date | date:'dd MMM yyyy'}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h3 class=\"title\">{{job.title | limit:36:32:'...'}}</h3>\r" +
    "\n" +
    "                    <span class=\"address\">{{job.address | limit:44:36:'...'}}</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a class=\"button more\" ng-click=\"loadMoreJobs()\" ng-show=\"haveMore\">Load more</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"list\">\r" +
    "\n" +
    "            <div class=\"header\">\r" +
    "\n" +
    "                <h2 class=\"title\"><strong>Volunteering</strong> ({{volunteeringJobs.length}})</h2>\r" +
    "\n" +
    "                <a href=\"\" class=\"button add\" ng-click=\"addJob('VOLUNTEERING')\">Add job</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"wrap\">\r" +
    "\n" +
    "                <a href=\"\" class=\"item\" ng-repeat=\"job in pagedVolunteeringJobs()\" ng-class=\"job.icon\">\r" +
    "\n" +
    "                    <span class=\"date\">{{job.date | date:'dd MMM yyyy'}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h3 class=\"title\">{{job.title | limit:36:32:'...'}}</h3>\r" +
    "\n" +
    "                    <span class=\"address\">{{job.address | limit:44:36:'...'}}</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a class=\"button more hidden\" ng-click=\"loadMoreVolunteeringJobs()\" ng-show=\"haveMoreVolunteeringJobs\">Load more</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/mainmenu.html',
    " <ul class=\"container\">\r" +
    "\n" +
    "    <li class=\"places\">\r" +
    "\n" +
    "        <a ui-sref=\"base.places({type: 'SHELTER'})\">Places</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "    <li class=\"jobs\">\r" +
    "\n" +
    "        <a ui-sref=\"base.jobs\"><span>Jobs</span></a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "    <li class=\"news\">\r" +
    "\n" +
    "        <a ui-sref=\"base.news\"><span>News</span></a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "    <li class=\"about\">\r" +
    "\n" +
    "        <a href=\"\"><span>About Crosscut</span></a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "</ul>"
  );


  $templateCache.put('views/news.html',
    "<div id=\"smallmenu\">\r" +
    "\n" +
    "    <ng-include src=\"'views/mainmenu.html'\"></ng-include>\r" +
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
    "                <h2 class=\"title\"><strong>News</strong> ({{news.length}})</h2>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"wrap\">\r" +
    "\n" +
    "                <a class=\"item\" ng-repeat=\"newsArticle in pagedNews()\" ng-href=\"{{newsArticle.url}}\" target=\"_blank\">\r" +
    "\n" +
    "                    <img ng-src=\"{{getNewsArticleImage(newsArticle.image)}}\" alt=\"\" />\r" +
    "\n" +
    "                    <span class=\"date\">{{newsArticle.date}}</span>\r" +
    "\n" +
    "                    <h3 class=\"title\">{{newsArticle.title | limit:35:17:'...'}}</h3>\r" +
    "\n" +
    "                    <span class=\"description\">{{newsArticle.description | limit:73:42:'...'}}</span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a class=\"button more\" ng-click=\"loadMore()\" ng-show=\"haveMore\">Load more</a>\r" +
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
    "    <ng-include src=\"'views/mainmenu.html'\"></ng-include>\r" +
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
    "                <a ui-sref=\"base.places({type: 'SHELTER'})\">Shelters</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('FOOD_PANTRIES')}\">\r" +
    "\n" +
    "                <a ui-sref=\"base.places({type: 'FOOD_PANTRIES'})\">Food Pantries</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('FOOD_BANK')}\">\r" +
    "\n" +
    "                <a ui-sref=\"base.places({type: 'FOOD_BANK'})\">Food Banks</a>\r" +
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
    "                <rating data-value=\"place.rating\" data-read-only=\"true\" class=\"inline\"></rating>\r" +
    "\n" +
    "                <span class=\"address\">{{place.address}}</span>\r" +
    "\n" +
    "                <rating data-value=\"place.rating\" data-read-only=\"true\" class=\"end\"></rating>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <ul class=\"actions\">\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <a href=\"\" class=\"button directions notext\" ng-click=\"showDirections()\"><span>Directions</span></a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <li>\r" +
    "\n" +
    "                    <a href=\"tel:{{place.phone | numbersOnly}}\" class=\"button phone notext\"><span>Call phone</span></a>\r" +
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
    "        <map data-location=\"place.location\" data-title=\"place.title\" data-read-only=\"true\" data-id=\"'place'\"></map>\r" +
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
    "                    <h2 class=\"title\"><strong>Reviews</strong> ({{place.reviews.length}})</h2>\r" +
    "\n" +
    "                    <a href=\"\" class=\"button notext add\" ng-click=\"addReview()\"><span>&nbsp;</span></a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"review\" ng-repeat=\"review in place.reviews\">\r" +
    "\n" +
    "                    <rating data-value=\"review.rating\" data-read-only=\"true\"></rating>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <h3 class=\"username\">{{review.author}}</h3>\r" +
    "\n" +
    "                    <span class=\"date\">{{review.date | date:'dd MMM yyyy'}}</span>\r" +
    "\n" +
    "                    <div class=\"description\" ng-bind-html=\"review.comment | unsafe\"></div>\r" +
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
    "    <ng-include src=\"'views/mainmenu.html'\"></ng-include>\r" +
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
    "                <a ui-sref=\"base.places({type: 'SHELTER'})\">Shelters</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('FOOD_PANTRIES')}\">\r" +
    "\n" +
    "                <a ui-sref=\"base.places({type: 'FOOD_PANTRIES'})\">Food Pantries</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <li ng-class=\"{'active': currentTab('FOOD_BANK')}\">\r" +
    "\n" +
    "                <a ui-sref=\"base.places({type: 'FOOD_BANK'})\">Food Banks</a>\r" +
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
    "            <div class=\"wrap\">\r" +
    "\n" +
    "                <a class=\"item\" ng-repeat=\"place in pagedPlaces()\" ui-sref=\"base.place({type: place.type, id: place.id})\">\r" +
    "\n" +
    "                    <img ng-src=\"{{getPlaceImage(place.image)}}\" alt=\"\" />\r" +
    "\n" +
    "                    <h3 class=\"title\">{{place.title | limit:35:17:'...'}}</h3>\r" +
    "\n" +
    "                    <span class=\"address\">{{place.address | limit:44:26:'...'}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <rating data-value=\"place.rating\" data-read-only=\"true\"></rating>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <a class=\"button more\" ng-click=\"loadMore()\" ng-show=\"haveMore\">Load more</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/preloader.html',
    "<div id=\"preloader\" ng-show=\"visible\">\r" +
    "\n" +
    "    <div class=\"background\"></div>\r" +
    "\n" +
    "    <div class=\"container\" ng-style=\"{'marginTop': getMarginTop() + 'px'}\">\r" +
    "\n" +
    "        <span>Loading...</span>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);
