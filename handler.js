const { nanoid } = require('nanoid')
const books = require('./books')

const addBooks = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)

  const finished = pageCount === readPage

  const insertedAt = new Date().toISOString()

  const updatedAt = insertedAt

  const newBooks = {

    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt

  }

  books.push(newBooks)

  const valueName = newBooks.name

  const checkIsAddBookSuccess = (vName) => {
    if (vName != null) {
      return true
    } else {
      return false
    }
  }

  const isAddBookSuccess = checkIsAddBookSuccess(valueName)

  const checkReadPageMoreThanPageCount = readPage <= pageCount

  if (isAddBookSuccess && checkReadPageMoreThanPageCount) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  } else if (isAddBookSuccess === false) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (checkReadPageMoreThanPageCount === false) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
}

const getAllBooks = (request, h) => {
  const filteringBooks = books.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))
  if (books != null) {
    const response = h.response({
      status: 'success',
      data: {
        books: filteringBooks
      }
    })
    response.code(200)
    return response
  }
}

const getBooksById = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if (book !== null) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  } else if (book !== bookId) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

const editBooksById = (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  const checkIsName = (vName) => {
    if (vName != null) {
      return true
    } else {
      return false
    }
  }

  const isName = checkIsName(name)

  const isReadPageAndPageCount = readPage <= pageCount

  if (isName && isReadPageAndPageCount) {
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt
      }

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      response.code(200)
      return response
    }
  } else if (isName === false) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (isReadPageAndPageCount === false) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBooksById = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBooks, getAllBooks, getBooksById, editBooksById, deleteBooksById }
