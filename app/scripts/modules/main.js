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