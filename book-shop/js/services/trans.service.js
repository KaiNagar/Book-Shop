'use strict'

// var gBookTrans = {

// }
var gTrans = {
    header: {
        en: 'Welcome To My Book Shop!',
        he: 'ברוכים הבאים לחנות הספרים שלי!'
    },
    newBookName: {
        en: 'New Book Name: ',
        he: 'השם של הספר החדש: '
    },
    newBookNamePlaceHolder: {
        en: 'Type Book Name...',
        he: '...הכנס את שם הספר החדש'
    },
    newBookPrice: {
        en: 'New Book Price: ',
        he: 'המחיר של הספר החדש: '
    },
    newBookPricePlaceHolder: {
        en: 'Type Book Price...',
        he: '...הכנס את מחיר הספר החדש'
    },
    addBook: {
        en: 'Add Book',
        he: 'הוסף ספר'
    },
    selectSort: {
        en: 'Select Sort ',
        he: 'בחר מיון'
    },
    sortPrice: {
        en: 'Price',
        he: 'מחיר'
    },
    sortName: {
        en: 'Title',
        he: 'שם'
    },
    filterName: {
        en: 'Filter By Name',
        he: 'סנן לפי שם'
    },
    filterNamePlaceHolder: {
        en: 'Search Book...',
        he: 'חפש ספר...'
    },
    filterRate: {
        en: 'Filter By Rate',
        he: 'סנן לפי דירוג'
    },
    filterPrice: {
        en: 'Filter By Price',
        he: 'סנן לפי מחיר'
    },
    title: {
        en: 'Title',
        he: 'שם הספר'
    },
    price: {
        en: 'Price',
        he: 'מחיר'
    },
    picCover: {
        en: 'Cover Picture',
        he: 'תמונת כריכה'
    },
    actions: {
        en: 'Actions',
        he: 'פעולות'
    },
    read: {
        en: 'Read',
        he: 'תקציר'
    },
    update: {
        en: 'Update',
        he: 'עדכן '
    },
    delete: {
        en: 'Delete',
        he: 'מחק'
    },
    nextPage: {
        en: 'Next Page',
        he: 'דף הבא'
    },
    prevPage: {
        en: 'Prev Page',
        he: 'דף קודם'
    },

    
    modalPrice:{
        en:'price:',
        he:''
    },
    modalDesc:{
        en:'Book Description:'
    }

}

var gCurrLang = 'en'

function getTrans(transKey) {
    var keyTrans = gTrans[transKey]
    if (!keyTrans) return 'Unknown'
    var txt = keyTrans[gCurrLang]
    if (!txt) txt = keyTrans.en
    return txt
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        var transKey = el.dataset.trans
        var txt = getTrans(transKey)
        if (el.localName === "input") el.placeholder = txt
        else el.innerText = txt
    })
}


function setLang(lang) {
    gCurrLang = lang
}

function formatNumOlder(num) {
    return num.toLocaleString('es')
}
function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num);
}

function formatCurrency(num) {
    var lang = gCurrLang
    var currency = ''
    switch (lang) {
        case 'en':
            currency = 'USD'
            break;
        case 'he':
            currency = 'ILS'
            num = usdToShekel(num)
            break;

    }
    return new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(num);
}

function usdToShekel(usd) {
    return usd * 3.34 // 7.6.22 updated
}

