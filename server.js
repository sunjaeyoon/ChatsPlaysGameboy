var http = require('http'),
    ecstatic = require('ecstatic'),
    Router = require('./router');
  
const {spawn} = require('child_process')

var fileServer = ecstatic({root: './public'});
var router = new Router;
const port = 8080
http.createServer((request, response) => {
  if (!router.resolve(request, response)) {
    fileServer(request, response);
  }
}).listen(port, () => {
  console.log(`Server listening on port ${port}`)
});

var messages = []
var max_flush = 1000

	
var dir = {'a': 'a', 'b': 'b', 
	'right':'right', 'left':'left',
	'up':'up','down':'down', 
	'start':'s', 'select':'e'}

function runScript(key){
	return spawn('python3', ['keys.py', key])
}

function respond(response, status, data, type) {
  response.writeHead(status, {'Content-Type': type || 'text/plain'})
  response.end(data)
}
function respondJSON(response, status, data) {
  respond(response, status, JSON.stringify(data),
          {'Content-Type': 'application/json'})
}

router.add('GET', /^\/chat$/, (request, response) => {
  // respondJSON(response, 200, {messages: messages})
  var query = require('url').parse(request.url, true).query
  if (query.num) {
    var num = Number(query.num)
    if (messages[num]) {
      respondJSON(response, 200, {message: messages[num]})
    } else {
      waitForNewMessage(num, response)
    }

  } else {
    respond(response, 400, 'Invalid query string')
  }
})

function readStreamAsJSON(stream, callback) {
  var data = ''
  stream.on('data', chunk => {
    data += chunk
  })
  stream.on('end', () => {
    var parsedData, error
    try {
      parsedData = JSON.parse(data)
    } catch (err) {
      error = err
    }
    //console.log(parsedData)
    var direct = parsedData['content'];
    if (direct === 'a' ||
    	direct === 'b' ||
    	direct === 'right' ||
    	direct === 'left' ||
    	direct === 'up' ||
    	direct === 'down' ||
    	direct === 'start' ||
    	direct === 'select'){
    	
      console.log(direct+"\t"+parsedData['sender']);
    	//runScript(dir[direct]);
    }
    callback(error, parsedData)
  })
  stream.on('error', err => {
    callback(err)
  })
}

router.add('PUT', /^\/chat$/, (request, response) => {
  readStreamAsJSON(request, (error, message) => {
    if (error) {
      console.error(error)
      respond(response, 400, error.toString())
    } else {
      if (messages.length >= max_flush){
        messages = messages.splice(1, messages.length)
      }
      messages.push(message)
      sendMessageForWaiters(message)
      respond(response, 204, null)
    }
  })
})

function sendMessageForWaiters(message) {
  waiting.forEach((waiter) => {
    respondJSON(waiter.response, 200, {message: message})
  })
  waiting = []
}

var waiting = []
function waitForNewMessage(messageIndex, response) {
  var waiter = {messageIndex: messageIndex, response: response}
  waiting.push(waiter)
  setTimeout(() => {
    var found = waiting.indexOf(waiter)
    // because some waiters have been done
    if (found > -1) {
      waiting.splice(found, 1)
      respond(response, 204, null)
    }
  }, 60 * 1000)
}
