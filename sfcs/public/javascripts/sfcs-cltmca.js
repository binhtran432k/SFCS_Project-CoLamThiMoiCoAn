$(document).ready(function(){
    socket.on('serverSendRedirect', function(){
	    window.location.href = '/';
    })
    socket.on('serverSendFail', function(data){
	    alert(data.message);
    });
    $('#logoutBtn').click(function(){
        socket.emit('clientSendLogout');
    });
    socket.emit('clientGetNumCartToPay');
    socket.on('serverSendNumCartToPay', function(numCartToPay){
        $('#numCartToPay').html(numCartToPay > 0? ' (' + numCartToPay + ')': '');
    });
});