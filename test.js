function CheckPassword(inputtxt) { 
    var passw=  /^[0-9A-Za-z]\w{8,20}$/;
    if (inputtxt.match(passw)) { 
        return true;
    } else { 
        return false;
    }
}
var check = CheckPassword('13+2121212131faaA');
console.log(check);