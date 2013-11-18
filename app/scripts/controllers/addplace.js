(function($, undefined) {
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

            $scope.getMarginTop = function () {
                if ($(window).width() < 960) {
                    return 0;                    
                }

                return $scope.getFullHeight() / 2 - $('#addplace').height() / 2;
            };
        }
    ]);
        
}).call(this.Crosscut, this.jQuery);