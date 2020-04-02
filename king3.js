const axios = require("axios");
const moment = require("moment");
const maxApi = require("max-api");


maxApi.addHandler("King", () => {
const XMLOPEN_URL = "http://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=8600646&format=json";
const INTERVAL = 4000;

function looper(fn, interval) {
  interval = interval || DEFAULT_INTERVAL;
  const loop = function () {
    fn()
      .then(() => {
        setTimeout(loop, interval);
      })
  }
  return loop;
}

function fetchAndProcessTrainData(URL) {
  return axios
    .get(URL)
    .then(({ data }) => {
      //Handling error in case of data is not available
      const arr = ((data || {}).MultiDepartureBoard || {}).Departure || [];
      return arr.filter(e => {
        if (!e.rtTime) {
          return false;
        }
        let timeParsed = moment(e.time, "HH:mm");
        let rtTimeParsed = moment(e.rtTime, "HH:mm");
        let timeDiff = rtTimeParsed.diff(timeParsed, 'minutes');
        e.timeDiff = timeDiff;
        return true;
      });

    })
    .catch(e => {
      throw e;
    })
}

const loopFunction = looper(() => {
  console.clear();
  console.log('---------------');
  return fetchAndProcessTrainData(XMLOPEN_URL)
    .then((data) => {
      data.forEach(element => {
        console.log(element.timeDiff);
         maxApi.outlet(element.timeDiff);
        maxApi.post(element.timeDiff);
      });
    })
    .catch((err) => {
      // console.error(`Error: ${err.message}`);
      return err;
    })
}, INTERVAL);

loopFunction();
});
