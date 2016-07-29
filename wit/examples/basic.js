'use strict';

let Wit = null;
let log = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  log = require('../').log;
} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
}

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      // console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  getForecast({context, entities}) {
    return new Promise(function(resolve, reject) {
      var location = firstEntityValue(entities, 'location')
      if (location) {
        context.forecast = 'sunny in ' + location; // we should call a weather API here
        delete context.missingLocation;
      } else {
        context.missingLocation = true;
        delete context.forecast;
      }
      return resolve(context);
    });
  },
};

const logger = new log.Logger(log.DEBUG);

const sessionId = require('node-uuid').v1();
const context0 = {};
// const client = new Wit({accessToken: 'A6IWPIVFV5EPHNFSMKVY6QDVBE3KBT55', actions, logger})
const client = new Wit({accessToken: 'A6IWPIVFV5EPHNFSMKVY6QDVBE3KBT55', actions})
exports.runActions = (msg) => {
  return client.runActions(sessionId, msg, context0)
  .then((context1) => {
    // console.log(JSON.stringify(context1, null, 2))
    return context1;
  })
  .catch((e) => {
    console.log('Oops! Got an error: ' + e);
  });
}; 
// client.runActions(sessionId, 'Whats the weather in New York', context0)
// .then((context1) => {
  // return JSON.stringify(context1, null, 2);

// })
// .then((context2) => {
  // console.log('The session state is now: ' + JSON.stringify(context2, null, 2));
// })
// .catch((e) => {
//   console.log('Oops! Got an error: ' + e);
// });
