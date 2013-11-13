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