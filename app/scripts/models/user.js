(function (undefined) {
    'use strict';

    function User(data) {
        this.id = data.id || 123456;
        this.name = data.name || 'Sergiu Paraschiv';
    }

    this.exports(this.Models, {
        User: User
    });

}).call(this.Crosscut);