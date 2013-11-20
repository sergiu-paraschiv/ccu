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