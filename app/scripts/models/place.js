(function (undefined) {
    'use strict';

    function Place(data, type) {
        this.id = data.gReference;
        this.image = '';
        this.title = data.name || '';
        this.description = data.description || '';
        this.address = data.address.formatedAddress || '';
        this.phone = data.address.formatedPhone || '';
        this.rating = data.averageRating || 0;
        this.location = {
            lat: data.address.latitude || 0,
            lng: data.address.longitude || 0
        };
        this.type = type || '';
        this.reviews = [];
    }

    this.exports(this.Models, {
        Place: Place
    });

}).call(this.Crosscut);