(function(undefined) {
    'use strict';

    var C = this.Constants;
   
    this.Main.controller('NewsCtrl', [
        '$scope',
        'NewsSrvc',
        'ResponsiveSrvc',
        
        function ($scope, news, responsive) {
            $scope.news = [];
            $scope.haveMore = true;
            $scope.perPage = C.NEWS.PER_PAGE;
            $scope.endAt = C.NEWS.PER_PAGE;

            function getPerPage() {
                if (responsive.isXDPI()) {
                    return C.NEWS.PER_PAGE_XDPI;
                }

                return C.NEWS.PER_PAGE;
            }

            function setLayout() {
                $scope.perPage = getPerPage();
            }

            function init() {
                setLayout();

                news.search(function (newsList) {
                    $scope.news = newsList;
                    $scope.endAt = getPerPage();
                    $scope.haveMore = true;
                });
            }

            $scope.$on('responsiveLayoutChanged', setLayout);

            $scope.pagedNews = function () {
                var paged = $scope.news.slice(0, $scope.endAt);

                if (paged.length === $scope.news.length) {
                    $scope.haveMore = false;
                }

                return paged;
            };

            $scope.loadMore = function () {
                $scope.endAt += $scope.perPage;
            };

            $scope.getNewsArticleImage = function (src) {
                if (src === '') {
                    return 'images/news.placeholder.png';
                }

                return src;
            };

            init();
        }
    ]);
        
}).call(this.Crosscut);