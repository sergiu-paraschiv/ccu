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

        LOCATION: {
            URL: {
                GEOCODE: 'https://gcdc2013-crosscut.appspot.com/_ah/api/location/v1/locations?lat={lat}&long={lng}'
            },

            DEFAULT: {
                lat: -118.2025121,
                lng: 34.0483953
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
                    },

                    'addReview': {
                        templateUrl: 'views/addreview.html',
                        controller: 'AddReviewCtrl'
                    }
                }
            })
            
            .state('jobs', {
                url: '/jobs',
                views: {
                    'content': {
                        templateUrl: 'views/jobs.html',
                        controller: 'JobsCtrl'
                    },

                    'addJob': {
                        templateUrl: 'views/addjob.html',
                        controller: 'AddJobCtrl'
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
(function(undefined) {
    'use strict';
    
    this.Main.filter('unsafe', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

}).call(this.Crosscut);
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

                    function createRateObjects(states) {
                        var states = [];

                        for (var i = 0, n = maxRange; i < n; i++) {
                            states[i] = {
                                index: i
                            };
                        }

                        return states;
                    };

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
                    var map, marker, center, directionsService, directionsDisplay;

                    
                    var mapOptions = {
                        zoom: 14,
                        mapTypeId: maps.MapTypeId.ROADMAP,
                        scrollwheel: false
                    };

                    directionsService = new maps.DirectionsService();
                    directionsDisplay = new maps.DirectionsRenderer();

                    map = new maps.Map($element[0], mapOptions);

                    directionsDisplay.setMap(map);

                    $scope.$watch('location', function (newData, oldData) {
                        if (oldData === undefined && newData !== undefined) {
                            center = new maps.LatLng($scope.location.lat, $scope.location.lng);

                            map.panTo(center);

                            marker = new maps.Marker({
                                position: center,
                                map: map,
                                title: $scope.title
                            });

                            maps.event.addDomListener(window, 'resize', function () {
                                map.setCenter(center);
                            });

                        }
                    }, true);

                    $scope.$on('showDirections', function (e, latLng) {
                        var request = {
                            origin: new maps.LatLng(latLng.lat, latLng.lng),
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
                location.get(function (latLng) {
                    var url = C.JOB.URL.SEARCH
                                .replace('{lat}', latLng.lat)
                                .replace('{lng}', latLng.lng)
                                .replace('{type}', type);

                    $http.get(url).success(function (data) {
                        callback.call(undefined, jobsMapper.map(data.items, type));
                    });
                });
            }

            function add(job, callback) {
                var url = C.JOB.URL.ADD
                                .replace('{due}', '12.12.2014')
                                .replace('{type}', job.type);

                var data = jobsMapper.unmapOne(job);

                user.get(function (publisher) {
                    data.publisherId = publisher.id;

                    $http.post(url, data).success(function (data) {
                        callback.call(undefined);
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
        'ResponsiveSrvc',
        
        function ($scope, responsive) {
            $scope.mainMenuIsClosed = true;
            $scope.accountMenuIsClosed = true;
            $scope.modalIsVisible = false;

            function setLayout() {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }

            $scope.toggleMainMenu = function() {
                $scope.mainMenuIsClosed = !$scope.mainMenuIsClosed;
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
                    $rootScope.$broadcast('showDirections', latLng);
                })                
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
                })
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
                })
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
    "            <a ui-sref=\"jobs\"><span>Jobs</span></a>\r" +
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
    "            <div class=\"container\">\r" +
    "\n" +
    "                <a href=\"\" class=\"item\" ng-repeat=\"job in pagedVolunteeringJobs()\" ng-class=\"job.icon\">\r" +
    "\n" +
    "                    <span class=\"date\">{{job.date | date:'dd MMM yyyy'}}</span>\r" +
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
    "            <a class=\"button more hidden\" ng-click=\"loadMoreVolunteeringJobs()\" ng-show=\"haveMoreVolunteeringJobs\">Load more</a>\r" +
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
    "                <a class=\"item\" ng-repeat=\"place in pagedPlaces()\" ui-sref=\"place({type: place.type, id: place.id})\">\r" +
    "\n" +
    "                    <img ng-src=\"{{getPlaceImage(place.image)}}\" alt=\"\" />\r" +
    "\n" +
    "                    <h3 class=\"title\">{{place.title}}</h3>\r" +
    "\n" +
    "                    <span class=\"address\">{{place.address}}</span>\r" +
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

}]);
