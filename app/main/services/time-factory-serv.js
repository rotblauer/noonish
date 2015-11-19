'use strict';
angular.module('main')
.factory('TimeFactory', function ($log) {

  $log.log('Time Factory reporting for duty.');



  /// Form matters.

  ////////////////////////////////////
  // Format EOT diff.
  ////////////////////////////////////
  function formatEOT () {
    var diffEOTM = ( ( -1 * equationOfTime() ) / 60 );
    var diffEOTS = (diffEOTM % 1);
    var diffEOTMM = (diffEOTM - diffEOTS);
      //\\
      console.log('diffEOTMM', diffEOTMM)

    var diffEOTSS = (diffEOTS * 60);
    var diffEOTSSS = (diffEOTSS % 1);
    var diffEOTSSSS = (diffEOTSS - diffEOTSSS);
      //\\
      console.log('diffEOTSSSS', diffEOTSSSS);
    // Decide whether number is positive or negative and small or big and

    // If the seconds is less than zero multiply by -1 to get rid of the prepended negative
    // (this is strictly for appearances)
    if (diffEOTSSSS < 0) {
      return diffEOTSSSS = diffEOTSSSS * -1;
    }
    // If the seconds is less than 10 append a 0
    // ...so :09 instead of :9
    if (diffEOTSSSS < 10) {
      return diffEOTSSSS = '0' + diffEOTSSSS;
    }
    // I just flip flopped the prepended + and - because Sven
    // and added the plus/minus appendage for bigger numbers too, like Sven's 77.
    if (diffEOTMM < 10 && diffEOTMM > 0) {
      return diffEOTMM = '+0' + diffEOTMM;
    }
    if (diffEOTMM > 10) {
      return diffEOTMM = '+' + diffEOTMM;
    }

    if (diffEOTMM > -10 && diffEOTMM < 0) {
      return diffEOTMM = '-0' + (-1*diffEOTMM);
    }
    if (diffEOTMM < -10 ) {
      return diffEOTMM = '-' + (-1*diffEOTMM);
    }
  }


  // ////////////////////////////////////
  // // Format true solar <-> clock diff.
  // ////////////////////////////////////

  function diffTrueClock (longitude) {
    var lon = longitude;
    var diff = diffMeanClock(longitude) - equationOfTime(); // in seconds
    return diff;
  }
  // $scope.diffTrueTimeM = ( ($scope.diffTime - $scope.datEOTSeconds) / 60 );
  // $scope.diffTrueTimeS = ($scope.diffTrueTimeM % 1);
  // $scope.diffTrueTimeMM = ($scope.diffTrueTimeM - $scope.diffTrueTimeS);

  // $scope.diffTrueTimeSS = ($scope.diffTrueTimeS * 60);
  // $scope.diffTrueTimeSSS = ($scope.diffTrueTimeSS % 1);
  // $scope.diffTrueTimeSSSS = ($scope.diffTrueTimeSS - $scope.diffTrueTimeSSS);

  // // Decide whether number is positive or negative and small or big and

  // // If the seconds is less than zero multiply by -1 to get rid of the prepended negative
  // // (this is strictly for appearances)
  // if ($scope.diffTrueTimeSSSS < 0) {
  //   $scope.diffTrueTimeSSSS = $scope.diffTrueTimeSSSS * -1;
  // }
  // // If the seconds is less than 10 append a 0
  // // ...so :09 instead of :9
  // if ($scope.diffTrueTimeSSSS < 10) {
  //   $scope.diffTrueTimeSSSS = '0' + $scope.diffTrueTimeSSSS;
  // }
  // // I just flip flopped the prepended + and - because Sven
  // // and added the plus/minus appendage for bigger numbers too, like Sven's 77.
  // if ($scope.diffTrueTimeMM < 10 && $scope.diffTrueTimeMM > 0) {
  //   $scope.diffTrueTimeMM = '+0' + $scope.diffTrueTimeMM;
  // }
  // if ($scope.diffTrueTimeMM > 10) {
  //   $scope.diffTrueTimeMM = '+' + $scope.diffTrueTimeMM;
  // }

  // if ($scope.diffTrueTimeMM > -10 && $scope.diffTrueTimeMM < 0) {
  //   $scope.diffTrueTimeMM = '-0' + (-1*$scope.diffTrueTimeMM);
  // }
  // if ($scope.diffTrueTimeMM < -10 ) {
  //   $scope.diffTrueTimeMM = '-' + (-1*$scope.diffTrueTimeMM);
  // }
  // ////////////////////////////////////
  // // Format mean solar <-> clock diff.
  // ////////////////////////////////////
  // $scope.diffTimeM = ($scope.diffTime / 60);
  // $scope.diffTimeS = ($scope.diffTimeM % 1);
  // $scope.diffTimeMM = ($scope.diffTimeM - $scope.diffTimeS);

  // $scope.diffTimeSS = ($scope.diffTimeS * 60);
  // $scope.diffTimeSSS = ($scope.diffTimeSS % 1);
  // $scope.diffTimeSSSS = ($scope.diffTimeSS - $scope.diffTimeSSS);

  // // Decide whether number is positive or negative and small or big and

  // // If the seconds is less than zero multiply by -1 to get rid of the prepended negative
  // // (this is strictly for appearances)
  // if ($scope.diffTimeSSSS < 0) {
  //   $scope.diffTimeSSSS = $scope.diffTimeSSSS * -1;
  // }
  // // If the seconds is less than 10 append a 0
  // // ...so :09 instead of :9
  // if ($scope.diffTimeSSSS < 10) {
  //   $scope.diffTimeSSSS = '0' + $scope.diffTimeSSSS;
  // }
  // // I just flip flopped the prepended + and - because Sven
  // // and added the plus/minus appendage for bigger numbers too, like Sven's 77.
  // if ($scope.diffTimeMM < 10 && $scope.diffTimeMM > 0) {
  //   $scope.diffTimeMM = '+0' + $scope.diffTimeMM;
  // }
  // if ($scope.diffTimeMM > 10) {
  //   $scope.diffTimeMM = '+' + $scope.diffTimeMM;
  // }

  // if ($scope.diffTimeMM > -10 && $scope.diffTimeMM < 0) {
  //   $scope.diffTimeMM = '-0' + (-1*$scope.diffTimeMM);
  // }
  // if ($scope.diffTimeMM < -10 ) {
  //   $scope.diffTimeMM = '-' + (-1*$scope.diffTimeMM);
  // }

  // Difference btw mean solar and clock.
  function diffMeanClock (longitude, dst) {
    var dayLightTime = dst ? 3600 : 0;
    var epoc = new Date().getTimezoneOffset() * 60 + dayLightTime;
    epoc = epoc * -1;
    var meanEpoc = longitude * (86400 / 360);
    var diffTime = meanEpoc - epoc;
    return diffTime;
  }

  // Get cardinal day (1-366).
  // http://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
  function cardinalDay () {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var cDay = Math.floor(diff / oneDay); // Cardinal day.
    return cDay;
  }

  // Dat EOT.
  ////////////////////////////////////
  function equationOfTime () {
    // Get pi.
    var pi = Math.PI;
    var twopi = 2*pi;

    // W = 360/365.24 = the Earth's mean angular orbital velocity in degrees per day
     // in degrees; a constant ratio
    var W = 360/365.24;


    // var now = new Date();
    // var start = new Date(now.getFullYear(), 0, 0);
    // var diff = now - start;
    // var oneDay = 1000 * 60 * 60 * 24;
    // Cardinal day.
    var DDaze = cardinalDay(); // <-- moved to helper ^

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
    return datEOTSeconds;
  }

  // Mean local solar time.
  ////////////////////////////////////
  function getMeanSolar (longitude, dst) {
    var dst = dst;
    var lon = longitude;
    var meanTime = new Date(new Date().valueOf() + diffMeanClock(lon, dst) * 1000); // Mean solar time by clock diff.
    return meanTime; // <-- typeof === date
  }

  // True Solar Time.
  ////////////////////////////////////
  function getTrueSolar (longitude, dst) {
    var dst = dst;
    var lon = longitude;
    var trueTime = new Date(new Date().valueOf() + diffMeanClock(lon, dst) * 1000 - equationOfTime() * 1000);
    return trueTime; // <-- typeof === date
  }

  return {
    getMeanSolar: getMeanSolar,
    getTrueSolar: getTrueSolar,
    cardinalDay: cardinalDay,
    equationOfTime: equationOfTime,
    diffMeanClock: diffMeanClock,
    diffTrueClock: diffTrueClock,
    formatEOT: formatEOT
  };

});
