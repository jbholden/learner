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
          res.render('top_level',{toplevel:toplevel,no_topics:true});
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
          topics_no_subtopics = get_topics_with_no_subtopics(topics);
          topics_with_subtopics = get_topics_with_subtopics(topics);
          res.render('top_level',{toplevel:toplevel,no_topics:false,topics_no_subtopics:topics_no_subtopics,topics_with_subtopics:topics_with_subtopics});
      }
  }
};

function sort_by_id(a,b) {
    if (a.id == b.id) { return 0; }
    return a.id < b.id? -1 : 1;
}

function get_topics_with_no_subtopics(topics) {
    var topics_list = new Array();
    for (var i=0; i < topics.length; i++) {
        var no_subtopics = topics[i].sub_topics == null || topics[i].sub_topics.length == 0;
        if (no_subtopics) {
            topics_list.push(topics[i]);
        }
    }
    if (topics_list.length == 0) {
        return null;
    }
    return topics_list.sort(sort_by_id);
}

function get_topics_with_subtopics(topics) {
    var topics_list = new Array();
    for (var i=0; i < topics.length; i++) {
        var has_subtopics = topics[i].sub_topics != null &&topics[i].sub_topics.length > 0;
        if (has_subtopics) {
            topics_list.push(topics[i]);
        }
    }
    if (topics_list.length == 0) {
        return null;
    }
    return topics_list.sort(sort_by_id);
}
