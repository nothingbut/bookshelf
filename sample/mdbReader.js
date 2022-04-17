/* 
var spawn = require('child_process').spawn;
var stream = require('stream');
var util = require('util');
var concat = require('concat-stream')
var fs = require('fs');
var parser = require('np');

const mdbFile = '/Users/shichang/Workspace/bookshelf/data/pim.mdb';
const booksTable = 'book_novel';
const contentTable = 'book_NovelContent';
const categoryTable = 'dic_noveltype';
const listBooksQuery = 'select NovelID, NovelName, Author, BookImg, LB from book_novel';
const queryFile = './temp/queryString.txt';

var cmd = spawn('mdb-sql', ['-H', '-F', '--no-pretty-print', '-d', '|', '-i', queryFile, mdbFile]);
fs.writeFileSync(queryFile, listBooksQuery);
//  var cmd = spawn('mdb-json', ['-D', ',', '/Users/shichang/Workspace/bookshelf/data/pim.mdb', 'book_novel']);
cmd.stdout.pipe(
    concat(function (err, data) {
        if (err) {
            console.log(err.toString());
            return;
        }
        if (!data) {
            console.log('no output');
            return;
        }
        var bookList = {};//JSON.parse(data);
        console.log(bookList.length);
        return {};
    })
)
*/
var bookshelf = require('mdbUtils').bookshelfMDB(mdbFile);