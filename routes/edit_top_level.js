exports.get = function(req, res){
  var toplevel_model = res.locals.models.top_level;
  var toplevel_id = parseInt(req.params.id);

  toplevel_model.find({where:{id:toplevel_id}}).complete(show_edit_page);

  function show_edit_page(err,data) {
      if (err) {
          console.log('Could not find the top-level ' + toplevel_id);
          return
      }
      res.render('edit_top_level',{data:data});
  }
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

   var toplevel_model = res.locals.models.top_level;
   var toplevel_id = parseInt(req.params.id);

   var toplevel_type = req.body['type_input']
   var toplevel_name = req.body['name_input']
   var toplevel_understood = req.body['understood_input']

   if (toplevel_type == "" || toplevel_name == "" || toplevel_understood == "") {
       res.redirect('/toplevel/'+toplevel_id+'/edit');
       return;
   }

   var toplevel_understood_float = get_understood_percent(toplevel_understood);
   if (toplevel_understood_float == null) {
         res.redirect('/toplevel/'+toplevel_id+'/edit');
         return;
   }

   toplevel_model.find({where:{id:toplevel_id}}).complete(save_changes);

   function save_changes(err,toplevel) {
       if (err) {
         console.log("error retrieving a toplevel object for editing: " + err);
         return;
       }
       toplevel.type = toplevel_type;
       toplevel.name = toplevel_name;
       toplevel.understood = toplevel_understood_float;

       toplevel.save(['name','type','understood']).complete(edit_complete);

       function edit_complete(err) {
         if (err) {
            console.log("error editing a toplevel object: " + err);
         } else {
            res.redirect('/');
         }
       }
   }
}

function get_understood_percent(understood_str,toplevel_id) {
   var understood = parseFloat(understood_str);
   var not_a_float = isNaN(understood);
   if (not_a_float) {
         console.log("The understood % is not a float: " + understood_str);
         return null;
   }
   var valid_percent = understood >= 0.0 && understood <= 100.0;
   if (!valid_percent) {
       return null;
   }
   return understood;
}
