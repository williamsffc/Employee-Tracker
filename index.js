var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "**Employee Tracker**",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Remove employee",
                "Update employee role",
                "Update employee manager",
                "-------------------------",
                "View all roles",
                "Add role",
                "Remove role",
                "-------------------------",
                "View all departments",
                "Add a department",
                "Remove a department",
                "-------------------------",
                "Quit",
                "-------------------------"
            ]
        })
        .then( answer => {
            switch (answer.action) {
                case "View all employees":
                    view_Employees();
                    break;

                case "View all employees by department":
                    employees_Department();
                    break;

                case "View all employees by manager":
                    employees_Manager();
                    break;

                case "Add employee":
                    add_Employee();
                    break;

                case "Remove employee":
                    remove_Employee();
                    break;

                case "Update employee role":
                    update_Role();
                    break;

                case "Update employee manager":
                    update_Manager();
                    break;

                case "View all roles":
                    view_Roles();
                    break;

                case "Add role":
                    add_Role();
                    break;

                case "Remove role":
                    remove_Role();
                    break;

                case "View all departments":
                    view_Departments();
                    break;

                case "Add a department":
                    add_Department();
                    break;

                case "Remove a department":
                    remove_Department();
                    break;

                case "Quit":
                    connection.end();
                    break;
            }
        });
}

function view_Employees() {
    var query = "SELECT id, first_name, last_name, role.title, department.name AS department, role.salary, "; 
    query += "manager_id AS manager FROM employee LEFT JOIN role ON employee.role_id = role.role_id ";
    query += "LEFT JOIN department ON department.department_id = role.department_id ";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log();
        console.log('-------> Here is the list of Employees:');
        console.log();
        console.table(res);
        runSearch();
    })
};

function employees_Department() {
    inquirer
        .prompt ({
            name: "department",
            type: "list",
            message: "What department would you like to search?",
            choices: [
                "Sales",
                "Engineering",
                "Finance",
                "Legal",
                "HR"
            ]
        })
        .then (function (answer) {
            var query = "SELECT id, first_name, last_name, role.title FROM employee ";
            query += "LEFT JOIN role ON employee.role_id = role.role_id ";
            query += "LEFT JOIN department ON department.department_id = role.department_id ";
            query += "WHERE department.name = ? ";

            connection.query(query, [answer.department], function (err, res) {

                if (err) throw err;
                console.log();
                console.log('-------> Here is the list of Employees by the "Department" you selected:');
                console.log();
                console.table(res);

                runSearch();
            })
        })
}

