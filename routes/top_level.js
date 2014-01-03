exports.get = function(req, res){
  var toplevel_model = res.locals.models.top_level;
  var topic_model = res.locals.models.topic;
  var toplevel_id = parseInt(req.params.id);

  toplevel_model.find({where:{id:toplevel_id}}).complete(get_topics);

  function get_topics(err, toplevel) {
      if (err) {
          console.log('Could not find the top-level ' + toplevel_id);
          res.status(400);
          res.send();
          return
      }

      var topics = null;
      var no_topics = toplevel.topics == null || toplevel.topics.length == 0;

      if (no_topics) {
          res.render('top_level',{toplevel:toplevel,topics:null});
          return;
      }

      topic_model.findAll({where:{id:toplevel.topics}}).complete(show_page_with_topics);

      function show_page_with_topics(err,topics) {
          if (err) {
              console.log('Error retriving the topics: ' + err);
              res.status(400);
              res.send();
              return
          }
          res.render('top_level',{toplevel:toplevel,topics:topics});
      }
  }
};
