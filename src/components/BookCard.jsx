function BookCard({ book, onClick }) {
  const hasCoverImage = Boolean(book.coverImageUrl);

  return (
    <button type="button" className="book-card" onClick={onClick}>
      <div className={`book-cover ${hasCoverImage ? "has-image" : ""}`}>
        {hasCoverImage ? (
          <>
            <img
              className="cover-blur-bg"
              src={book.coverImageUrl}
              alt=""
              aria-hidden="true"
            />
            <img
              className="cover-main-image"
              src={book.coverImageUrl}
              alt={`${book.title} 표지`}
            />
          </>
        ) : (
          <>
            <span>BOOK</span>
            <strong>{book.title}</strong>
            <em>{book.author.nickname}</em>
          </>
        )}
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p>저자: {book.author.nickname}</p>
        {book.publisher && <p>출판사: {book.publisher}</p>}
        <p>{book.content}</p>
      </div>
    </button>
  );
}

export default BookCard;
