const mdbFile = './data/pim.mdb';
var mdbUtils = require('../src/mdbUtils');
var bookshelfMDB = mdbUtils(mdbFile);

bookshelfMDB.listCategory(function(err, cats) {
    if (err) {
        console.log(err);
    } 
    else {
        bookshelfMDB.listBooks(function (err, books) {
            if (err) {
                console.log(err);
            } 
            else {
                console.log(books[0]);
                console.log(cats.get(books[0].LB));
            }
        });
    }
});