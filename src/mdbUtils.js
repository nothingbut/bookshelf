var spawn = require('child_process').spawn;
var stream = require('stream');
var util = require('util');

function bookshelfMDB(file) {
    stream.Stream.call(this);
    this.writable = true;
    this.mdbFile = file;
    this.tableDelimiter = '|';

    this.booksTable = 'book_novel';
    this.contentTable = 'book_NovelContent';
    this.categoryTable = 'dic_noveltype';
    this.listBooksQuery = 'select NovelID, NovelName, Author, BookImg, LB from book_novel where NovelID <> \'000549\' and NovelID <> \'001317\'';
    this.queryFile = './temp/queryString.txt';

    this.parseOption = {
        delimiter: this.tableDelimiter,
        columns: true,
        auto_parse: true,
        skip_empty_lines: true
    };
}

bookshelfMDB.prototype.listBooks = function (cb) {
    var self = this;
    require('fs').writeFileSync(this.queryFile, this.listBooksQuery);

    var cmd = spawn('mdb-sql', ['-F', '--no-pretty-print', '-d', '|', '-i', this.queryFile, this.mdbFile]);
    
    let out = ''
    cmd.stdout.on('data', data => (out += data))
    cmd.on('exit', (code) =>{
        if (code !== 0) {
            cmd.stderr.on('data', (data) => {
                cb(data);
            });
        } else {
            if (!out) return cb('no output')
            var parse = require('csv-parse/sync').parse;
            booklist = parse(out, this.parseOption);
            cb(false, booklist);
        }
    }); 
}


module.exports = function (data) {
    return new bookshelfMDB(data);
}

module.exports.bookshelfMDB = bookshelfMDB;