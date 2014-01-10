exports.get = function(req, res){
    var toplevel_model = res.locals.models.top_level;
    var toplevel_id = parseInt(req.params.id);

    toplevel_model.find({where:{id:toplevel_id}}).complete(return_toplevel_json);

    function return_toplevel_json(err,toplevel) {
        if (err) {
            console.log("Error retriving the toplevel " + toplevel_id + ": " + err);
            res.status(400);
            res.send();
            return
        }

        res.set("Content-Type","application/json");
        res.status(200);
        res.send(JSON.stringify(toplevel));
    }
}
