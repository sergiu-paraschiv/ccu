(function($, undefined) {
    'use strict';
    
    function toggleMenu(e) {
        if(e) {
            e.preventDefault();
        }
        
        $(this).parent().toggleClass('closed');
    }
    
    $('#header .menu.main .handle').click(toggleMenu);
    $('#header .menu.account .handle').click(toggleMenu);
    
})(this.jQuery);