(function (undefined) {
    'use strict';

    this.Main.directive('rating', [
        function () {
            return {
                restrict: 'E',
                transclude: false,
                replace: true,
                scope: {
                    value: '='
                },
                templateUrl: 'views/directives/rating.html',

                controller: function ($scope) {
                    $scope.getRatingClass = function () {
                        return ('r' + (Math.ceil($scope.value * 2) / 2).toFixed(1)).replace('.', '');
                    };
                }
            };
        }
    ]);

}).call(this.Crosscut, this.angular);