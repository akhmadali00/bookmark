const form = document.querySelector('.form');
form.addEventListener('submit', addBookmarkToList);
const Storage = {
    getBookmarks: function(){
        let bookmarks;
        if(localStorage.getItem('bookmarks') === null){
            bookmarks = [];
        }else{
            bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        }   
        return bookmarks;
    },
    addBookmarkToStorage: function(title, url){
        const bookmarks = Storage.getBookmarks();
        bookmarks.push({title: `${title}`, url: `${url}`});
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    },
    removeBookmarkFromStorage: function(title){
        const bookmarks = Storage.getBookmarks();
        bookmarks.forEach((bookmark, index) => {
            if(bookmark.title == title){
                bookmarks.splice(index, 1);
            }
        });
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
};
function addBookmarkToList(e){
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const url = document.querySelector('#url').value;
    if(title == '' || url == ''){
        displayAlert('Please fill in the fields', 'warning');
    }else if(!isValidURL(url)){
        displayAlert('Please enter valid url!', 'warning');
    }
    else{
        displayAlert('Bookmark has been added', 'success');
        clear();
        Storage.addBookmarkToStorage(title, url);
        displayBookmarks();
    }
};
function deleteBookmarkFromList(bookmark){
    bookmark.remove();
};
function displayAlert(message, className){
    const alertMessage = document.createElement('div');
    alertMessage.className = `alert alert-${className}`;
    alertMessage.innerHTML = message;
    const container = document.querySelector('.container');
    const form = document.querySelector('.form');
    container.insertBefore(alertMessage, form);
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 2500);
};
function isValidURL(url){
    try { 
        return Boolean(new URL(url)); 
    }
    catch(e){ 
        return false; 
    }
}
function clear(){
    document.querySelector('#title').value = '';
    document.querySelector('#url').value = '';
};
function displayBookmarks(){
    const bookmarks = Storage.getBookmarks();
    let output = '';
    bookmarks.forEach((bookmark, index) => {
        output += `
            <tr key="${index}">
                <td>${bookmark.title}</td>
                <td><a href="${bookmark.url}" class="btn btn-outline-info" target="_blank">Visit</a></td>
                <td><button class="btn btn-outline-danger delete">Delete</button></td>
            </tr>
        `
    });
    document.querySelector('.table').innerHTML = output;
};
document.addEventListener('DOMContentLoaded', displayBookmarks);
document.querySelector('.table').addEventListener('click', (e) => {
    if(e.target.classList.contains('delete')){
        deleteBookmarkFromList(e.target.parentElement.parentElement);
        Storage.removeBookmarkFromStorage(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
        displayAlert('Bookmark has been deleted', 'success');
    }
});