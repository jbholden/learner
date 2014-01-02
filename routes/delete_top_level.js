exports.get = function(req, res){
  var toplevel_model = res.locals.models.top_level;
  var toplevel_id = parseInt(req.params.id);

  toplevel_model.find({where:{id:toplevel_id}}).complete(show_confirmation_page);

  function show_confirmation_page(err,data) {
      if (err) {
          console.log('Could not find the top-level ' + toplevel_id);
          return
      }
      res.render('delete_top_level',{data:data});
  }
};

exports.post = function(req, res){
   // cancel button pressed
   if (req.body.hasOwnProperty('cancel_form')) {
      res.redirect('/');
      return;
   }

   // don't know what happened, delete button should have been pressed
   if (req.body.hasOwnProperty('delete_form') == false) {
      res.redirect('/');
      return;
   }

   var toplevel_model = res.locals.models.top_level;
   var toplevel_id = parseInt(req.params.id);

   toplevel_model.destroy({id:toplevel_id}).complete(redirect_to_main_page);

   function redirect_to_main_page(err) {
      if (err) {
          console.log('Could not find the top-level ' + toplevel_id);
          return
      }
      res.redirect('/');
   }
};
