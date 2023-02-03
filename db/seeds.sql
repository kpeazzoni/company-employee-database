USE business_db

INSERT INTO departments (name)
VALUES ("Receptionist"),
       ("Sales"),
       ("Quality Assurance"),
       ("Accounting"),
       ("Human Resources"),
       ("World's Best Boss");

INSERT INTO role (title, salary, department_id)
VALUES ('Lead Receptionist', 40000, 01),
       ('Sales Lead', 80000, 02),
       ('QA Rep', 55000, 03),
       ('Accountant', 90000, 04),
       ('HR Rep', 65000, 05),
       ('Boss AKA Manager', 95000, 06);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Pam','Beasley', 01),
       ('Dwight', 'Schrute', 02),
       ('Greed', 'Bratton', 03),
       ('Oscar', 'Martinez', 04),
       ('Toby', 'Flenderson', 05),
       ('Michael', 'Scott', 06);