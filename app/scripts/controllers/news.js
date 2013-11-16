(function(undefined) {
    'use strict';

    var NewsArticle = this.Models.NewsArticle;
   
    this.Main.controller('NewsCtrl', [
        '$scope', 
        
        function ($scope) {
            $scope.getNewsArticleImage = function (src) {
                if (src === '') {
                    return 'images/news.placeholder.png';
                }

                return src;
            };

            $scope.news = [
               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: '',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: '',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: 'images/dynamic/place1.png',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               }),

               new NewsArticle({
                   image: '',
                   title: 'Lorem ipsum dolor sit amet...',
                   description: 'Lorem ipsum dolor sit amet, consectet. Ut nec elit ac felis ullamcorper rhonc...',
                   date: '27 Oct 2013'
               })
            ];
        }
    ]);
        
}).call(this.Crosscut);