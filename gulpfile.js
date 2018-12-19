var gulp = require('gulp')
var exec = require('child_process').exec
var spawn = require('child_process').spawn;
var ps = require('ps-node')


gulp.task('default', defaultTask)
gulp.task('restartServer', restartServer)
gulp.task('killServer', killServer)
gulp.task('startServer', startServer)
gulp.task('reloadGulpfile',reloadGulpfile)

function defaultTask(done){
  console.log('default task running')
  //gulp.watch('*.js', restartServer)
  gulp.watch('*.js', gulp.series('killServer', 'startServer'))
  reloadGulpfile()
  console.log('default task end')
}
 
function killServer(cb){
  var killServerFunction = function(resolve, reject){
    console.log('inside killServerFunction')
      ps.lookup(
        {command: 'node', arguments: 'index'},
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

function startServer(cb){
  console.log('inside startServer')
  spawn(
    'node',
    ['index']
  )
  cb()
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
  console.log('middle of restartServer')
  startServer()
  console.log('end of restartServer')
//  gulp.series(killServer, startServer)
}

function reloadGulpfile() {
  var p;

  gulp.watch('gulpfile.js', makeAnotherGulp);

  function makeAnotherGulp(e) {
    // `spawn` a child `gulp` process linked to the parent `stdio`
    p = spawn('gulp', [], {stdio: 'inherit'});
    process.exit()
  }
}

function killParent(){

}

exports.default = defaultTask