const root = '/Users/shichang/Public/Books/';
const mdbFile = root + 'pim.mdb';    
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
                var curbook = books[2];
                bookshelfMDB.fetchBook(curbook.NovelID, function(err, chapters) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var volumes = [];
                        var volTitle = '';
                        for (idx in chapters) {
                            if (chapters[idx].Volume !== volTitle) {
                                volTitle = chapters[idx].Volume;
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
                                
                                bookEntity.buildEpub();
                            }
                        });
                    }
                });
            }
        });
    }
});