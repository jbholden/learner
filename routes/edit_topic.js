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
        toplevel_model.find({where:{id:topic.toplevel}}).complete(show_edit_page);

        function show_edit_page(err,toplevel) {
            if (err) {
                console.log("Error retriving the topic toplevel " + topic.toplevel + ": " + err);
                res.status(400);
                res.send();
                return
            }
            res.render('edit_topic',{toplevel:toplevel,topic:topic});
        }
    }
}
