var spawn = require('child_process').spawn;
var stream = require('stream');
var util = require('util');

function bookshelfMDB(file) {
    stream.Stream.call(this);
    this.writable = true;
    this.file = file;
    this.tableDelimiter = ',';

    this.booksTable = 'book_novel';
    this.contentTable = 'book_NovelContent';
    this.categoryTable = 'dic_noveltype';
    this.listBooksQuery = 'select NovelID, NovelName, Author, BookImg, LB from book_novel';
    this.queryFile = './temp/queryString.txt';
}

bookshelfMDB.prototype.books = function (cb) {
    var self = this;
    var cmd = spawn('mdb-sql', ['-H', '-F', '--no-pretty-print', '-d', '|', '-i', queryFile, mdbFile]);
    fs.writeFileSync(queryFile, listBooksQuery);
    
    cmd.stdout.pipe(
        concat(function (err, out) {
            if (err) return cb(err)
            if (!out) return cb('no output')
            cb(false, out)
        })
    )
}

module.exports = function (data) {
    return new bookshelfMDB(data);
}

module.exports.bookshelfMDB = bookshelfMDB;