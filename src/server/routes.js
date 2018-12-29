var express=require('express')
var router=express.Router()

router.route('/(*)?').get(
  express.static('public'/*, {index: 'index.html'}*/)
)

module.exports = router
