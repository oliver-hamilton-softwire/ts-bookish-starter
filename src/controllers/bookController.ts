import { Router, Request, Response } from 'express';

var Connection = require('tedious').Connection;

var CONFIG = {
    server: "localhost", // or "localhost"
    options: {
        trustServerCertificate: true,
        port: 1434
    },
    authentication: {
      type: "default",
      options: {  
        userName: "oliver",
        password: "FleeingTiger97",
      }
    }
  };


function executeStatement(connection, statement) {
        var Request = require('tedious').Request;

        const request = new Request(statement, function(err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' rows');
            // and we close the connection
            connection.close()
        }
        });

        return new Promise((resolve, reject) => {
            const books = [];

            request.on('row', function(columns) {
                const book = {};
                columns.forEach(function(column) {
                    book[column.metadata.colName] = column.value;
                });
                books.push(book);
            });

            request.on('doneProc', () => {
                // console.log(books);
                resolve(books);
            });

        connection.execSql(request);
        })

        
        // console.log(books);
    }

class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getBooks.bind(this));
        this.router.get('/:id', this.getBook.bind(this));
        this.router.post('/', this.createBook.bind(this));
    }

    runAgainstDb(statement, callback) {
        var connection = new Connection(CONFIG);
        // Setup event handler when the connection is established. 
        connection.on('connect', async function(err) {
            if(err) {
            console.log('Error: ', err)
            }
            // If no error, then good to go...
            const sqlRetValue = await executeStatement(connection, statement);
            return callback(sqlRetValue);
        });

        // Initialize the connection.
        connection.connect();
    }

    getBooks(req: Request, res: Response) {
        const statement = "SELECT * FROM Books";
        return this.runAgainstDb(statement, (sqlRetValue) => res.status(200).json(sqlRetValue));
    }

    getBook(req: Request, res: Response) {
        // TODO: implement functionality
        // return res.status(500).json({
        //     error: 'server_error',
        //     error_description: 'Endpoint not implemented yet.',
        // });
        const isbn = req.params.id;
        const statement = `SELECT * FROM Books WHERE isbn = ${isbn}`;
        return this.runAgainstDb(statement, (sqlRetValue) => res.status(200).json(sqlRetValue));
    }

    createBook(req: Request, res: Response) {
        // TODO: implement functionality
        console.log(req.headers);
        console.log(req.body);
        return res.status(201).json(req.body);
        // return res.status(201).json({
        //     error: 'server_error',
        //     error_description: 'Endpoint not implemented yet.',
        // });
    }
}

export default new BookController().router;
