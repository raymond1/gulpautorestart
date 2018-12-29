var gulp = require('gulp')
var exec = require('child_process').exec
var execFile = require('child_process').execFile
var spawn = require('child_process').spawn;
var ps = require('ps-node')


async function defaultTask(done){
  var date = new Date()
  console.log('default task running A ' + date.toString())
  //Kill a preexisting gulp task if it exists
  killExistingGulpProcess()

  await startServer()
  console.log('default task Just before done')

  //restarts the node server upon js file changes inside the src directory
  gulp.watch('src/server/**/*.js', gulp.series(babel, restartServer))
  gulp.watch('src/client/copied/**/*', copyfiles)
  gulp.watch("gulpfile\.js/**/*.js", reloadGulpfile)

  done()
}

function killExistingGulpProcess(){
  ps.lookup
  (
    {
      command: 'gulp'
    },
    function (err, resultList){
      if (!resultList || resultList.length == 0){
      }else{
        for (var i = 0; i < resultList.length; i++){
          if (resultList[i].pid != process.pid){
            console.log('killing gulp process ' + resultList[i].pid)
            exec(
              'kill ' + resultList[i].pid,
              function (error, stdout, stderr) {
                console.log('node server killed, pid ' + pid)
              }
            )
          }
        }
      }
    }
  )
}

//This function starts the node server if it hasn't been started already
function startServer(){
  console.log('startServer start')
  return new Promise(
    (resolve,reject) =>
    {
      ps.lookup
      (
        {
          command: 'node'
        },
        function (err, resultList){
          if (!resultList || resultList.length == 0){
            console.log('inside startServer')
            execFile(
              'node',
              ['src/server/index'],
              function (error, stdout, stderr) {
                console.log('node index command finished running')
              }
            )
          }else{
            console.log('resultlist is empty inside startServer')
          }
          console.log('startServer end')
          resolve()
        }
      )
    }
  )
}

//This function kills the node server and the gulp server if they are running
function shutdownTask(done){
  console.log('Shutting down the node server and the gulp server')
  //kill the node server
  ps.lookup(
    {
      command: 'node'
    },
    function(err, resultList){
      if (resultList && resultList.length > 0){
        console.log('killing node server')
        var pid = resultList[0].pid
          exec(
            'kill ' + pid,
            function (error, stdout, stderr) {
              console.log('node server killed, pid ' + pid)
            }
          )
      }else{
        console.log('node server not running')
      }
    }
  )

  //kill the gulp server
  ps.lookup(
    {
      command: 'gulp'
    },
    function(err, resultList){
      if (resultList && resultList.length == 0){
        console.log('killing gulp server')
        var pid = resultList[0].pid
        exec(
          'kill ' + pid,
          function (error, stdout, stderr) {
            console.log('gulp server terminated')
            console.log('This line should never run as the gulp process should have been killed')
          }
        )
      }else{
        console.log('gulp server not running')
      }
    }
  )
}


async function restartServer(done){
  console.log('start of restartServer')
  await killServer()
  console.log('middle of restartServer')
  startServer()
  console.log('end of restartServer')
  done()
}


//This function creates a new gulp process. The gulpfile will kill the old process
function reloadGulpfile() {
  console.log('reloading gulpfile')
  spawn('gulp', [], {stdio: 'inherit'});
  console.log('exiting')
  process.exit()
}



function watchFileChanges(callback){
  console.log('watchFileChanges start')
  console.log('watchFileChanges end')
  callback()
}


//kills the node process if it has been started already 
function killServer(cb){
  var killServerFunction = function(resolve, reject){
    console.log('inside killServerFunction')
      ps.lookup(
        {command: 'node'},
        function(err,resultList){
          console.log('callback after ps lookup function')
          console.log('resultList is:' + JSON.stringify(resultList))
          if (resultList && resultList.length > 0){
            console.log(`JSON.stringify is: |${JSON.stringify(resultList)}|`)
            var pid = resultList[0].pid
            exec(
              'kill ' + pid,
              function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                  console.log('exec error: ' + error);
                }
                resolve()
              }
            )
          }else{
            resolve()
          }
        }
      )
    }

  return new Promise(killServerFunction)
}

function babel(callback){
  console.log('spawning babel command')
  spawn(
    './node_modules/.bin/babel',
    ['src/client/compiled', '--out-dir', 'public']
    )
  callback()
}

//copies files from the src/client directory into the public directory
function copyfiles(callback){
  gulp.src('./src/client/copied/**/*').pipe(gulp.dest('./public'))
  callback()
}

exports.default = defaultTask
exports.shutdown = shutdownTask