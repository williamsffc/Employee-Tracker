
INSERT INTO department (name)
VALUES ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal"),
    ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 90000, 1),
    ("Sales Person", 90900, 1),
    ("Lead Engineer", 10500, 2),
    ("Software Engineer", 120000, 2),
    ("Account Manager", 135000, 3),
    ("HR Assistant", 85000, 5),
    ("Legal Team Lead", 150000, 4),
    ("Lawyer", 250000, 4),
    ("Accountant", 130000, 3),
    ("Paralegal", 93000, 4);

INSERT INTO employee (last_name, first_name, role_id, manager_id)
VALUES ("Flores", "Will", 1, "Mike Delgado"),
    ("John", "Smith", 5, "Will Flores"),
    ("Legend", "Tim", 1, "Steph Simoms"),
    ("Simoms", "Speth", 2, "Steve Valentine"),
    ("Potter", "Harry", 3, "Mike Delgado"),
    ("Delgado", "Mike", 4, "Steph Simoms"),
    ("Lim", "Yen", 6, "Will Flores"),
    ("Steve", "Valentine", 7, "Steve Valentine"),
    ("Young", "Max", 8, "Steph Simoms"),
    ("Varka", "Hans", 10, "Mike Delgado"),
    ("Peters", "Pedro", 9, "Will Flores");

SELECT *
FROM employee;
SELECT *
FROM role;
SELECT *
FROM department;

-- DROP table employee;
-- DROP table role;
-- DROP table department;

SELECT id,
    first_name,
    last_name,
    role.title,
    department.name AS department,
    role.salary,
    manager_id AS manager
FROM employee
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON department.department_id = role.department_id;

-- by department
SELECT id,
    first_name,
    last_name,
    role.title
FROM employee
    LEFT JOIN role ON employee.role_id = role.role_id
    LEFT JOIN department ON department.department_id = role.department_id -- WHERE department.department_id = 1;
WHERE department.name = "Sales";

