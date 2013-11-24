(function (ng, undefined) {
    'use strict';

    this.Main.directive('rating', [
        function () {
            return {
                restrict: 'E',
                transclude: false,
                replace: true,
                scope: {
                    value: '=',
                    readOnly: '='
                },
                templateUrl: 'views/directives/rating.html',

                controller: function ($scope) {

                    var maxRange = 5;

                    function createRateObjects() {
                        var states = [];

                        for (var i = 0, n = maxRange; i < n; i++) {
                            states[i] = {
                                index: i
                            };
                        }

                        return states;
                    }

                    $scope.range = createRateObjects();

                    $scope.rate = function (value) {
                        if ($scope.readOnly || $scope.value === value) {
                            return;
                        }

                        $scope.value = value;
                    };

                    $scope.enter = function (value) {
                        if (!$scope.readOnly) {
                            $scope.val = value;
                        }
                    };

                    $scope.reset = function () {
                        $scope.val = ng.copy($scope.value);
                    };

                    $scope.$watch('value', function (value) {
                        $scope.val = value;
                    });
                }
            };
        }
    ]);

}).call(this.Crosscut, this.angular);
