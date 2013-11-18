(function($, window, undefined) {
    'use strict';
   
    this.Main.controller('MainCtrl', [
        '$scope', 
        
        function($scope) {
            $scope.mainMenuIsClosed = true;
            $scope.accountMenuIsClosed = true;
            $scope.modalIsVisible = false;
            $scope.fullHeight = $(window).height();
            
            $scope.toggleMainMenu = function() {
                $scope.mainMenuIsClosed = !$scope.mainMenuIsClosed;
            };
            
            $scope.toggleAccountMenu = function() {
                $scope.accountMenuIsClosed = !$scope.accountMenuIsClosed;
            };

            $scope.getFullHeight = function () {
                return $scope.fullHeight;
            };

            $scope.$on('showModal', function () {
                $scope.modalIsVisible = true;
            });

            $scope.$on('hideModal', function () {
                $scope.modalIsVisible = false;
            });

            $(window).on('resize', function () {
                if ($(window).width() >= 960) {
                    $scope.fullHeight = $(this).height();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }
            });
        }
    ]);
        
}).call(this.Crosscut, this.jQuery, window);
