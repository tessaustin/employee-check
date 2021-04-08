const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: '9217',
        database: 'employee'
    },
    console.log('Connected to the employee database.')
);

start();

///////Functions///////

function start() {
    inquirer
        .prompt({
            type: "list",
            name: "option",
            message: "What would you like to do?",
            choices: [
                "View Department",
                "View Role",
                "View Employee",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(function (result) {
            console.log("You chose: " + result.option);
            switch (result.option) {
                case "View Department":
                    viewDepartment();
                    break;
                case "View Role":
                    viewRole();
                    break;
                case "View Employee":
                    viewEmployee();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}



// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
