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
