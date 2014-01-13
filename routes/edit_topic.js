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
            var review_text = format_review_dates(topic.reviews);
            res.render('edit_topic',{toplevel:toplevel,topic:topic,topic_reviews:review_text});
        }
    }
}

exports.post = function(req, res){

    var topic_model = res.locals.models.topic;
    var topic_id = parseInt(req.params.id);


    // cancel button pressed
    if (req.body.hasOwnProperty('cancel_form')) {
        if (!number_type_error(topic_id)) {
            res.redirect("/topic/"+topic_id+"/page");
            return;
        }
        res.redirect('/');
        return;
    }

    // don't know what happened, submit button should have been pressed
    if (req.body.hasOwnProperty('submit_form') == false) {
        console.log("Error:  submit was not pressed");
        res.redirect('/');
        return;
    }

    topic_model.find({where:{id:topic_id}}).complete(save_changes);

    function save_changes(err,topic) {
        if (err) {
            console.log("error retrieving topic " + topic_id + " object for editing: " + err);
            res.status(400);
            res.send();
            return;
        }

        var params_to_save = new Array();

        if (req.body.hasOwnProperty('title_input')) {
            var topic_title = req.body['title_input'];     
            if (input_blank(topic_title)) {
                console.log("the title field should not be blank");
                res.status(400);
                res.send();
                return;
            }
            topic.title = topic_title;
            params_to_save.push('title');
        }

        if (req.body.hasOwnProperty('understood_input')) {
            var understood = req.body['understood_input'];     
            if (input_blank(understood)) {
                console.log("the understood field should not be blank");
                res.status(400);
                res.send();
                return;
            }
            if (!understood_valid(understood)) {
                console.log("the understood field should be a number in the range 0.0-100.0");
                res.status(400);
                res.send();
                return;
            }
            topic.understood = parseFloat(understood);
            params_to_save.push('understood');
        }

        if (req.body.hasOwnProperty('reviews')) {
            var reviews = req.body['reviews'];     
            if (input_blank(understood)) {
                topic.reviews = []
            } else {
                review_dates = get_review_dates(reviews);
                if (review_dates == null || review_dates.length == 0) {
                    topic.reviews = []
                } else {
                    topic.reviews = review_dates;
                }
            }
            params_to_save.push('reviews');
        }

        if (req.body.hasOwnProperty('toplevel_input')) {
            var toplevel_id_str = req.body['toplevel_input'];     
            if (input_blank(toplevel_id_str)) {
                console.log("the toplevel id field should not be blank");
                res.status(400);
                res.send();
                return;
            }
            var toplevel_id = parseInt(toplevel_id_str);
            if (number_type_error(toplevel_id)) {
                console.log("the toplevel_id field should be a number");
                res.status(400);
                res.send();
                return;
            }
            topic.toplevel = toplevel_id;
            params_to_save.push('toplevel');
        }

        if (req.body.hasOwnProperty('parent_topic_input')) {
            var parent_topic = req.body['parent_topic_input'];     
            if (input_blank(parent_topic) || parent_topic.toLowerCase() == "null") {
                topic.parent_topic = null;
                params_to_save.push('parent_topic');
            } else {
                var parent_topic_int = parseInt(parent_topic);
                if (number_type_error(parent_topic_int)) {
                    console.log("the parent_topic field should be single number");
                    res.status(400);
                    res.send();
                    return;
                }
                topic.parent_topic = parent_topic_int;
            }
        }

        if (req.body.hasOwnProperty('subtopics_input')) {
            var subtopics = req.body['subtopics_input'];     
            if (input_blank(subtopics) || subtopics.toLowerCase() == "null") {
                topic.sub_topics = null;
                params_to_save.push('sub_topics');
            } else {
                var subtopic_ids = parse_integer_list_input(subtopics);
                if (subtopic_ids == null) {
                    console.log("error parsing the subtopic_id input, this should be a list of comma seperated integers");
                    res.status(400);
                    res.send();
                }
                topic.sub_topics = subtopic_ids;
                params_to_save.push('sub_topics');
            }
        }

        if (req.body.hasOwnProperty('images_input')) {
            var images = req.body['images_input'];     
            if (input_blank(images) || images.toLowerCase() == "null") {
                topic.images = null;
                params_to_save.push('images');
            } else {
                var image_ids = parse_integer_list_input(images);
                if (image_ids == null) {
                    console.log("error parsing the image ids input, this should be a list of comma seperated integers");
                    res.status(400);
                    res.send();
                }
                topic.images = image_ids;
                params_to_save.push('images');
            }
        }

        topic.save(params_to_save).complete(edit_complete);

        function edit_complete(err) {
            if (err) {
                console.log("error editing a topic object " + topic_id + ": " + err);
                res.status(400);
                res.send();
                return;
            }
            res.redirect("/topic/"+topic_id+"/page");
        }
    }
}

function number_type_error(value) {
    if (isNaN(value)) {
        return true;
    }
    return false;
}

function input_blank(value) {
    return value == null || value == "" || value.trim() == "";
}

function understood_valid(value) {
    float_val = parseFloat(value);
    if (number_type_error(float_val)) {
        return false;
    }
    return float_val >= 0.0 && float_val <= 100.0;
}
function format_review_dates(reviews) {
    if (reviews == null || reviews.length == 0) {
        return "";
    }
    var text = "";
    for (var i=0; i < reviews.length; i++) {
        var d = new Date(reviews[i]);
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var sec = d.getSeconds();
        var month_str = month < 10? "0" + month : month;
        var day_str = day < 10? "0" + day : day;
        var hour_str = hour < 10? "0" + hour : hour;
        var minute_str = minute < 10? "0" + minute : minute;
        var sec_str = sec < 10? "0" + sec : sec;
        text += month_str + "/" + day_str + "/" + d.getFullYear() + " " + hour_str + ":" + minute_str + ":" + sec_str + "\n";
    }
    return text;
}
function get_review_dates(reviews) {
    var lines = reviews.split('\n')
    var review_dates = new Array();
    for (var i=0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line == "") {
            continue;
        }
        review_dates.push(Date.parse(line));
    }
    return review_dates
}
function parse_integer_list_input(input) {
    var number_list = input.split(",");
    var numbers = new Array();
    for (var i=0; i < number_list.length; i++) {
        var value = parseInt(number_list[i].trim());
        if (number_type_error(value)) {
            console.log(value + " is not an integer");
            return null;
        }
        numbers.push(value);
    }
    return numbers;
}
