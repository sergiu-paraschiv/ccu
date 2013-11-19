(function (undefined) {
    'use strict';

    function User(data) {
        this.id = data.id || 123456;
        this.name = data.name || 'John Doe';
    }

    this.exports(this.Models, {
        User: User
    });

}).call(this.Crosscut);