USE business_db

INSERT INTO departments (name)
VALUES ("Receptionist"),
       ("Sales"),
       ("Quality Assurance"),
       ("Accounting"),
       ("Human Resources"),
       ("World's Best Boss");

INSERT INTO role (title, salary, department_id)
VALUES ('Lead Receptionist', 40000, 1),
       ('Sales Lead', 80000, 2),
       ('QA Rep', 55000, 3),
       ('Accountant', 90000, 4),
       ('HR Rep', 65000, 5),
       ('Boss AKA Manager', 95000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Michael', 'Scott', 6, NULL),
       ('Pam','Beasley', 1, 1),
       ('Dwight', 'Schrute', 2, 1),
       ('Greed', 'Bratton', 3, 1),
       ('Oscar', 'Martinez', 4, 1),
       ('Toby', 'Flenderson', 5, 1);