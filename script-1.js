'use strict';
peer.on('open', function(){
    $('#my-id').text(peer.id);
});
