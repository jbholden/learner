exports.get = function(req, res){
  var toplevel_model = res.locals.models.top_level;

  toplevel_model.findAll().complete(show_page);

  function show_page(err,data) {
      if (err) {
          console.log('Could not retrieve the top-level models');
          return
      }
      res.render('main',{data:data});
  }
};
