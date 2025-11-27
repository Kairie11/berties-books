# Berties Books

A Node.js web application for managing a bookshop built with Express.js, EJS templating, and MySQL database.

Features

1. Browse and search for books
2. User registration system
3. Dynamic book listing from database
4. Responsive page templates with EJS
5. Modular routing structure

## Access Control

### Protected Routes (Login Required)
- `/users/list` - Only logged-in users can view the list of registered users
- `/users/logout` - Only logged-in users can logout
- `/books/list` - Only logged-in users can view the complete book inventory

These routes are protected using the `redirectLogin` middleware, which checks for `req.session.userId`. If a user is not logged in, they are redirected to the login page.

### Public Routes (No Login Required)
- `/` - Home page: accessible to all visitors
- `/about` - About page: public information about the shop
- `/books/search` - Search page: allows anyone to search for books
- `/books/search-result` - Search results: displays search results to anyone
- `/users/register` - Registration: allows new users to sign up
- `/users/login` - Login: allows users to authenticate

### Rationale
Public routes are designed to encourage visitor engagement and allow potential customers to browse and register. Protected routes contain sensitive information (user list) or functionality that only makes sense for authenticated users (viewing full inventory, logout).

To install and run:

npm install
node index.js
