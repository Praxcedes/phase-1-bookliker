document.addEventListener('DOMContentLoaded', () => {
  const BOOKS_URL = 'http://localhost:3000/books';
  const CURRENT_USER = { id: 1, username: 'pouros' }; // Hardcoded user
  const bookList = document.getElementById('list');
  const showPanel = document.getElementById('show-panel');

  // Fetch all books and display titles
  fetch(BOOKS_URL)
    .then(resp => resp.json())
    .then(books => {
      books.forEach(book => renderBookTitle(book));
    });

  function renderBookTitle(book) {
    const li = document.createElement('li');
    li.textContent = book.title;
    li.addEventListener('click', () => showBookDetails(book));
    bookList.appendChild(li);
  }

  function showBookDetails(book) {
    showPanel.innerHTML = `
      <h2>${book.title}</h2>
      <img src="${book.img_url}" alt="${book.title}" style="max-width:200px;" />
      <p>${book.description}</p>
      <h3>Liked by:</h3>
      <ul id="users-list">
        ${book.users.map(user => `<li>${user.username}</li>`).join('')}
      </ul>
      <button id="like-btn">${isBookLikedByCurrentUser(book) ? 'UNLIKE' : 'LIKE'}</button>
    `;

    const likeBtn = document.getElementById('like-btn');
    likeBtn.addEventListener('click', () => toggleLike(book));
  }

  function isBookLikedByCurrentUser(book) {
    return book.users.some(user => user.id === CURRENT_USER.id);
  }

  function toggleLike(book) {
    let updatedUsers;
    if (isBookLikedByCurrentUser(book)) {
      // Unlike
      updatedUsers = book.users.filter(user => user.id !== CURRENT_USER.id);
    } else {
      // Like
      updatedUsers = [...book.users, CURRENT_USER];
    }

    // PATCH request to update users
    fetch(`${BOOKS_URL}/${book.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: updatedUsers })
    })
      .then(resp => resp.json())
      .then(updatedBook => {
        book.users = updatedBook.users; // Update local book object
        showBookDetails(book); // Re-render details
      });
  }
});
