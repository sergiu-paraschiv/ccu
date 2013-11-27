(function (undefined) {
    'use strict';

    function NewsArticle(data) {
        this.image = data.image || '';
        this.title = data.title || '';
        this.description = data.description || '';
        this.date = data.date || '';
        this.url = data.url || '';
    }

    this.exports(this.Models, {
        NewsArticle: NewsArticle
    });

}).call(this.Crosscut);