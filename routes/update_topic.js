exports.post = function(req, res){

    var topic_id = parseInt(req.params.id);
    var data = get_param(req,'data');

    if (topic_id == null || data == null) {
        console.log("The topic id and data parameters are required");
        res.status(400);
        res.send();
    }

    if (int_type_error(topic_id)) {
        console.log("The topic id must be an integer.");
        res.status(400);
        res.send();
    }
    
    var topic_model = res.locals.models.topic;
    topic_model.find({where:{id:topic_id}}).complete(update_topic);

    function update_topic(err,topic) {
        if (err) {
            console.log('Could not find the topic with id ' + topic_id);
            res.status(400);
            res.send();
            return
        }
        var properties = new Array();
        if (data.hasOwnProperty("understood")) {
            properties.push("understood");
            topic.understood = data.understood;
        }
        if (data.hasOwnProperty("reviews")) {
            properties.push("reviews");
            var review_date = Date.now();
            if (topic.reviews == null) {
                topic.reviews = new Array();
            }
            topic.reviews.push(review_date);
        }
        topic.save(properties).complete(function(err) {
            if (err) {
                console.log("Error saving topic with updated values: " + err);
                res.status(400);
                res.send();
                return
            }
            res.status(200);
            res.send();
            return;
        });
    }
}

function get_param(req,param) {
    if (req.body.hasOwnProperty(param)) {
        return req.body[param];     
    }
    return null;
}
function int_type_error(value) {
    if (isNaN(value)) {
        return true;
    }
    return false;
}
function get_current_utc_time() {
    var d = new Date(Date.now());
    var year = d.getUTCFullYear();
    var month = d.getUTCMonth();
    var day = d.getUTCDate();
    var hour = d.getUTCHours();
    var min = d.getUTCMinutes();
    var sec = d.getUTCSeconds();

    var month_str = month < 10? "0" + month : ""+month;
    var day_str = day < 10? "0" + day : ""+day ;
    var hour_str = hour < 10? "0" + hour : ""+hour ;
    var min_str = min < 10? "0" + min : ""+min ;
    var sec_str = sec < 10? "0" + sec : ""+sec ;

    var time_str = year + "-" + month_str + "-" + day_str + " ";
    time_str += hour_str + ":" + min_str + ":" + sec_str + "+00";
    return time_str;
}
