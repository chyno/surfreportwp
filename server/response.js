var R = require('ramda');

var response = {
   
   renderParamRequest : R.curry((fun, req, res) => {

  if(!req.params.id)
        { throw ("no parameter");}
        
        fun(req.params.id).then((x) => {
             res.json(x);  
        }, (err) => {
            res.status(500).send('Error' + err);
        });
}),

renderRequest : R.curry((fun, req, res) => {
  fun().then((x) => {
             res.json(x);  
        }, (err) => {
            res.status(500).send('Error' + err);
        });
}),

 handlePost  : R.curry((fun, req, res) => {
    var body = req.body;
       fun(body).then((x) => {
             res.json(x);  
        }, (err) => {
            res.status(500).send('Error' + err);
        });
})

};

module.exports = response;
