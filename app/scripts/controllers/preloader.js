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