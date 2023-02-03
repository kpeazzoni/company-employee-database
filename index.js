
const { default: inquirer } = require("inquirer");
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;


const utils = require("util");
db.query = utils.promisify(db.query);
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'classlist_db'
  },
  console.log(`Connected to the classlist_db database.`)
);

// delcaring globally scoped variables for db.queries
const roles = db.query`SELECT role_id, role_title, role_salary FROM roles;`
const employees = db.query`SELECT employee_id, first_name, last_name, role_id, department_id, salaries, managers FROM employee`
const departments = db.query`SELECT department_name, department_id FROM department`



function loadMainQuestions() {
  inquirer.prompt[{
    type: 'list',
    name: 'action',
    message: 'what would you like to do?',
    choices: ['View All departments', 'View all roles', 'View all employees', 'Add department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
  }].then((res) => {
    switch (res.action) {
      case 'View all departments':
        departments;
        break;
      case 'View all roles':
        roles;
        break;
      case 'View all employees':
        employees;
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
    }
  })
};

async function addDepartment() {

  inquirer.prompt([{
    type: 'input',
    name: 'newDepartment',
    message: 'What is the name of the new department?'
  }]);
  const newDept = await db.query(`INSERT INTO departments (name) VALUES ${answer.newDepartment}`)
  console.table(newDept);
  loadMainQuestions();
};

async function addRole() {

  inquirer.prompt([
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
      choices: departments
    },
  ]);
  const newRole = await db.query(`INSERT INTO roles (title) VALUES (${answer.newRole} ${answer.salary} ${answer.department})`)
  console.table(newRole);
  loadMainQuestions();
};
async function addEmployee() {

  inquirer.prompt([
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
      choices: roles
    },
    {
      type: 'list',
      name: 'newMan',
      message: 'Who is the manager of the new employee?',
      choices: employees
    },
  ]);
  const newEmployee = await db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${answer.newFirst} ${answer.newLast} ${answer.newRole}${answer.newMan}`)
  console.table(newEmployee);
  loadMainQuestions();
}

async function updateEmployee() {
  const sql = `SELECT first_name, last_name, id FROM employee`;
  const employeeResult = await db.query(sql);
  const updateEmployee = employeeResult.map(({ id, first_name, last_name }) => ({
    value: id,
    name: `${first_name} ${last_name}`,
  }))
  const roleResult = await db.query(`SELECT * FROM roles`)
  let finalRoles = roleResult.map(({ id, title }) => ({
    value: id,
    name: `${title}`,
  }))
  const answer = inquirer.prompt(
    {
      type: 'list',
      name: 'employee_id',
      message: 'Which employee employee do you want to update?',
      choices: employees,
    },
    {
      type: 'list',
      name: 'role',
      message: 'updated role',
      choices: roles,
    })
  let updateSQL = `UPDATE employee SET role_id = ${answer.role} WHERE id = ${anwer.employee.id}`
  console.table(updateSQL, updateEmployee, finalRoles);

  await db.query(updateSQL)
  console.log('updated....')
  try {
  } catch (error) {
    console.log(error)
  }
  loadMainQuestions();
};

