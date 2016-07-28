'use strict';

let Wit = null;
try {
  // if running from repo
  Wit = require('../').Wit;
} catch (e) {
  Wit = require('node-wit').Wit;
}

// const accessToken = (() => {
//   if (process.argv.length !== 3) {
//     console.log('usage: node examples/quickstart.js <wit-access-token>');
//     process.exit(1);
//   }
//   return process.argv[2];
// })();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

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
    console.log('sending...', JSON.stringify(response));
    return Promise.resolve();
  },
  getForecast({context, entities}) {
    console.log('im here');
    return new Promise(function(resolve, reject) {
      var location = firstEntityValue(entities, 'location')
      context.forecast = 'sunny in ' + location; // we should call a weather API here
      return resolve(context);
    });
  },
};

const client = new Wit({accessToken: '7QME7JWGVXF2D6R6TKR54ACHMMVARTKL', actions});
const sessionId = 'testingland';
client.runActions(sessionId, 'How is the weather in London?', {})
.then((context1) => {
  console.log('The session state is now: ' + JSON.stringify(context1));
  //**no reply for some reason, check wit.js search for runActions and play with continueActions
})
.catch((e) => {
  console.log('Oops! Got an error: ' + e);
});