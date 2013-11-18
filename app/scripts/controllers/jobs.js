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
        
}).call(this.Crosscut);