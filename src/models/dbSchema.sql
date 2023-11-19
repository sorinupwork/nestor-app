create database nestor_db;
use nestor_db;

CREATE TABLE people (
    person_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE grupuri (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    group_name VARCHAR(255) NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE group_people (
    group_id INT,
    person_id INT,
    PRIMARY KEY (group_id, person_id),
    FOREIGN KEY (group_id) REFERENCES grupuri(group_id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people(person_id) ON DELETE CASCADE
);

CREATE TABLE group_groups (
    parent_group_id INT,
    child_group_id INT,
    PRIMARY KEY (parent_group_id, child_group_id),
    FOREIGN KEY (parent_group_id) REFERENCES grupuri(group_id) ON DELETE CASCADE,
    FOREIGN KEY (child_group_id) REFERENCES grupuri(group_id) ON DELETE CASCADE
);

select * from people;
select * from grupuri;
select * from group_people;
select * from group_groups;

