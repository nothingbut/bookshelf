class bookEntity {
    constructor(book, rootpath) {
        this.id = book.NovelID;
        this.title = book.NovelName;
        this.author = book.Author;
        this.categories = book.categories;
        this.cover = book.BookImg;
        this.brief = book.brief;
        this.chapters = book.chapters;

        this.root = rootpath + '/' + this.id;
        this.temp = rootpath + '/' + this.id;
    }

    generatePath() {

    }

    prepareFiles() {

    }

    cleanUp() {
    }

    buildEpub() {
        var epub = require('epub-gen');
        var epubOptions = {
            title: this.title
        };
        var epubBook = new epub(epubOptions);
        return 'success';
    }
}

module.exports = function (data) {
    return new bookEntity(data);
}

module.exports.bookEntity = bookEntity;