exports.post = function(req, res){

    var info = get_page_parameters_and_check_for_errors(req,res);
    if (info == null) {
        return;
    }

    create_new_topic(req,res,info,update_parent);


   // TODO:  parseInt error handling

   var topic_model = res.locals.models.topic;

   var fields_to_save = null;
   var topic = null;

   topic = topic_model.build({ title:topic_title, toplevel:parseInt(toplevel_id), understood:0.0});
   fields_to_save = ['title','toplevel','understood'];
   console.log("parent_topic_id=" + parent_topic_id);
   console.log("parent_topic_id==null" + (parent_topic_id==null));
   parent_topic_id = null;

   /*if (parent_topic_id == null) {
       topic = topic_model.build({ title:topic_title, toplevel:parseInt(toplevel_id), understood:0.0});
       fields_to_save = ['title','toplevel','understood'];
   } else {
       topic = topic_model.build({ title:topic_title, toplevel:parseInt(toplevel_id), understood:0.0, parent_topic:parseInt(parent_topic_id)});
       fields_to_save = ['title','toplevel','understood', 'parent_topic'];
   }*/

   topic.save(fields_to_save).complete(function(err,new_topic) {
       if (err) {
         console.log("error creating a new topic object: " + err);
         res.status(400);
         res.send();
       } else {
         update_parent();
         //res.status(200);
         //res.send();
       }
   });

   function update_parent() {
       var parent_is_topic = parent_topic_id != null;

       if (parent_is_topic) {
           update_topic_parent();
       } else {
           update_toplevel_parent();
       }
   }

   function update_toplevel_parent() {
      var toplevel_model = res.locals.models.top_level;
      toplevel_model.find({where:{id:new_topic.toplevel}}).complete(modify_toplevel_parent);
   }

   function update_topic_parent() {
      topic_model.find({where:{id:new_topic.parent_topic}}).complete(modify_topic_parent);
   }

   function modify_toplevel_parent(err,toplevel) {
       if (err) {
         console.log("error getting the toplevel object: " + err);
         res.status(400);
         res.send();
       } else {
           if (toplevel.topics == null) {
               toplevel.topics = [new_topic.id];
           } else {
               toplevel.topics.push(new_topic.id);
           }

           toplevel.save(['topics']).complete(function(err) {
               if (err) {
                   console.log("error saving the toplevel object: " + err);
                   res.status(400);
                   res.send();
               }
               res.status(200);
               res.send();
           });
       }
   }

   function modify_topic_parent(err,parent_topic) {
       if (err) {
         console.log("error getting the parent topic: " + err);
         res.status(400);
         res.send();
         return;
       }

       if (toplevel.topics == null) {
          parent_topic.sub_topics = [new_topic.id];
       } else {
          parent_topic.sub_topics.push(new_topic.id);
       }
       parent_topic.save(['sub_topics']).complete(function(err) {
            if (err) {
                console.log("error saving the parent topic object: " + err);
                res.status(400);
                res.send();
                return;
            }
            res.status(200);
            res.send();
       });
   }
}

function get_page_parameters_and_check_for_errors(req,res) {
    var info = new Object();

    var topic_title = get_param(req,'title');
    var toplevel_id = get_param_int(req,'toplevel');
    var parent_topic_id = get_param_int(req,'parent_topic');

    if (topic_title == null) {
        console.log("The 'title' parameter is missing");
        res.status(400);
        res.send();
        return null;
    }

    if (toplevel_id == null) {
        console.log("The 'toplevel' parameter is missing");
        res.status(400);
        res.send();
        return null;
    }

    if (int_type_error(toplevel_id)) {
        console.log("The toplevel id must be an integer.");
        res.status(400);
        res.send();
        return null;
    }

    info.parent_is_toplevel = parent_topic_id == null;
    info.parent_is_topic = parent_topic_id != null;
    info.title = topic_title
    info.toplevel_id = toplevel_id
    info.parent_topic = parent_topic_id

    if (info.parent_is_topic) {
        if (int_type_error(parent_topic_id)) {
            console.log("The parent_topic_id id must be an integer.");
            res.status(400);
            res.send();
            return null;
        }
    }
    return info;
}

function get_param(req,param) {
    if (req.body.hasOwnProperty(param)) {
        return req.body[param];     
    }
    return null;
}
function get_param_int(req,param) {
    if (req.body.hasOwnProperty(param)) {
        return parseInt(req.body[param]);
    }
    return null;
}
function int_type_error(value) {
    if (isNaN(value)) {
        return true;
    }
    return false;
}

function create_new_topic(req,res,info,callback) {

    callback = callback || function () {};

    var topic_model = res.locals.models.topic;
    var topic = null;

    if (info.parent_is_toplevel) {
        topic = topic_model.build({ title:info.title, toplevel:info.toplevel_id, understood:0.0});
        topic.save(['title','toplevel','understood']).complete(function(err,new_topic) {
            if (err) {
                console.log("Error creating a new topic: " + err);
                res.status(400);
                res.send();
                return;
            }
            return callback(req,res,info,new_topic);
        });
    } else if (info.parent_is_topic) {
        topic = topic_model.build({ title:info.title, toplevel:info.toplevel_id, understood:0.0, parent_topic:info.parent_topic_id});
        topic.save(['title','toplevel','understood','parent_topic']).complete(function(err,new_topic) {
            if (err) {
                console.log("Error creating a new topic: " + err);
                res.status(400);
                res.send();
                return;
            }
            return callback(req,res,info,new_topic);
        });
    } else {
        console.log("Reached an unexpected line of code.");
        res.status(400);
        res.send();
        return;
    }
}

function update_parent(req,res,info,new_topic) {
    if (info.parent_is_toplevel) {
        update_toplevel_parent(req,res,info,new_topic);
    } else if (info.parent_is_topic) {
        update_topic_parent(req,res,info,new_topic);
    } else {
        console.log("Reached unexpected line of code in update_parent()");
        res.status(400);
        res.send();
        return;
    }
}

function update_toplevel_parent(req,res,info,new_topic) {
    var toplevel_model = res.locals.models.top_level;

    toplevel_model.find({where:{id:new_topic.toplevel}}).complete(function(err,toplevel) {
        if (err) {
            console.log("error getting the toplevel object: " + err);
            res.status(400);
            res.send();
            return;
        }

        if (toplevel.topics == null) {
            toplevel.topics = [new_topic.id];
        } else {
            toplevel.topics.push(new_topic.id);
        }

        toplevel.save(['topics']).complete(function(err) {
            if (err) {
                console.log("error saving the toplevel object: " + err);
                res.status(400);
                res.send();
                return;
            }
            res.status(200);
            res.send();
        });
    });
}


function update_topic_parent(req,res,info,new_topic) {
    var topic_model = res.locals.models.topic;

    topic_model.find({where:{id:new_topic.parent_topic}}).complete(function(err,parent_topic) {
        if (err) {
            console.log("error getting the parent topic object: " + err);
            res.status(400);
            res.send();
            return;
        }

        if (parent_topic.sub_topics == null) {
            parent_topic.sub_topics = [new_topic.id];
        } else {
            parent_topic.sub_topics.push(new_topic.id);
        }

        parent_topic.save(['sub_topics']).complete(function(err) {
            if (err) {
                console.log("error saving the parent topic object: " + err);
                res.status(400);
                res.send();
                return;
            }
            res.status(200);
            res.send();
        });
    });
}


