exports.get = function(req, res){
  var toplevel_model = res.locals.models.top_level;
  var topic_model = res.locals.models.topic;
  var toplevel_id = parseInt(req.params.id);

  toplevel_model.find({where:{id:toplevel_id}}).complete(get_topics);

  function get_topics(err, toplevel) {
      if (err) {
          console.log('Could not find the top-level ' + toplevel_id);
          return
      }
      /*var topics = null;
      if (toplevel.topics != null && toplevel.topics.length > 0) {
        topic_model.find({where:{id:toplevel.topics}}).complete(show_page);
      }*/
      res.render('top_level',{toplevel:toplevel,topics:null});
  }
};
