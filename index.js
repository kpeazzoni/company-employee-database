
const inquirer = require("inquirer");
const mysql = require('mysql2');
const express = require('express');
require('console.table');
const PORT = process.env.PORT || 3001;

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'business_db'
  },
  console.log(`Connected to the business_db database.`)
);

const utils = require("util");
db.query = utils.promisify(db.query);

// delcaring globally scoped variables for db.queries

async function viewRoles() {
  const roles = await db.query(`SELECT id, title, salary FROM role;`)
  console.table(roles)
  loadMainQuestions();
}
// line 38- joining employee.role_id (employee table) to ROLE TABLE ID something.something = table name.column name
async function viewEmployees() {
  const employees = await db.query(`SELECT employee.id, employee.first_name AS "first name", employee.last_name 
  AS "last name", role.title, departments.name AS department, role.salary, 
  concat(manager.first_name, " ", manager.last_name) AS manager
  FROM employee
  LEFT JOIN role
  ON employee.role_id = role.id 
  LEFT JOIN departments
  ON role.department_id = departments.id
  LEFT JOIN employee manager
  ON manager.id = employee.manager_id`)
  console.table(employees);
  loadMainQuestions();
}

async function viewDepartments() {
  const departments = await db.query(`SELECT name, id FROM departments`)
  console.table(departments);
  loadMainQuestions();
}


loadMainQuestions();

function loadMainQuestions() {
  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'what would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
  }]).then((res) => {
    switch (res.action) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        
        break;
      case 'Add department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployee();
        break;
      default:
        console.log('All Done!')
        process.exit();
    }
  })
};

async function addDepartment() {

  const answer = await inquirer.prompt([{
    type: 'input',
    name: 'newDepartment',
    message: 'What is the name of the new department?'
  }]);
  const newDept = await db.query(`INSERT INTO departments (name) VALUES ("${answer.newDepartment}")`)
  console.log(`Successfully added the ${answer.newDepartment} into departments`);
  loadMainQuestions();
};

async function addRole() {
  const roleResult = await db.query(`SELECT * FROM role`)
  let finalRoles = roleResult.map(({ id, title }) => ({
    value: id,
    name: `${title}`,
  }));

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'newRole',
      message: 'What is the role you would like to add?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary?'
    },
    {
      type: 'list',
      name: 'department',
      choices: finalRoles
    },
  ]);

  const newRole = await db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.newRole}", "${answer.salary}", "${answer.department}")`)
  console.table(newRole);
  loadMainQuestions();
};
async function addEmployee() {
  const roleResult = await db.query(`SELECT * FROM role`)
  let finalRoles = roleResult.map(({ id, title }) => ({
    value: id,
    name: `${title}`,
  }));
  const employeeResult = await db.query('SELECT * FROM employee');
  const updateEmployee = employeeResult.map(({ id, first_name, last_name }) => ({
    value: id,
    name: `${first_name} ${last_name}`,
  }))
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'newFirst',
      message: 'What is the first name of the employee?'
    },
    {
      type: 'input',
      name: 'newLast',
      message: 'What is the last name of the employee?'
    },
    {
      type: 'list',
      name: 'newRole',
      message: 'What is the role you would like to add?',
      choices: finalRoles
    },
    {
      type: 'list',
      name: 'newMan',
      message: 'Who is the manager of the new employee?',
      choices: updateEmployee
    },
  ]);
  const newEmployee = await db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.newFirst}", "${answer.newLast}", "${answer.newRole}", "${answer.newMan}")`)
  console.table(newEmployee);
  loadMainQuestions();

};

async function updateEmployee() {
  try {
    const employeeResult = await db.query(`SELECT first_name, last_name, id FROM employee`)
    const roleResult = await db.query('select title, id from role')

    const employees = employeeResult.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));

    const roles = roleResult.map(({ id, title }) => ({
      value: id,
      name: `${title}`,
    }));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: "Which employee's role do you want to update?",
        choices: employees,
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Updated role',
        choices: roles,
      },
    ])
    let updateSQL = `UPDATE employee SET role_id = "${answers.role_id}" 
    WHERE id = "${answers.employee_id}"`

    await db.query(updateSQL)
    console.log('Employee role is successfully updated....')
    loadMainQuestions()
  } catch (error) {
    console.log(error)
  }
};