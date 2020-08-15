const bookTable = document.querySelector('#bookTable');

// Book Model Item
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
// Access Book From Storage
class BookStorage {
    static BOOKSKEY = "books";
    // Gets Array Of Book From Storage
    static getBooks() {
        let books;
        if (localStorage.getItem(BookStorage.BOOKSKEY) === null) {
            books = []
        } else {
            // Gets value as JSON string from storage
            let booksArrTxt = localStorage.getItem(BookStorage.BOOKSKEY);
            // Convert the string to JSON Object
            books = JSON.parse(booksArrTxt);
        }
        return books;
    }
    static AddBook(book) {

        let books = BookStorage.getBooks();

        books.push(book);

        localStorage.setItem(BookStorage.BOOKSKEY, JSON.stringify(books));
    }
    static RemoveBook(isbn) {
        let books = BookStorage.getBooks();
        books.forEach((elementBook, index) => {
            if (elementBook.isbn === isbn)
                books.splice(index, 1);
        })

        localStorage.setItem(BookStorage.BOOKSKEY, JSON.stringify(books));
    }
    static GetJsonBooks = () => {
        fetch('books.json').then(jsonArr => jsonArr.json())
            .then(jsonArr => jsonArr.forEach(jsonObj => {
                UI.addBookToList(jsonObj, 'jsonInput');
            })).then(addDeleteEvent());

    }
}
// Display Data
// Read Data From Inputs For New Book Item
class UI {
    static addBookToList(book, className) {
        let listTableBody = document.querySelector("#book-list");
        // Create New Tr
        let row = document.createElement("tr");
        row.classList.add(className);
        row.innerHTML = `<td>${book.title}</td>` +
            `<td>${book.author} </td>` +
            `<td>${book.isbn} </td>` +
            `<td> <span id="b-${book.isbn}" class="badge badge-pill badge-danger myDeleteClass"></button> Delete </span> </td>`;
        listTableBody.appendChild(row);
    }
    static displayBooks() {
        BookStorage.getBooks().forEach(book => this.addBookToList(book));
    }
    static clearFormInputs() {
        document.querySelector("#title").value = '';
        document.querySelector("#auther").value = '';
        document.querySelector("#isbn").value = '';
    }

}

// let a1 = new Book("First Title", "Author 1", "111");
// BookStorage.AddBook(a1);
// let a2 = new Book("Second Title", "Author 2", "222");
// BookStorage.AddBook(a2);

// BookStorage.RemoveBook(a1.isbn);

// for(var book in BookStorage.getBooks()){
//     UI.addBookToList(book);
// }
// UI.addBookToList(a1);
// UI.addBookToList(a2);



addDeleteEvent = () => {
    document.querySelectorAll(".myDeleteClass").forEach(obj => {
        obj.addEventListener('click', () => {
            BookStorage.RemoveBook(obj.id.slice(2));
            obj.parentNode.parentNode.remove();
        })
    })
}
window.addEventListener('DOMContentLoaded', () => {
    UI.displayBooks();
    BookStorage.GetJsonBooks();
});


document.querySelector("#book-form").addEventListener("submit", e => {
    e.preventDefault();
    titleVal = document.querySelector("#title").value;
    autherVal = document.querySelector("#auther").value;
    isbnVal = document.querySelector("#isbn").value;

    if ((titleVal === '') || (autherVal === '') || (isbnVal === '')) {
        alert("Please Fill All Inputs");
    } else {
        let book = new Book(titleVal, autherVal, isbnVal);
        UI.addBookToList(book, 'userInput');
        BookStorage.AddBook(book);
        UI.clearFormInputs();
        addDeleteEvent();
    }
});
document.getElementById('colTitle').addEventListener('click', () => {
    document.querySelector("#book-list").innerHTML = "";
    BookStorage.getBooks().sort((a, b) => (a.title > b.title) ? 1 : -1).forEach(book => {
        UI.addBookToList(book);
        addDeleteEvent();
    })
})
document.getElementById('colAuthor').addEventListener('click', () => {
    document.querySelector("#book-list").innerHTML = "";
    BookStorage.getBooks().sort((a, b) => (a.author > b.author) ? 1 : -1).forEach(book => {
        UI.addBookToList(book);
        addDeleteEvent();
    })
})
document.getElementById('colIsbn').addEventListener('click', () => {
    document.querySelector("#book-list").innerHTML = "";
    BookStorage.getBooks().sort((a, b) => (parseInt(a.isbn) > parseInt(b.isbn)) ? 1 : -1).forEach(book => {
        UI.addBookToList(book);
        addDeleteEvent();
    })
})