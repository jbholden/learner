exports.get = function(req, res){
  res.render('new_top_level');
};

exports.post = function(req, res){

   // cancel button pressed
   if (req.body.hasOwnProperty('cancel_form')) {
      res.redirect('/');
      return;
   }

   // don't know what happened, submit button should have been pressed
   if (req.body.hasOwnProperty('submit_form') == false) {
      res.redirect('/');
      return;
   }

   var toplevel_type = req.body['type_input']
   var toplevel_name = req.body['name_input']

   if (toplevel_type == "" || toplevel_name == "") {
       res.redirect('/toplevel/new');
       return;
   }

   var toplevel_model = res.locals.models.top_level;

   var toplevel = toplevel_model.build({ name:toplevel_name, type:toplevel_type, understood:0.0});

   toplevel.save(['name','type','understood']).complete(function(err) {
       if (err) {
         console.log("error creating a new toplevel object: " + err);
       } else {
        res.redirect('/');
       }
   });

}
