(function($, undefined) {
    'use strict';
    
    this.Crosscut = {
        Models: {}
    };
    
    this.Crosscut.exports = function(where, what) {
        $.extend(true, where, what);
    };

}).call(this, this.jQuery);
(function(ng, undefined) {
    'use strict';
   
    var module = ng.module('Crosscut', [
        'ui.router'
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
                url: '/places',
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
                url: '/place/{id}',
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
                },
                templateUrl: 'views/directives/map.html',

                controller: function ($scope, $element) {
                    var map;

                    var mapOptions = {
                        zoom: 8,
                        center: new maps.LatLng(-34.397, 150.644),
                        mapTypeId: maps.MapTypeId.ROADMAP
                    };

                    map = new maps.Map($element[0], mapOptions);
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

    function Place(data) {
        this.id = data.id;
        this.image = data.image || '';
        this.title = data.title || '';
        this.address = data.address || '';
        this.rating = data.rating || 0;
    }

    this.exports(this.Models, {
        Place: Place
    });

}).call(this.Crosscut, this.angular);
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

}).call(this.Crosscut, this.angular);
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

}).call(this.Crosscut, this.angular);
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
        
}).call(this.Crosscut, this.angular);
(function(undefined) {
    'use strict';
   
    this.Main.controller('HomeCtrl', [
        '$scope', 
        
        function($scope) {
        }
    ]);
        
}).call(this.Crosscut, this.angular);
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
        
}).call(this.Crosscut, this.angular);
(function(undefined) {
    'use strict';

    var Place = this.Models.Place;
   
    this.Main.controller('PlaceCtrl', [
        '$scope', 
        '$stateParams',

        function ($scope, $stateParams) {
            
        }
    ]);
        
}).call(this.Crosscut, this.angular);
(function(undefined) {
    'use strict';
   
    this.Main.controller('AddPlaceCtrl', [
        '$scope', 
        '$rootScope',

        function ($scope, $rootScope) {
            $scope.visible = false;

            $scope.name = '';
            $scope.description = '';
            $scope.address = '';

            $scope.$on('addPlace', function (e, config) {
                $rootScope.$broadcast('showModal');
                $scope.visible = true;
            });

            $scope.clear = function (fieldName) {
                $scope[fieldName] = '';
            };

            $scope.cancel = function () {
                $rootScope.$broadcast('hideModal');
                $scope.visible = false;
            };
        }
    ]);
        
}).call(this.Crosscut, this.angular);
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
        
}).call(this.Crosscut, this.angular);
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
        
}).call(this.Crosscut, this.angular);
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
    "        <h1 class=\"title add\"><strong>Add new shelter</strong></h1>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <form>\r" +
    "\n" +
    "            <p class=\"input text\" ng-class=\"{'notempty': name != ''}\">\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"name\" placeholder=\"Name\" is-focused />\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('name')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"input text\" ng-class=\"{'notempty': description != ''}\">\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"description\" placeholder=\"Description\" is-focused />\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('description')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <p class=\"input text\" ng-class=\"{'notempty': address != ''}\">\r" +
    "\n" +
    "                <input type=\"text\" ng-model=\"address\" placeholder=\"Address\" is-focused />\r" +
    "\n" +
    "                <a href=\"\" class=\"clear\" ng-click=\"clear('address')\"><span>Clear</span></a>\r" +
    "\n" +
    "            </p>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"actions\">\r" +
    "\n" +
    "            <a href=\"\" class=\"button save\"><span>Save</span></a>\r" +
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
    "            <a ui-sref=\"places\">Places</a>\r" +
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
    "            <a ui-sref=\"places\"><span>Places</span></a>\r" +
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
    "            <a ui-sref=\"places\"><span>Places</span></a>\r" +
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
    "            <a ui-sref=\"places\"><span>Places</span></a>\r" +
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
    "            <li class=\"active\">\r" +
    "\n" +
    "                <a href=\"\">Shelters</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <li>\r" +
    "\n" +
    "                <a href=\"\">Food Pantries</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <li>\r" +
    "\n" +
    "                <a href=\"\">Food Banks</a>\r" +
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
    "                <h1 class=\"title\"><strong>HELP Women's Shelter</strong></h1>\r" +
    "\n" +
    "                <rating data-value=\"4.35\" class=\"inline\"></rating>\r" +
    "\n" +
    "                <span class=\"address\">Brooklyn, NY 11216</span>\r" +
    "\n" +
    "                <rating data-value=\"4.35\" class=\"end\"></rating>\r" +
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
    "                    <a href=\"\" class=\"button phone notext\"><span>Call phone</span></a>\r" +
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
    "        <map></map>\r" +
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
    "            <a ui-sref=\"places\"><span>Places</span></a>\r" +
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
    "            <li class=\"active\">\r" +
    "\n" +
    "                <a href=\"\">Shelters</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <li>\r" +
    "\n" +
    "                <a href=\"\">Food Pantries</a>\r" +
    "\n" +
    "            </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <li>\r" +
    "\n" +
    "                <a href=\"\">Food Banks</a>\r" +
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
    "                <h2 class=\"title\"><strong>Shelters</strong> (87)</h2>\r" +
    "\n" +
    "                <a href=\"\" class=\"button add\" ng-click=\"addPlace()\">Add shelter</a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "            <div class=\"container\">\r" +
    "\n" +
    "                <a class=\"item\" ng-repeat=\"place in places\" ui-sref=\"place({id: place.id})\">\r" +
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
