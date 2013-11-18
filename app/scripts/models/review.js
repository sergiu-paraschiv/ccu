(function (undefined) {
    'use strict';

    function Review(data) {
        this.author = data.author || '';
        this.comment = data.comment || '';
        this.date = data.date || '';
        this.rating = data.rating || 0;
    }

    this.exports(this.Models, {
        Review: Review
    });

}).call(this.Crosscut);