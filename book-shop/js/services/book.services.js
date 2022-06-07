'use strict'
const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 5
const gBooksNames = [
    'In Search of Lost Time', 'Ulysses', 'Don Quixote', 'One Hundred Years of Solitude', 'The Great Gatsby',
    'Moby Dick', 'War and Peace', 'Hamlet', 'The Odyssey', 'Madame Bovary', 'The Divine Comedy', 'Lolita', 'The Brothers Karamazov', 'Crime and Punishment',
    'Wuthering Heights', 'The Catcher in the Rye', 'Pride and Prejudice', 'The Adventures of Huckleberry Finn', 'nna Karenina',
    'Alice\'s Adventures in Wonderland', 'The Iliad', 'To the Lighthouse', 'Catch-22', 'Heart of Darkness', 'The Sound and the Fury',
    'Nineteen Eighty Four', 'Great Expectations', 'One Thousand and One Nights', 'The Grapes of Wrath', 'Absalom, Absalom!', 'Invisible Man'
]
const gBooksPics = [
    'photos/0.jpg', 'photos/1.jpg', 'photos/2.jpg', 'photos/3.jpg', 'photos/4.jpg', 'photos/5.jpg', 'photos/6.jpg', 'photos/7.jpg', 'photos/8.jpg',
    'photos/9.jpg', 'photos/10.jpg', 'photos/11.jpg', 'photos/12.jpg', 'photos/13.jpg', 'photos/14.jpg', 'photos/15.jpg', 'photos/16.jpg', 'photos/17.jpg',
    'photos/18.jpg', 'photos/19.jpg', 'photos/20.jpg', 'photos/21.jpg', 'photos/22.jpg', 'photos/23.jpg', 'photos/24.jpg', 'photos/25.jpg', 'photos/26.jpg',
    'photos/27.jpg', 'photos/28.jpg', 'photos/29.jpg',
]
var gBooks
var gFilterBy = { price: 0, rate: 0, txt: '' }
var gPageIdx = 0

_creatBooks()

function nextPage(btn) {
    gPageIdx++
    const elPrevPage = document.querySelector('.prev-page')
    elPrevPage.disabled = false
    var numOfPages = Math.floor(gBooks.length / PAGE_SIZE) + 1
    btn.disabled = false
    if (gPageIdx === numOfPages - 1) {
        btn.disabled = true
        return
    }
}
function prevPage(btn) {
    gPageIdx--
    const elNextPage = document.querySelector('.next-page')
    elNextPage.disabled = false
    if (gPageIdx === 0) {
        btn.disabled = true
        return
    }
}
function movePageTo(pageNum) {
    const elNextPage = document.querySelector('.next-page')
    const elPrevPage = document.querySelector('.prev-page')
    if (pageNum > gPageIdx) nextPage(elNextPage)
    if (pageNum <= gPageIdx) prevPage(elPrevPage)
}
//add default price val +img
function _creatBook(name, idx) {
    return {
        id: makeId(),
        name,
        price: (getRandomIntInclusive(0, 10000) / 100),
        imgUrl: gBooksPics[idx],
        desc: makeLorem(),
        rate: 0
    }
}
function _creatBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = []
        for (var i = 0; i < 30; i++) {
            books.push(_creatBook(gBooksNames[i], i))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function getBooks() {
    let books = gBooks
    books = books.filter(book => book.name.includes(gFilterBy.txt))
    if (gFilterBy.price) books = books.filter((book) => book.price > gFilterBy.price)
    if (gFilterBy.rate) books = books.filter((book) => book.rate > gFilterBy.rate)

    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function addBook(name, price, imgUrl) {
    const newBook = _creatBook(name)
    newBook.price = price
    newBook.imgUrl = imgUrl
    gBooks.unshift(newBook)
    _saveBooksToStorage()
    return newBook
}


function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}


function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}



function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function changeBookRate(bookId, newRate) {
    const book = gBooks.find(book => bookId === book.id)
    book.rate = newRate
    _saveBooksToStorage()
    return book
}

function setSortBy(value) {
    var books = gBooks
    value = value.charAt(0).toLowerCase() + value.slice(1)
    if (value === 'title') value = 'name'
    if (value === 'price') return books.sort((book1, book2) => book1.price - book2.price)
    if (value === 'name') return books.sort((book1, book2) => book1.name.localeCompare(book2.name))
}

function setBookFilter(filterBy = {}) {
    if (filterBy.price !== undefined) gFilterBy.price = filterBy.price
    if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate
    if (filterBy.txt !== undefined) {
        var word = filterBy.txt
        word = word.charAt(0).toUpperCase() + word.slice(1)
        gFilterBy.txt = word
    }
    return gFilterBy
}
