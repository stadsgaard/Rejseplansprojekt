const axios = require("axios");
const moment = require("moment");

function loop() {
  console.clear();
  console.log("-----");

  axios
    .get(
      //"http://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=8600626&format=json",
      "http://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=8600626&format=json"
    )
    .then(res => {
      let arr = res.data.MultiDepartureBoard.Departure || [];
      //console.log(arr);
      //console.log(arr.length);

      let filtered = arr.filter(e => "rtTime" in e);

      //console.log(filtered.length);

      filtered.forEach(e => {
        //let fakeTime = "23:12";
        //let fakeRtTime = "00:59";

        // Change to e.time and e.rtTime
        //let timeParsed = moment(fakeTime, "HH:mm");
        //let rtTimeParsed = moment(fakeRtTime, "HH:mm");

        let timeParsed = moment(e.time, "HH:mm");
        let rtTimeParsed = moment(e.rtTime, "HH:mm");

        let timeDiff = moment(rtTimeParsed - timeParsed);

        let diffMinutes = moment.duration(timeDiff.format("HH:mm")).asMinutes();

        //console.log(`Time: ${timeParsed}`);
        //console.log(`rtTIme: ${rtTimeParsed}`);
        console.log(`Time diff: ${diffMinutes}`);
      });

      setTimeout(loop, 4000);
    });
}

loop();
