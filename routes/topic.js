exports.get = function(req, res){
    var topic_model = res.locals.models.topic;
    var topic_id = parseInt(req.params.id);

    topic_model.find({where:{id:topic_id}}).complete(get_topic_toplevel);

    function get_topic_toplevel(err,topic) {
        if (err) {
            console.log("Error retriving the topic " + topic_id + ": " + err);
            res.status(400);
            res.send();
            return
        }
        var toplevel_model = res.locals.models.top_level;
        toplevel_model.find({where:{id:topic.toplevel}}).complete(get_subtopics);

        function get_subtopics(err,toplevel) {
            if (err) {
                console.log("Error retriving the topic toplevel " + topic.toplevel + ": " + err);
                res.status(400);
                res.send();
                return
            }
            var no_sub_topics = topic.sub_topics == null || topic.sub_topics.length == 0;
            if (no_sub_topics) {
                res.render('topic',{toplevel:toplevel,topic:topic,no_topics:true});
                return;
            }

            topic_model.findAll({where:{id:topic.sub_topics}}).complete(show_topic_page);

            function show_topic_page(err,sub_topics) {
                if (err) {
                    console.log("Error retriving the sub topics: " + err);
                    res.status(400);
                    res.send();
                    return
                }
                topics_no_subtopics = get_topics_with_no_subtopics(sub_topics);
                topics_with_subtopics = get_topics_with_subtopics(sub_topics);
                res.render('topic',{toplevel:toplevel,topic:topic,no_topics:false,topics_no_subtopics:topics_no_subtopics,topics_with_subtopics:topics_with_subtopics});
            }
        }
    }
}

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
