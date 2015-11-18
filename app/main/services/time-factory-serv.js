'use strict';
angular.module('main')
.factory('TimeFactory', function ($log) {

  $log.log('Time Factory reporting for duty.');

  var epoc = new Date().getTimezoneOffset() * 60;
      epoc = epoc * -1;

  ////////////////////////////////////
  // Mean local solar time. Dat EOT.
  ////////////////////////////////////
  function getMeanSolar (longitude) {
    var meanEpoc = longitude * (86400 / 360);
    var diffTime = meanEpoc - epoc; // Difference btw mean solar and clock.
    // Mean solar time by clock diff.
    var meanTime = new Date(new Date().valueOf() + diffTime * 1000);

    return meanTime;
  }

  ////////////////////////////////////
  // True Solar Time. Dat EOT.
  ////////////////////////////////////
  function getTrueSolar (longitude) {
    var meanEpoc = longitude * (86400 / 360);
    var diffTime = meanEpoc - epoc; // Difference btw mean solar and clock.
    // Get pi.
    var pi = Math.PI;
    var twopi = 2*pi;

    // W = 360/365.24 = the Earth's mean angular orbital velocity in degrees per day
     // in degrees; a constant ratio
    var W = 360/365.24;

    // Get cardinal day (1-366).
    // http://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    // Cardinal day.
    var DDaze = Math.floor(diff / oneDay);

    // A is the angle the earth would move on its orbit at its average speed from the December solstice to date D.
    // A = W*(D+10)
    var degreeA = W * (DDaze+10);

    // B is the angle the Earth moves from the solstice to date D, including a first-order correction for the Earth's orbital eccentricity, 0.0167.
    // B = A + (360/pi) x 0.0167 x sin(W x (D-2))

    // A == degree A
    // (360/pi) == peacoat; constant ratio
    var peacoat = 360/pi;
    // W*(DDaze-2) == warcat; in degrees
    var warcat = W*(DDaze-2);
    // warcat in radians = downjig
    var downjig = warcat/360*twopi;
    // sin(W x (D-2)) will use downjig; will return radian
    var radicalSin = Math.sin(downjig);
    // all toes together now; B in degrees
    var degreeB = degreeA + peacoat * 0.0167 * radicalSin;
    // FYI, Dbrosef radianB (Darwin does trig in radians)
    var radianB = degreeB/360*twopi; // for C crunching

    // C is the difference between the angles moved at mean speed, and at the corrected speed projected onto the equatorial plane, and divided by 180 to get the difference in "half turns". The number 23.44 is the obliquity (tilt) of the Earth's axis in degrees. The subtraction gives the conventional sign to the equation of time
    // C = (A - arctan(tan(B)/cos(23.44)))/180

    // tan(B) --> tan(radianB)
    var radianTanB = Math.tan(radianB);
    // 23.44 --> radiatied
    var radian23 = 23.44/360*twopi;
    var radianCos23 = Math.cos(radian23);
    var fiveDollarRadicalTanCo = Math.atan(radianTanB/radianCos23);
    var fiveDollarSinTanCo = fiveDollarRadicalTanCo/twopi*360;
    var topShelfC = degreeA - fiveDollarSinTanCo;
    var cDog = topShelfC/180;
    var cRounder = Math.round(cDog);
    var datEOT = 720 * (cDog - cRounder); // < --  minutes
    var datEOTSeconds = datEOT * 60; // <--  seconds (-350.428...)

    var trueTime = new Date(new Date().valueOf() + diffTime * 1000 - datEOTSeconds * 1000);
    return trueTime;
  }


  return {
    getMeanSolar: getMeanSolar,
    getTrueSolar: getTrueSolar
  };

});
