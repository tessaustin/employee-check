USE employee;

INSERT INTO department
    (name)
VALUES
    ("Human Resources"),
    ("Mountain Operations"),
    ("Snow Safety"),
    ("Food Services"),
    ("Retail");

INSERT INTO role
    (title, salary, department_id)
VALUES  
    ("recruiter", 45000, 1),
    ("Lift Operator", 25000, 2),
    ("Ski Patrol", 35000, 3),
    ("Chef", 30000, 4),
    ("Manager", 40000, 5),
    ("Cook", 28000, 4),
    ("Cashier", 21000, 5),
    ("Supervisor", 58000, 3),
    ("Manager", 32000, 2),
    ("Compensation", 38000, 1);
