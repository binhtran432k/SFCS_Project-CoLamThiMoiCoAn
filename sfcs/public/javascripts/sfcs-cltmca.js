$(document).ready(function(){
    socket.on('serverSendRedirectHome', function(){
	    window.location.href = '/';
    })
    socket.on('serverSendMessage', function(data){
	    alert(data.message);
    });
    $('#logoutBtn').click(function(){
        socket.emit('clientLogout');
    });
    socket.emit('clientGetNumCartToPay');
    socket.on('serverSendNumCartToPay', function(data){
        $('#numCartToPay').html(data.numCartToPay > 0 ?' (' + data.numCartToPay + ')': '');
    });
    socket.on('serverChangeCart', function(){
        socket.emit('clientGetNumCartToPay');
        socket.emit('clientGetListCartToPay');
    });
});