var MILIS_FACTOR = 10000000;
function toScaledTime(date) {
    return date.getTime() / MILIS_FACTOR;
}
function getXFromDate(date) {
    var x = toScaledTime(date);
    return (view.x + x) * view.scale + hww;
}
function GetDateFromX(x) {
    //x = date.getTime() / 10_000_000;
    //return (view.x + x) * view.scale + hww;
    var ux = x - hww;
    ux = ux / view.scale;
    ux = ux - view.x;
    var milisX = ux * MILIS_FACTOR;
    return new Date(milisX);
}
