var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */
router.get('/', function(req, res, next) {
    axios.get('https://api.typeform.com/forms/eaj1sU/responses?completed=true&page_size=1000',{ headers: { Authorization: 'Bearer Hr3EEcXr52zkTRHrS4N2mTRk4SAZLAd3VwUnsoNbDCK9', "Access-Control-Allow-Origin": "*"} }).then(d => {
        console.log(d)
        res.json(d.data);
    })
});

module.exports = router;
