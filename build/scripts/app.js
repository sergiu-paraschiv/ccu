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
(function (undefined) {
    'use strict';

    function Place(data) {
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
            
            $scope.toggleMainMenu = function() {
                $scope.mainMenuIsClosed = !$scope.mainMenuIsClosed;
            };
            
            $scope.toggleAccountMenu = function() {
                $scope.accountMenuIsClosed = !$scope.accountMenuIsClosed;
            };
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
    "<div id=\"smallmenu\" class=\"container\">\r" +
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
    "    <div class=\"active jobs\">&nbsp;</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"jobs\" class=\"container\">\r" +
    "\n" +
    "    <ul class=\"tabs\">\r" +
    "\n" +
    "        <li class=\"active\">\r" +
    "\n" +
    "            <a href=\"\">All jobs</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <li>\r" +
    "\n" +
    "            <a href=\"\">Announcements</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"list\">\r" +
    "\n" +
    "        <div class=\"header\">\r" +
    "\n" +
    "            <h2 class=\"title\"><strong>Paid jobs</strong> (74)</h2>\r" +
    "\n" +
    "            <a href=\"\" class=\"button add\">Add job</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <a href=\"\" class=\"item\" ng-repeat=\"job in jobs\" ng-class=\"job.icon\">\r" +
    "\n" +
    "                <span class=\"date\">{{job.date}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <h3 class=\"title\">{{job.title}}</h3>\r" +
    "\n" +
    "                <span class=\"address\">{{job.address}}</span>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <a class=\"button more\">Load more</a>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"list\">\r" +
    "\n" +
    "        <div class=\"header\">\r" +
    "\n" +
    "            <h2 class=\"title\"><strong>Volunteering</strong> (4)</h2>\r" +
    "\n" +
    "            <a href=\"\" class=\"button add\">Add job</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <a href=\"\" class=\"item\" ng-repeat=\"job in volunteeringJobs\" ng-class=\"job.icon\">\r" +
    "\n" +
    "                <span class=\"date\">{{job.date}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <h3 class=\"title\">{{job.title}}</h3>\r" +
    "\n" +
    "                <span class=\"address\">{{job.address}}</span>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <a class=\"button more hidden\">Load more</a>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/news.html',
    "<div id=\"smallmenu\" class=\"container\">\r" +
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
    "    <div class=\"active news\">&nbsp;</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"news\" class=\"container\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"list\">\r" +
    "\n" +
    "        <div class=\"header\">\r" +
    "\n" +
    "            <h2 class=\"title\"><strong>News</strong> (26)</h2>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <a href=\"\" class=\"item\" ng-repeat=\"newsArticle in news\">\r" +
    "\n" +
    "                <img ng-src=\"{{getNewsArticleImage(newsArticle.image)}}\" alt=\"\" />\r" +
    "\n" +
    "                <span class=\"date\">{{newsArticle.date}}</span>\r" +
    "\n" +
    "                <h3 class=\"title\">{{newsArticle.title}}</h3>\r" +
    "\n" +
    "                <span class=\"description\">{{newsArticle.description}}</span>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <a class=\"button more\">Load more</a>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('views/places.html',
    "<div id=\"smallmenu\" class=\"container\">\r" +
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
    "    <div class=\"active places\">&nbsp;</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"places\" class=\"container\">\r" +
    "\n" +
    "    <ul class=\"tabs\">\r" +
    "\n" +
    "        <li class=\"active\">\r" +
    "\n" +
    "            <a href=\"\">Shelters</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li>\r" +
    "\n" +
    "            <a href=\"\">Food Pantries</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <li>\r" +
    "\n" +
    "            <a href=\"\">Food Banks</a>\r" +
    "\n" +
    "        </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"list\">\r" +
    "\n" +
    "        <div class=\"header\">\r" +
    "\n" +
    "            <h2 class=\"title\"><strong>Shelters</strong> (87)</h2>\r" +
    "\n" +
    "            <a href=\"\" class=\"button add\">Add shelter</a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div class=\"container\">\r" +
    "\n" +
    "            <a href=\"\" class=\"item\" ng-repeat=\"place in places\">\r" +
    "\n" +
    "                <img ng-src=\"{{getPlaceImage(place.image)}}\" alt=\"\" />\r" +
    "\n" +
    "                <h3 class=\"title\">{{place.title}}</h3>\r" +
    "\n" +
    "                <span class=\"address\">{{place.address}}</span>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <rating data-value=\"place.rating\"></rating>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <a class=\"button more\">Load more</a>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );

}]);
