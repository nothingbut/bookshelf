var spawn = require('child_process').spawn;
var parse = require('csv-parse/sync').parse;
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
    this.listBooksQuery = 'select NovelID, NovelName, Author, BookImg, LB from book_novel';
    this.listCategoryQuery = 'select MC, TopDM, DM from dic_noveltype';
    this.getBriefQuery = 'select brief from book_novel where NovelID = ';
    this.fetchBookQuery = 'select Displayorder, id, Title, Volume, DownDate from book_NovelContent where NovelID = ';
    this.queryFile = './temp/queryString';

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
                return cb(data);
            });
        } else {
            if (!out) return 'no output';
            booklist = parse(out, this.parseOption);
            return booklist;
        }
    }); 
}

bookshelfMDB.prototype.getBrief = function (id, cb) {
    var self = this;
    require('fs').writeFileSync(this.queryFile, this.getBriefQuery + '\'' + id + '\'');

    var cmd = spawn('mdb-sql', ['-H', '-F', '--no-pretty-print', '-d', '|', '-i', this.queryFile, this.mdbFile]);
    
    let out = ''
    cmd.stdout.on('data', data => (out += data))
    cmd.on('exit', (code) =>{
        if (code !== 0) {
            cmd.stderr.on('data', (data) => {
                cb(data);
            });
        } else {
            if (!out) return cb('no output')
            cb(false, out);
        }
    });
}

bookshelfMDB.prototype.listCategory = function (cb) {
    var self = this;
    require('fs').writeFileSync(this.queryFile, this.listCategoryQuery);

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
            categoryList = parse(out, this.parseOption);
            let categoryMap = new Map();
            for (idx in categoryList) {
                categoryList[idx].MC = categoryList[idx].MC.replaceAll('-', '');
                categoryMap.set(categoryList[idx]['DM'], categoryList[idx]);
            }
            cb(false, categoryMap);
        }
    }); 
}

bookshelfMDB.prototype.fetchBook = function (id, cb) {
    var self = this;
    require('fs').writeFileSync(this.queryFile, this.fetchBookQuery + '\'' + id + '\'');

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
            chapterList = parse(out, this.parseOption);

            cb(false, chapterList.sort((a, b) => a.Displayorder - b.Displayorder));
        }
    });

}

module.exports = function (data) {
    return new bookshelfMDB(data);
}

module.exports.bookshelfMDB = bookshelfMDB;