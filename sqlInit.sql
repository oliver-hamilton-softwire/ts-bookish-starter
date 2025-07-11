CREATE TABLE Books (
    isbn BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
);

CREATE TABLE BookCopies (
	book_id INT PRIMARY KEY,
	isbn BIGINT NOT NULL,
	FOREIGN KEY (isbn) REFERENCES Books (isbn) 
);

CREATE TABLE Authors (
	author_id INT PRIMARY KEY,
	first_name VARCHAR(255) NOT NULL,
	surname VARCHAR(255) NOT NULL
);

CREATE TABLE WroteBook (
	author_book_id INT PRIMARY KEY,
	author_id INT NOT NULL,
	isbn BIGINT NOT NULL,
	FOREIGN KEY (author_id) REFERENCES Authors (author_id),
	FOREIGN KEY (isbn) REFERENCES Books (isbn)
);

CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
	surname VARCHAR(255) NOT NULL
);

CREATE TABLE CheckOut (
    check_out_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    due_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users (user_id),
    FOREIGN KEY (book_id) REFERENCES BookCopies (book_id)
);