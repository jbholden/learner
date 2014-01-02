exports.post = function(req, res){
   var topic_title = req.body['title'];
   var toplevel_id = req.body['toplevel'];
   var parent_topic_id = req.body['parent_topic'];

   // TODO:  parseInt error handling

   var topic_model = res.locals.models.topic;
   var topic = topic_model.build({ title:topic_title, toplevel:parseInt(toplevel_id), understood:0.0});
   //var topic = topic_model.build({ title:topic_title, toplevel:parseInt(toplevel_id), understood:0.0, parent_topic:parent_topic_id});

   var fields_to_save = null;
   if (parent_topic_id == null) {
       fields_to_save = ['title','toplevel','understood'];
   } else {
       fields_to_save = ['title','toplevel','understood', 'parent_topic'];
   }

   topic.save(fields_to_save).complete(function(err) {
       if (err) {
         console.log("error creating a new topic object: " + err);
         res.status(400);
         res.send();
       } else {
         res.status(200);
         res.send();
       }
   });
}
