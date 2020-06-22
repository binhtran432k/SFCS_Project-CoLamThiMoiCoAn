var notes = require('../models/notes');
exports.add = function(req, res, next) {
    res.render('noteedit', {
        title: "Add a note",
        docreate: true,
        notekey: "",
        note: undefined
    });
}
exports.save = function(req, res, next) {
    if (req.body.docreate === 'create') {
        notes.create(req.body.notekey,
                     req.body.title,
                     req.body.body);
    } else {
        notes.update(req.body.notekey,
                     req.body.title,
                     req.body.body);
    }
    res.redirect('/noteview?key='+req.body.notekey);
}
