const {BookModel, UserModel} = require("../models")
const IssuedBook = require("../dtos/book-dto");


// const getAllBooks = () => {

// }


// const getSingleBookById = () => {

// }

// module.exports = {
//     getAllBooks,   getSingleBookById
// }



// router.get('/',(req, res)=>{
//     res.status(200).json({
//         success: true,
//         data: books
//     })
// })

exports.getAllBooks = async(req, res) => {
    const books = await BookModel.find()

    if(books.length ===0){
        return res.status.json({
            success: false,
            message: "No Books in the system"
        })
    }

    res.status(200).json({
        success: true,
        data: books
    })
}


// router.get('/:id', (req, res)=> {

//     const {id} = req.params;
//     const book = books.find((each)=>each.id === id)

//     if(!book){
//       return  res.status(404).json({
//             success: false,
//             message: `Book Not Found for id: ${id}`
//         })
//     }

//     res.status(200).json({
//         success: true,
//         data: book
//     })
// })  
exports.getSingleBookById = async(req, res) => {
    const {id} = req.params;
    const book = await BookModel.findById(id)  

    if(!book){
      return  res.status(404).json({
            success: false,
            message: `Book Not Found for id: ${id}`
        })
    }

    res.status(200).json({
        success: true,
        data: book
    })
}


// router.get('/issued/for-users', (req, res) => {
//     // const issuedBooks = books.filter((each) => each.issued === true);

//     const usersWithIssuedBooks = users.filter((each)=>{
//         if(each.issuedBook) {
//             return each;
//         }
//     })

//     const issuedBooks = [];
  
//     usersWithIssuedBooks.forEach((each)=>{
//         const book = books.find((book)=> book.id ===each.issuedBook);

//         book.issuedBy = each.name;
//         book.issuedDate = each.issuedDate;
//         book.returnDate = each.returnDate;

//         issuedBooks.push(book)
//     })

//     if(!issuedBooks === 0){
//         return res.status(404).json({
//             success: false,
//             message: "No Books issued yet"
//         })
//     }

//     res.status(200).json({
//         success: true,
//         data: issuedBooks
//     });
// });
exports.getAllIssuedBooks = async(req, res) => {
    const users = await UserModel.find({
        issuedBook: {$exists: true},
    }).populate("issuedBook")

    const issuedBooks = users.map((each) => {
        return new IssuedBook(each);
    });

    if(issuedBooks.length === 0){
        return res.status(404).json({
            success: false,
            message: "No Books issued yet"
        })
    }

    res.status(200).json({
        success: true,
        data: issuedBooks
    });
};

// router.post('/', (req, res)=>{
//     // req.body should have the following fields
//     const {id, name, author, genre, price, publisher } = req.body;

//     // Check if all the required fields are present
//     if(!id || !name || !author || !genre || !price || !publisher){  
//         return res.status(400).json({
//             success: false,
//             message: "Please provide all the required fields"
//         })
//     }

//     // Check if the book already exists
//     const book = books.find((each)=>each.id === id)
//     if(book){
//         return res.status(409).json({
//             success: false,
//             message: `Book Already Exists with id: ${id}` 
//         })
//     }

//     // Add the new book to the books array
//     books.push({id, name, author, genre, price, publisher});

//     res.status(201).json({
//         success: true,
//         message: "Book added successfully",
//         data: {id, name, author, genre, price, publisher}
//     })          
// })
exports.addNewBook = async(req, res) => {
    const {data} = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success: false,
            message: "Please provide the data to add a new book"
        })
    }

    await BookModel.create(data);
    // res.status(201).json({
    //     success: true,
    //     message: "Book added successfully",
    //     data: data
    // })

    const allBooks = await BookModel.find();
    res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: allBooks
    }); 
}

// router.put('/:id', (req, res)=> {
//     const {id} = req.params;
//     const {data} = req.body;
    
//     // if(!data || Object.keys(data).length === 0){
//     //     return res.status(400).json({
//     //         success: false,
//     //         message: "Please provide the data to update"
//     //     })
//     // }

//     // Check if the book exists
//     const book = books.find((each)=>each.id === id)
//    if(!book){
//        return res.status(404).json({
//            success: false,
//            message: `Book Not Found for id: ${id}`
//        })
//    }

//    // Update the book details
// //    Object.assign(book, data);

    // const updatedBook = books.map((each) => {
    //    if (each.id === id) {
    //        return {...each, ...data};
    //    }
    //    return each;
// });     

//    res.status(200).json({
//        success: true,
//        message: "Book Updated Successfully",
//        data: updatedBook
//    })
// })
exports.updateBookById = async(req, res) => {
    const {id} = req.params;
    const {data} = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success: false,
            message: "Please provide the data to update"
        })
    }

//     // Check if the book exists
//     const book = await BookModel.findById(id);
//    if(!book){
//        return res.status(404).json({
//            success: false,
//            message: `Book Not Found for id: ${id}`
//        })
//    }

//    // Update the book details
//    Object.assign(book, data);
//    await book.save();

//    res.status(200).json({
//        success: true,
//        message: "Book Updated Successfully",
//        data: book
//    })

const updatedBook = await BookModel.findOneAndUpdate(
        {_id: id},
       data,
       {new: true}
    );

    if(!updatedBook){
        return res.status(404).json({
            success: false,
            message: `Book Not Found for id: ${id}`
        })
    }

    res.status(200).json({
        success: true,
        message: "Book Updated Successfully",
        data: updatedBook
    })
}

exports.deleteBookById = async(req, res) => {
    const {id} = req.params;

    // Check if the book exists
    const book = await BookModel.findById(id);
    if(!book){
        return res.status(404).json({
            success: false,
            message: `Book Not Found for id: ${id}`
        })
    }

    await BookModel.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Book Deleted Successfully"
    })
}