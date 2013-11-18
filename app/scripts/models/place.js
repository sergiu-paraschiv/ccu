(function (undefined) {
    'use strict';

    function Place(data) {
        this.id = data.id;
        this.image = data.image || '';
        this.title = data.title || '';
        this.address = data.address || '';
        this.rating = data.rating || 0;
    }

    this.exports(this.Models, {
        Place: Place
    });

}).call(this.Crosscut);