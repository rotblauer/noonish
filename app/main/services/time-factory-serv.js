'use strict';
angular.module('main')
.factory('TimeFactory', function ($log, $http, $q) {

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

  // Get cardinal day (1-366).
  // http://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366

  // unit -> day
  function cardinalDay () {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var cDay = Math.floor(diff / oneDay); // Cardinal day.
    return cDay;
  }

  function cardinalDayWithFraction () {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var cDay = diff / oneDay; // Cardinal day.
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
    var DDaze = cardinalDayWithFraction(); // <-- moved to helper ^ // cardinalDay

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

  // ////////////////////////////////////
  // // Format true solar <-> clock diff.
  // ////////////////////////////////////

  // Difference btw mean solar and clock.
  // => compares timezone offset to mean local
  // function differ (latitude, longitude, rawOffset, dstOffset) {
  //   var epoc = rawOffset + dstOffset;
  //   var meanEpoc = longitude * (86400 / 360);
  //   var daDiffMeanClock = meanEpoc - epoc; // returner
  //   var daDiffTrueClock = daDiffMeanClock - equationOfTime();
  //   var diffs = {
  //     meanVclock: daDiffMeanClock,
  //     trueVclock: daDiffTrueClock
  //   };
  // }

  // // Mean local solar time.
  // ////////////////////////////////////
  // function getMeanSolar (longitude, dst) {
  //   // get users time and timezoneoffset
  //   // find GMT
  //   var dst = dst;
  //   var lon = longitude;
  //   var meanTime = new Date(new Date().valueOf() + diffMeanClock(lon, dst) * 1000); // Mean solar time by clock diff.
  //   return meanTime; // <-- typeof === date
  // }

  // // True Solar Time.
  // ////////////////////////////////////
  // function getTrueSolar (longitude, dst) {
  //   var dst = dst;
  //   var lon = longitude;
  //   var trueTime = new Date(new Date().valueOf() + diffMeanClock(lon, dst) * 1000 - equationOfTime() * 1000);
  //   return trueTime; // <-- typeof === date
  // }
  //
  function allTheTimes (latitude, longitude, rawOffset, dstOffset, eotOffset) {

    // diffs
    var meanEpoc, daDiffMeanClock, daDiffTrueClock,
        eotOffset = eotOffset * 60; // cuz it's their an in fractions of a minute; ours is in seconds


    // if over land, where apparently time zones exist
    if ( typeof rawOffset !== 'undefined' ) {
      var epoc = rawOffset + dstOffset;
      meanEpoc = longitude * (86400 / 360); // seconds in a day divided by 360 degrees
      daDiffMeanClock = meanEpoc - epoc; // diff mean time -> longitude ratio :: timezone
      daDiffTrueClock = daDiffMeanClock - eotOffset; // " minus eot
    }
    // else at sea, where the time is just the exact time.
    // should return mean local time without 'epoc', which is essentially man-made time chunker
    // ie diffMean => 0, diffTrue => eot
    else {
      meanEpoc = longitude * (86400 / 360);
      daDiffMeanClock = meanEpoc - meanEpoc; // 0
      daDiffTrueClock = daDiffMeanClock - eotOffset;
    }

      var diffs = {
        meanVclock: daDiffMeanClock, // seconds
        trueVclock: daDiffTrueClock // seconds
      };

    // times
    // get system time
    var localSystemTime = new Date().valueOf(); // assume their system clock is accurate to the time zone. iphono
    var localSystemTimezone = new Date().getTimezoneOffset().valueOf() * 60 ; // seconds
    // get GMTtime
    var GMTtime = new Date(localSystemTime + localSystemTimezone * 1000); //
    // set clocktime
    // if inhabited timezone
    if ( typeof rawOffset !== 'undefined' ) { // if over land
      var localTimeAnywhere = new Date(GMTtime.valueOf() + ((rawOffset + dstOffset) * 1000));
    }
    // else judge time by the sun, as men do
    else {
      var localTimeAnywhere = new Date(GMTtime.valueOf() + (meanEpoc * 1000));
    }

    // calculate mean and true time from clocktime
    var meanTimeThere = new Date(localTimeAnywhere.valueOf() + diffs.meanVclock * 1000); // typeof === Date
    var trueTimeThere = new Date(localTimeAnywhere.valueOf() + diffs.trueVclock * 1000); // "

      var times = {
        localTime: localTimeAnywhere,
        meanTime: meanTimeThere,
        trueTime: trueTimeThere
      };

    return { diffs: diffs, times: times };
  }

  // ! THIS ONLY WORKS FOR OVER LAND, NOT OVER WATER. apparently google thinks there are no time zones at sea.
  function getLocalTimeZoneGoogle (latitude, longitude) {
    var defer = $q.defer();
    var timestamp = Date.now() / 1000 | 0
    var url = 'https://maps.googleapis.com/maps/api/timezone/json?location='+latitude+','+longitude+'&timestamp='+ timestamp +'&key=AIzaSyAetPBe1Frt6VMbMkfVdannWrZmpDcaTos';
    $http({ method: 'GET', url: url })
      .success(function (data, status, headers, config) {
        defer.resolve({data: data});
      })
      .error(function (data, status, headers, config) {
        defer.reject({error: 'Timezone not got.'});
      });
    return defer.promise;
  }

  return {
    // getMeanSolar: getMeanSolar,
    // getTrueSolar: getTrueSolar,
    cardinalDay: cardinalDay,
    equationOfTime: equationOfTime,
    // diffMeanClock: diffMeanClock,
    // diffTrueClock: diffTrueClock,
    formatEOT: formatEOT,
    getLocalTimeZoneGoogle: getLocalTimeZoneGoogle,
    allTheTimes: allTheTimes
  };

});
