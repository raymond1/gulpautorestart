var gulp = require('gulp')
var exec = require('child_process').exec
var ps = require('ps-node')


gulp.task('default', defaultTask)
gulp.task('restartServer', restartServer)
gulp.task('killServer', killServer)
gulp.task('startServer', startServer)

function defaultTask(done){
  console.log('default task running')
  gulp.watch('*.js', restartServer)
  console.log('default task end')
}

function killServer(cb){
  return new Promise(
    function(resolve, reject){
      ps.lookup(
        {command: 'node', arguments: 'index'},
        function(err,resultList){
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
        }
      )
    }
  )
}

function startServer(cb){
  return new Promise(
    function(resolve,reject){
      exec(
        'node index',
        (error, stdout, stderr) => {
          resolve()
        }
      )
    }
  )
}
/*
async function test2(){
  return new Promise(
    function(resolve,reject){
      setTimeout(resolve, 10000)
    }
  )
}*/

async function restartServer(done){
  console.log('start of restartServer')
  await killServer()
  await startServer()
  console.log('end of restartServer')
//  gulp.series(killServer, startServer)
}

exports.default = defaultTask