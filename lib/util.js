(function(){
    var startTime = new Date().getTime();
    var refTime   = new Date(2009, 11, 10, 5, 29, 30).getTime();
    window.getCurrentTime = function(){
        var delta = (new Date().getTime()) - startTime;
        return new Date(refTime + delta);
    };
})();