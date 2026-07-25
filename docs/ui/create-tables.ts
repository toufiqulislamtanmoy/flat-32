import { pool } from "../config/database.js";



(async () => {
  try {
    // Roles
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_title VARCHAR(100) NOT NULL,
        priority INT DEFAULT 0
      ) ENGINE=InnoDB;
    `);

    // Users
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        fullname VARCHAR(255),
        profile_picture VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        email_address VARCHAR(255) NOT NULL UNIQUE,
        role_id INT NOT NULL,
        is_disabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_users_role
          FOREIGN KEY (role_id)
          REFERENCES roles(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);

    // Permissions
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        access_level VARCHAR(100) NOT NULL,
        priority INT DEFAULT 0
      ) ENGINE=InnoDB;
    `);

    // Plans
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        user_id INT NOT NULL,
        amount VARCHAR(255),
        balance VARCHAR(255),
        expanse VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_plans_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // Plan Members
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS plan_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_id INT NOT NULL,
        user_id INT NOT NULL,
        permission_id INT NOT NULL,
        CONSTRAINT fk_plan_members_plan
          FOREIGN KEY (plan_id)
          REFERENCES plans(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT fk_plan_members_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT fk_plan_members_permission
          FOREIGN KEY (permission_id)
          REFERENCES permissions(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);

    // Entry Types
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS entry_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        entry_title VARCHAR(100) NOT NULL,
        priority INT DEFAULT 0
      ) ENGINE=InnoDB;
    `);

    // Meal Entries
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS meal_entry (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        date DATE NOT NULL,
        details TEXT,
        user_id INT NOT NULL,
        plan_id INT NOT NULL,
        entry_type_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_meal_entry_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT fk_meal_entry_plan
          FOREIGN KEY (plan_id)
          REFERENCES plans(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        CONSTRAINT fk_meal_entry_type
          FOREIGN KEY (entry_type_id)
          REFERENCES entry_type(id)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);

    console.log("All tables created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Failed to create tables", err);
    process.exit(1);
  }
})();