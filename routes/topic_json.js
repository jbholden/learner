exports.get = function(req, res){
    var topic_model = res.locals.models.topic;
    var topic_id = parseInt(req.params.id);

    topic_model.find({where:{id:topic_id}}).complete(return_topic_json);

    function return_topic_json(err,topic) {
        if (err) {
            console.log("Error retriving the topic" + topic_id + ": " + err);
            res.status(400);
            res.send();
            return
        }

        res.set("Content-Type","application/json");
        res.status(200);
        res.send(JSON.stringify(topic));
    }
}
