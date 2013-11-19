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