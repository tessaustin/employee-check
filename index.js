const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { response } = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const connection = mysql.createConnection(
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
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewRole() {
    const sql = "SELECT * FROM roles";
    connection.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewEmployee() {
    const sql = `SELECT employees.id, 
                employees.first_name, 
                employees.last_name, 
                roles.title, 
                departments.name AS 'department', 
                roles.salary,
                employees.manager_id
                FROM employees, roles, departments 
                WHERE departments.id = roles.department_id 
                AND roles.id = employees.role_id
                ORDER BY employees.id ASC`;
    connection.query(sql, (err, res) => {
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
            name: "newDepartment"
        })
        .then((res) => {
            const sql = `INSERT INTO departments (name) VALUES (?)`;
            connection.query(sql, res.newDepartment, (err, res) => {
                console.log(`Department successfully created!`);
                if (err) throw err;
                console.table(res);
                viewDepartment();
            });
        });
};

function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What job title are you adding?",
                name: "newRole"
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
            const sql = `INSERT INTO roles (title, salary, department_id) VALUE(?,?,?)`;
            let info = [res.newRole, res.salary, res.departmentID];
            connection.query(sql, info, (err, res) => {
                console.log(`Role successfully created!`);
                if (err) throw err;
                console.table(res);
                viewRole();
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
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUE(?,?,?,?)`;
            let infoTwo = [res.firstName, res.lastName, res.roleID, res.managerID];
            connection.query(sql, infoTwo, (err, res) => {
                console.log(`Employee successfully created!`);
                if (err) throw err;
                console.table(res);
                viewEmployee();
            });
        });
}

///////Update Function///////
function updateRole() {
    /* const sql = /* "SELECT id, first_name, last_name, role_id  FROM employees"; */ 
    const sql = "SELECT * FROM employees";
    connection.query(sql, (err, res) => {
        console.table(res);
        if (err) throw err;
/*         console.table(res); */
        let employeeNamesArr = [];
        res.forEach((employees) => {
            /* employeeNamesArr.push(`${employees.first_name} ${employees.last_name}`); */
            employeeNamesArr.push(`${employees.id}`);
        });

        let sql = `SELECT roles.id, roles.title FROM roles`;
        connection.query(sql, (error, res) => {
            console.table(res);
            if (error) throw error;
            let rolesArr = [];
            res.forEach((role) => { rolesArr.push(role.id); });

            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Update employee:",
                        name: "pickEmployee",
                        choices: employeeNamesArr
                    },
                    {
                        type: "list",
                        message: "New role:",
                        name: "pickRole",
                        choices: rolesArr
                    }
                ])
                .then((res) => {
                    console.log(res);
                    const sql = `UPDATE employees SET employees.role_id = ? WHERE employees.id = ?`;
                    let update = [res.pickEmployee, res.pickRole];
                    connection.query(sql, update, (err, res) => {
                        console.log(`Employee successfully updated!`);
                        if (err) throw err;
                        console.table(res);
                        viewEmployee();
                    })
                });
        });
    });
}
