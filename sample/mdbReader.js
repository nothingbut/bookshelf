//const root = '/Users/shichang/public/Books/';
const root = '/Users/nothingbut/Books/';
const mdbFile = root + 'pim.mdb';    
var mdbUtils = require('../src/mdbUtils');
var bookshelfMDB = mdbUtils(mdbFile);

function generateEpub(cats, curbook) {
    bookshelfMDB.fetchBook(curbook.NovelID, function(err, chapters) {
        if (err) {
            console.log(err);
        }
        else {
            var volumes = [];
            var volTitle = '';
            for (idx in chapters) {
                var title = chapters[idx].Volume;
                if (title !== volTitle) {
                    volTitle = title;
                    var volume = {};
                    volume.title = volTitle;
                    volume.chapters = [];
                    volumes.push(volume);
                }
                volumes[volumes.length - 1].chapters.push(chapters[idx]);
            }
            curbook.volumes = volumes;

            var categories = [];
            var cat = curbook.LB;
            while (cat !== '') {
                var cur = cats.get(cat);
                categories.push(cur.MC);
                cat = cur.TopDM;
            }
            curbook.categories = categories.reverse();
            bookshelfMDB.getBrief(curbook.NovelID, function (err, brief) {
                if (err) {
                    console.log(err);
                }
                else {
                    curbook.brief = brief;

                    var bookBuilder = require('../src/bookUtils');
                    var bookEntity = new bookBuilder.bookEntity(curbook, root);
                    console.log('ready for building...' + curbook.NovelName);
                    bookEntity.buildEpub().then(data => {
                        console.log(data);
                    });
                }
            });
        }
    });
}

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
                for (idx in books) {
                    curbook = books[idx];
                    if (idx != 100) continue;
                    console.log('Processing book ' + curbook.NovelID);
                    generateEpub(cats, curbook);
                }
            }
        });
    }
});