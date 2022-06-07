'use strict'

//git changed
//starts on page load
function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
    renderModalByQueryStringParams()
}
//rendering querystringparams
function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)

    const filterBy = {
        price: +queryStringParams.get('price') || 0,
        rate: +queryStringParams.get('rate') || 0,
        txt: queryStringParams.get('txt') || '',
    }

    if (!filterBy.price && !filterBy.rate && !filterBy.txt) return

    document.querySelector('.filter-by-rate').value = +filterBy.rate
    document.querySelector('.filter-by-price').value = +filterBy.price
    document.querySelector('[name="filter-txt"]').value = filterBy.txt
    setBookFilter(filterBy)
}

//rendering modal if open
function renderModalByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)

    const bookId = queryStringParams.get('id') || ''
    if (bookId) onReadBook(bookId)
}

//RenderBooksTable
function renderBooks() {
    var books = getBooks()

    var strHTML =
        `<table>
            <thead>
                <td>Id</td>
                <td data-trans="title" class="name-header" onclick="onSortBy(this.innerText)">Title</td>
                <td data-trans="price" class="price-header" onclick="onSortBy(this.innerText)">Price</td>
                <td data-trans="picCover">Cover Picture</td>
                <td data-trans="actions">Actions</td>
            </thead>`
    strHTML += books.map(book =>
        `<tr>
                <td>#${book.id}</td>
                <td>${book.name.charAt(0).toUpperCase() + book.name.slice(1)}</td>
                <td>${formatCurrency(book.price)}</td>
                <td class="cover-pic"><img src="${book.imgUrl}"></td>
                <td><button data-trans="read" class="read-btn" onclick="onReadBook('${book.id}')">Read</button><button data-trans="update" class="update-btn" onclick="onUpdateBook('${book.id}')">Update</button><button data-trans="delete" class="delete-btn" onclick="onRemoveBook('${book.id}')">Delete</button></td>
            </tr>`
    ).join('')
    strHTML += '</table>'
    document.querySelector('.books-container').innerHTML = strHTML
}
//adding a book to the shop
function onAddBook(ev) {
    ev.preventDefault()
    const name = document.querySelector('.new-book-name').value
    const price = document.querySelector('.new-book-price').value
    const imgUrl = 'photos/newbook.jpg'
    const book = addBook(name, price, imgUrl)
    document.querySelector('.new-book-name').value = ''
    document.querySelector('.new-book-price').value = ''
    renderBooks()
    doTrans();
    flashMsg(`New Book Added (Name: ${book.name})`)

}



//deleting a book from the table/shop
function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    doTrans();
    flashMsg(`Book ${bookId} Deleted`)
}

//updating book price
function onUpdateBook(bookId) {
    var book = getBookById(bookId)
    var newBookPrice = +prompt('New Price?', book.price)
    if (newBookPrice && book.price !== newBookPrice) {
        const book = updateBook(bookId, newBookPrice)
        renderBooks()
        flashMsg(`Book Price Updated To: ${book.price}`)
    }
}


//changing the rating of each book
function onRatingChange(btn) {
    var elModal = document.querySelector('.modal')
    var bookRate = +elModal.querySelector('.rating span').innerText
    var elBookId = elModal.querySelector('h7').innerText
    const currBook = gBooks.find((book) => book.id === elBookId)
    if (btn.innerText === '➖') {
        if (bookRate === 0) return
        bookRate--
    }
    if (btn.innerText === '➕') {
        if (bookRate === 10) return
        bookRate++
    }

    changeBookRate(elBookId, bookRate)

    elModal.querySelector('.rating span').innerText = bookRate
    currBook.rate = bookRate

}

//Read Book Info
function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h7').innerText = bookId
    elModal.querySelector('h3').innerText = book.name.charAt(0).toUpperCase() + book.name.slice(1)
    elModal.querySelector('h4 span').innerText = book.price + '$'
    elModal.querySelector('p').innerText = book.desc
    elModal.querySelector('.rating span').innerText = book.rate
    elModal.classList.add('open')

    setQueryStringParams(bookId)

}

//CloseModal
function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
    setQueryStringParams()
}

//pop up update msg
function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

//sorting the books
function onSortBy(value) {
    setSortBy(value)
    renderBooks()
    doTrans();
}


//moving to next page
function onNextPage(btn) {
    nextPage(btn)
    renderPageBtn((gPageIdx + 1))
    renderBooks()
    doTrans();
}
//moving to prev page
function onPrevPage(btn) {
    prevPage(btn)
    renderPageBtn((gPageIdx + 1))
    renderBooks()
    doTrans();
}
//moving pages by advanced paging
function onMovePageTo(pageNum) {
    if (pageNum === 0) return
    movePageTo(pageNum)
    renderPageBtn(pageNum)
    renderBooks()
    doTrans();
}
function renderPageBtn(pageNum) {
    const elCurrPage0 = document.querySelector('.curr-page0')
    elCurrPage0.disabled = true
    const elCurrPage1 = document.querySelector('.curr-page1')
    const elCurrPage2 = document.querySelector('.curr-page2')
    elCurrPage2.disabled = false
    if (gPageIdx > 0) elCurrPage0.disabled = false
    if (gPageIdx === 5) elCurrPage2.disabled = true
    elCurrPage0.innerText = (+pageNum - 1)
    elCurrPage1.innerText = pageNum
    elCurrPage2.innerText = (+pageNum + 1)
}

//filtering the books
function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)

    renderBooks()
    doTrans();

    setQueryStringParams()
}

//setting lang for the store
function onSetLang(lang) {
    setLang(lang);
    if (lang === "he") document.body.classList.add("rtl")
    else document.body.classList.remove("rtl")
    renderBooks();
    doTrans();
}