const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");
const consoleTable = require("console.table");

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

///////Start function///////
function start() {
    inquirer
        .prompt({
            type: "list",
            name: "option",
            message: "Please select an option:",
            choices: [
                "View Departments",
                "View Roles",
                "View Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then((result) => {
            console.log("You chose: " + result.option);
            switch (result.option) {
                case "View Departments":
                    viewDepartment();
                    break;
                case "View Roles":
                    viewRole();
                    break;
                case "View Employees":
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

///////Functions to view///////
function viewDepartment() {
    const sql = "SELECT * FROM departments";
    connection.promise().query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewRole() {
    const sql = "SELECT * FROM roles";
    connection.promise().query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewEmployee() {
    const sql = "SELECT * FROM employees";
    connection.promise().query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

///////Functions to add to///////
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            message: " What department would you like to add?",
            name: "departments"
        })
        .then((res) => {
            const departments = res.department;
            const sql = `INSERT INTO department (name) VALUES("${departments}")`;
            connection.promise().query(sql, (err, res) => {
                if (err) throw err;
                console.table(res);
                start();
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What job title are you adding?",
                name: "title"
            },
            {
                type: "input",
                message: "Salary?",
                name: "salary"
            },
            {
                type: "input",
                message: "Deparment ID?",
                name: "departmentID"
            }
        ])
        .then((res) => {
            const title = res.title;
            const salary = res.salary;
            const departmentID = res.departmentID;
            const sql = `INSERT INTO role (title, salary, department_id) VALUE("${title}", "${salary}", "${departmentID}")`;
            connection.promise().query(sql, (err, res) => {
                if (err) throw err;
                console.table(res);
                start();
            });
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "Employee's last name?",
                name: "lastName"
            },
            {
                type: "input",
                message: "Employee's role ID?",
                name: "roleID"
            },
            {
                type: "input",
                message: "Employee's manager ID??",
                name: "managerID"
            }
        ])
        .then((res) => {
            const firstName = res.firstName;
            const lastName = res.lastName;
            const roleID = res.roleID;
            const managerID = res.managerID;
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE("${firstName}", "${lastName}", "${roleID}", "${managerID}")`;
            connection.promise().query(sql, (err, res) => {
                if (err) throw err;
                console.table(res);
                start();
            });
        });
}

///////Functions update///////











// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});