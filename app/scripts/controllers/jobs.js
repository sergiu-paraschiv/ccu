(function(undefined) {
    'use strict';
   
    var C = this.Constants;

    this.Main.controller('JobsCtrl', [
        '$scope', 
        '$rootScope',
        'JobsSrvc',
        'ResponsiveSrvc',

        function ($scope, $rootScope, jobs, responsive) {
            $scope.jobs = [];
            $scope.haveMore = true;
            $scope.perPage = C.JOB.PER_PAGE;
            $scope.endAt = C.JOB.PER_PAGE;

            $scope.volunteeringJobs = [];
            $scope.haveMoreVolunteeringJobs = true;
            $scope.endAtVolunteeringJobs = C.JOB.PER_PAGE;

            function getPerPage() {
                if (responsive.isXDPI()) {
                    return C.JOB.PER_PAGE_XDPI;
                }

                return C.JOB.PER_PAGE;
            }

            function setLayout() {
                $scope.perPage = getPerPage();
            }

            function init() {
                setLayout();

                jobs.search(C.JOB.TYPE.PAID, function (jobsList) {
                    $scope.jobs = jobsList;
                    $scope.endAt = getPerPage();
                    $scope.haveMore = true;
                });

                jobs.search(C.JOB.TYPE.VOLUNTEERING, function (jobsList) {
                    $scope.volunteeringJobs = jobsList;
                    $scope.endAtVolunteeringJobs = getPerPage();
                    $scope.haveMoreVolunteeringJobs = true;
                });
            }

            $scope.$on('responsiveLayoutChanged', setLayout);

            $scope.pagedJobs = function () {
                var paged = $scope.jobs.slice(0, $scope.endAt);

                if (paged.length === $scope.jobs.length) {
                    $scope.haveMore = false;
                }

                return paged;
            };

            $scope.pagedVolunteeringJobs = function () {
                var paged = $scope.volunteeringJobs.slice(0, $scope.endAtVolunteeringJobs);

                if (paged.length === $scope.volunteeringJobs.length) {
                    $scope.haveMoreVolunteeringJobs = false;
                }

                return paged;
            };

            $scope.loadMore = function () {
                $scope.endAt += $scope.perPage;
            };

            $scope.loadMoreVolunteeringJobs = function () {
                $scope.endAtVolunteeringJobs += $scope.perPage;
            };

            $scope.$on('jobAdded', function () {
                init();
            });

            $scope.$on('refresh', function () {
                init();
            });

            $scope.addJob = function (type) {
                $rootScope.$broadcast('addJob', { type: type });
            };

            $scope.getJobIcon = function (type) {
                if (type === '') {
                    return 'images/blank.png';
                }

                return 'images/jobs.icon.' + type + '.png';
            };

            init();
        }
    ]);
        
}).call(this.Crosscut);