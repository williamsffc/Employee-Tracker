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
        .then(answer => {
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

//// View all employees
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

/// Employee by department
function employees_Department() {
    inquirer
        .prompt({
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
        .then(function (answer) {
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

// "View all employees by manager":


function employees_Manager() {
    var query = "SELECT * FROM employee GROUP by manager_id ";

    connection.query(query, function (err, answer) {
        if (err) throw err

        inquirer
            .prompt(
                {
                    name: "employees_by_manager",
                    type: "list",
                    message: "Which manager do you want to see direct report for?",
                    choices: function () {
                        var byManager = [];

                        for (var i = 0; i < answer.length; i++) {
                            byManager.push(answer[i].manager_id)
                        }
                        return byManager;
                    }
                })
            .then(function (answer) {
                var query = "SELECT id, last_name, first_name, manager_id AS manager FROM employee where manager_id = ? ";

                connection.query(query, [answer.employees_by_manager],
                    function (err, res) {

                        if (err) throw err;

                        console.log();
                        console.log('-------> Here is the list of Employees of ' + answer.employees_by_manager + ' (Manager)');
                        console.log();
                        console.table(res);

                        runSearch();
                    })
            })


    })
}

// "Add employee":
function add_Employee() {
    var query = "SELECT id, first_name, last_name, role.title, manager_id ";
    query += "FROM employee LEFT JOIN role ON employee.role_id = role.role_id ";

    connection.query(query, function (err, results) {
        if (err) throw err

        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the employee's first name?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employee's role?",
                    choices: function () {
                        var roleArray = [];

                        for (var i = 0; i < results.length; i++) {
                            roleArray.push(results[i].title)
                            // console.log(results[i].title);
                        }
                        return roleArray;
                    }
                },
                {
                    name: "manager",
                    type: "list",
                    message: "who is the employee's manager?",
                    choices:
                        function () {
                            var managerArray = [];

                            for (var i = 0; i < results.length; i++) {
                                managerArray.push(results[i].manager_id)
                                // console.log(results[i].manager_id);
                            }
                            return managerArray;
                        }
                }
            ])
            .then(function (answer) {
                var query = "INSERT INTO employee SET ?";

                connection.query(query,
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        // title: answer.role,
                        // manager_id:answer.manager,
                    },
                    function (err) {
                        if (err) throw err;

                        console.log();
                        console.log('-------> A new employee has been added to the database:');
                        console.log()

                        runSearch();
                    });
            })
    })
};

// "Remove employee":
function remove_Employee() {

    var query = "SELECT first_name, last_name FROM employee";

    connection.query(query, function (err, answer) {
        if (err) throw err

        inquirer
            .prompt([
                {
                    name: "delete_employee",
                    type: "list",
                    message: "Which [Employee] would you like to remove?",
                    choices:
                        function () {
                            var deleteEmployee = [];

                            for (var i = 0; i < answer.length; i++) {
                                deleteEmployee.push(answer[i].last_name)
                            }
                            return deleteEmployee;
                        }
                }
            ])
            .then(function (answer) {

                var query = "DELETE FROM employee WHERE ?";
                connection.query(query, { last_name: answer.delete_employee },
                    function (err, answer) {
                        if (err) throw err;

                        console.log();
                        console.log('-------> Employee has been removed from the list:');
                        console.log();


                        runSearch();
                    });
            })
    })
}

// "Update employee role":
function update_Role() {

    var query = "SELECT  id, first_name, last_name, role.role_id, role.title FROM employee ";
    query += "LEFT JOIN role on employee.role_id = role.role_id ";

    connection.query(query, function (err, answer) {
        if (err) throw err

        inquirer
            .prompt([
                {
                    name: "employee_list",
                    type: "list",
                    message: "Which employee would you like to update the role for?",
                    choices: function () {
                        var employeeArray = [];

                        for (var i = 0; i < answer.length; i++) {
                            employeeArray.push(answer[i].last_name)
                        }
                        return employeeArray;
                    }
                },
                {
                    name: "role_list",
                    type: "list",
                    message: "what would the new role be (please choose below)?",
                    choices: function () {
                        var roleArray = [];

                        for (var i = 0; i < answer.length; i++) {
                            roleArray.push(answer[i].title)
                        }
                        return roleArray;

                    }
                }
            ])
            .then(function (answer) {

                var query = "UPDATE employee LEFT JOIN role on employee.role_id = role.role_id "; 
                query += "SET  ? WHERE  ?";

                connection.query(query,
                    [
                        { title: answer.role_list }, ,
                        { last_name: answer.employee_list }
                    ],
                    function (err, answer) {
                        if (err) throw err;

                        console.log();
                        console.log('-------> The role for the employee has been updated.')
                        console.log();

                        runSearch();
                    });
            })
    })

}

// "Update employee manager":
function update_Manager() {

    var query = "SELECT * FROM employee ";

    connection.query(query, function (err, answer) {
        if (err) throw err

        inquirer
            .prompt([
                {
                    name: "employee_list",
                    type: "list",
                    message: "Which employee's manager do you want to update?",
                    choices: function () {
                        var employeeArray = [];

                        for (var i = 0; i < answer.length; i++) {
                            employeeArray.push(answer[i].last_name)
                        }
                        return employeeArray;
                    }
                },
                {
                    name: "manager_list",
                    type: "list",
                    message: "Which employee do you want to set as manager for the selected employee?",
                    choices: function () {
                        var managerArray = [];

                        for (var i = 0; i < answer.length; i++) {
                            managerArray.push(answer[i].last_name)
                        }
                        return managerArray;
                    }
                },
            ])
            .then(function (answer) {

                var query = "UPDATE employee SET ? WHERE ? ";

                connection.query(query,[
                    {
                        last_name: answer.employee_list
                    },
                    {
                        last_name: answer.manager_list
                    }],
                    function (err, answer) {
                        if (err) throw err;

                        console.log();
                        console.log('-------> The manager for the employee has been updated.')
                        console.log();

                        runSearch();
                    });
            })
    })
}

// "View all roles":
function view_Roles() {
    var query = "SELECT role_id AS id, title, department.name AS department, salary FROM role ";
    query += "LEFT JOIN department on role.department_id = department.department_id ";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log();
        console.log('-------> Here is the list of all Roles:');
        console.log();
        console.table(res);

        runSearch();
    })
};

// "Add role":
function add_Role() {
    inquirer
        .prompt([
            {
                name: "new_role",
                type: "input",
                message: "What is the [name of the new role] you would like to add?",
            },
            {
                name: "new_role_salary",
                type: "input",
                message: "What would the salary be for this new role?",
            }
        ])
        .then(function (answer) {

            var query = "INSERT INTO role SET ? ";

            connection.query(query,
                {
                    title: answer.new_role,
                    salary: answer.new_role_salary,
                },
                function (err, res) {
                    if (err) throw err;

                    console.log(res.affectedRows);
                    console.log('-------> A new role has been added:');
                    console.log();
                    console.table(answer);

                    runSearch();
                });
        })
};

// "Remove role":
function remove_Role() {

    var query = "SELECT * FROM role";

    connection.query(query, function (err, answer) {
        if (err) throw err

        inquirer
            .prompt([
                {
                    name: "delete_role",
                    type: "list",
                    message: "What [role] would you like to delete?",
                    choices:
                        function () {
                            var deleteRole = [];

                            for (var i = 0; i < answer.length; i++) {
                                if (answer.delete_role === answer[i].name) {
                                    deleteRole.push(answer[i].title)
                                }
                            }
                            return deleteRole;
                        }
                }
            ])
            .then(function (answer) {

                var query = "DELETE FROM role WHERE ? ";
                connection.query(query, { title: answer.delete_role },
                    function (err, res) {
                        if (err) throw err;
                        console.log();
                        console.log('-------> The role of [' + answer.delete_role + '] has been deleted from the database:');
                        console.log();

                        runSearch();
                    })
            });
    });
};

// "View all departments":
function view_Departments() {
    var query = "SELECT name, SUM(salary) AS utilized_budget FROM department ";
    query += "LEFT JOIN role on role.department_id = department.department_id GROUP BY name ";

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log();
        console.log('-------> Here it is the list of all Departments:');
        console.log();
        console.table(res);

        runSearch();
    })
};

// "Add a department":
function add_Department() {
    inquirer
        .prompt([
            {
                name: "new_department",
                type: "input",
                message: "What is the [name of the new department] you would like to add?",
            }
        ])
        .then(function (answer) {

            var query = "INSERT INTO department SET ? ";
            connection.query(query, { name: answer.new_department },
                function (err, res) {
                    if (err) throw err;
                    console.log();
                    console.log('-------> A new department [' + answer.new_department + '] has been added:');
                    console.log();

                    runSearch();
                });
        })
};

// "Remove a department":
function remove_Department() {

    var query = "SELECT * FROM department ";

    connection.query(query, function (err, answer) {
        if (err) throw err

        inquirer
            .prompt([
                {
                    name: "delete_department",
                    type: "list",
                    message: "What [department] would you like to delete?",
                    choices:
                        function () {
                            var deleteDepartment = [];
                            for (var i = 0; i < answer.length; i++) {
                                if (answer.delete_department === answer[i].title) {
                                    deleteDepartment.push(answer[i].name)
                                }
                            }
                            return deleteDepartment;
                        }
                }
            ])
            .then(function (answer) {

                var query = "DELETE FROM department WHERE ? ";
                connection.query(query, { name: answer.delete_department },
                    function (err, res) {
                        if (err) throw err;
                        console.log();
                        console.log('-------> The department [' + answer.delete_department + '] has been deleted from the database:');
                        console.log();

                        runSearch();
                    })
            });
    });
};
