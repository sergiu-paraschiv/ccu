(function($, undefined) {
    'use strict';
   
    var Review = this.Models.Review;

    this.Main.controller('AddReviewCtrl', [
        '$scope', 
        '$rootScope',
        'ReviewsSrvc',

        function ($scope, $rootScope, reviews) {
            $scope.visible = false;

            $scope.review = null;
            $scope.reference = null;

            $scope.$on('addReview', function (e, config) {
                $scope.review = new Review({});
                $scope.reference = config.reference;

                $rootScope.$broadcast('showModal');
                $scope.visible = true;
            });

            $scope.clear = function (fieldName) {
                $scope.review[fieldName] = '';
            };

            function hide() {
                $rootScope.$broadcast('hideModal');
                $scope.visible = false;
            }

            $scope.cancel = hide;

            $scope.save = function () {
                reviews.add($scope.review, $scope.reference, 'PLACE', function () {
                    $rootScope.$broadcast('reviewAdded');
                    hide();
                })
            };

            $scope.getMarginTop = function () {
                if ($(window).width() < 960) {
                    return 0;
                }

                return $scope.getFullHeight() / 2 - $('#addreview').height() / 2;
            };
        }
    ]);
        
}).call(this.Crosscut, this.jQuery);