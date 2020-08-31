DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;
USE employee_trackerDB;

CREATE TABLE department (
    department_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (department_id)
);

CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(6, 2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id) REFERENCES department (department_id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    last_name VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (manager_id) REFERENCES role(department_id)
);

DROP table department;
DROP table role;
DROP table employee;

SELECT *
FROM employee;
SELECT *
FROM role;
SELECT *
FROM department;