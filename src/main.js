const mdbFile = './data/pim.mdb';
var mdbUtils = require('./mdbUtils');
var bookshelfMDB = mdbUtils(mdbFile);

bookshelfMDB.listBooks(function (err, books) {
    if (err) {
        console.log(err);
    } 
    else {
        console.log(books);
    }
});