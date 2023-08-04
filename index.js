renderBooks();

document.querySelector('.submit').addEventListener('click', (e) => {
        e.preventDefault();

        let locStorLibrary = getLibraryFromLocStor();

        let title = document.getElementById('title').value;
        let author = document.getElementById('author').value;
        let pages = document.getElementById('pages').value;

        let index = locStorLibrary.findIndex(book => book.title === title);

        if (index !== -1) {
            removeWarningElements();
            let warning = document.createElement('div');
            warning.classList.add('warning');
            warning.textContent = 'Book with this title already exists';

            let title = document.querySelector('form #title');
            let books = document.querySelector('form').insertBefore(warning, title.nextSibling);
            return;
        }

        locStorLibrary.push(new Book(title, author, pages, false));
        setLibraryToLocStor(locStorLibrary);
        closeForm();
        renderBooks();
    }
);

document.querySelector('.close').addEventListener('click', 
    function(event) {
        event.preventDefault();
    }
);

function setLibraryToLocStor(library) {
    localStorage.setItem("myLibrary", JSON.stringify(library));
}

function getLibraryFromLocStor() {
    let item = localStorage.getItem("myLibrary");
    if (!item) {
        localStorage.setItem("myLibrary", JSON.stringify([]));
        item = localStorage.getItem("myLibrary");
    }
    return JSON.parse(item);
}

function Book(title, author, pages, read) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.read = read,
    this.info = () => `${this.title} by ${this.author}, ${pages} pages, ${read ? 'already read' : "not read yet"}`
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function openForm() {
    document.querySelector(".books").style.opacity = 0.3;
    document.querySelector(".form-container").style.display = "block";
  }
  
function closeForm() {
    document.querySelector(".books").style.opacity = 1;
    document.querySelector(".form-container").style.display = "none";
    document.querySelector('form').reset();

    removeWarningElements();
}

function removeWarningElements() {
    let warnings = document.querySelectorAll('.warning');
    warnings.forEach(e => e.remove());
}

function toggleRead(title) {
    setLibraryToLocStor(getLibraryFromLocStor().map(book => book.title === title ? {...book, read: !book.read} : book));
    renderBooks();
}

function removeItem(event) {
    let library = getLibraryFromLocStor();
    let bookCard = event.target.parentElement.parentElement;
    let title = bookCard.querySelector('h1').textContent;

    let index = library.findIndex(book => book.title === title);

    if (index > -1) {
        library.splice(index, 1);
    }

    setLibraryToLocStor(library);
    renderBooks();
}

function renderBooks() {
    const books = document.querySelector('.books');
    books.replaceChildren();

    let library = getLibraryFromLocStor();

    if (!library) {
        return;
    }

    library.forEach(book => {
        let bookElement = document.createElement('div');
        bookElement.classList.add('book');
    
        let titleElement = document.createElement('h1');
        titleElement.textContent = book.title;
    
        let authorElement = document.createElement('div');
        authorElement.classList.add('author');
        authorElement.textContent = `Author: ${book.author}`;
    
        let pagesElement = document.createElement('div');
        pagesElement.classList.add('pages');
        pagesElement.textContent = `Pages: ${book.pages}`;
    
        let readElement = document.createElement('div');
        readElement.textContent = `Already read: ${book.read}`;
    
        let buttons = document.createElement('div');
        buttons.classList.add('buttons');
    
        let readButton = document.createElement('button');
        readButton.classList.add('read');
        readButton.onclick = function() {toggleRead(book.title)};
        readButton.innerText = 'Read';
    
        let removeButton = document.createElement('button');
        removeButton.classList.add('remove');
        removeButton.addEventListener('click', e => removeItem(e));
        removeButton.innerText = 'Remove';
    
        bookElement.appendChild(titleElement);
        bookElement.appendChild(authorElement);
        bookElement.appendChild(pagesElement);
        bookElement.appendChild(readElement);

        buttons.appendChild(readButton);
        buttons.appendChild(removeButton);
        bookElement.appendChild(buttons);

        books.appendChild(bookElement);
    });
}