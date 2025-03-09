# <a href="https://modernize-nextjs-free.vercel.app/?ref=5">Modernize-nextjs-free</a>
Modernize Free Next.js 14 Admin Template with Material Ui + Typescript 
<!-- Place this tag where you want the button to render. -->
<a class="github-button" href="https://github.com/adminmart/Modernize-Nextjs-Free" data-color-scheme="no-preference: light; light: light; dark: dark;" data-icon="octicon-star" data-size="large" aria-label="Star adminmart/Modernize-Nextjs-Free on GitHub">Give a Star</a>
<!-- Main image of Template -->

  <img src="https://adminmart.com/wp-content/uploads/2023/03/modernize-free-next-js-admin-template.png" />



# PostgreSQL Installation and Configuration Guide

## 1. Install PostgreSQL

### **For Windows:**
1. Download PostgreSQL from the official website: [PostgreSQL Downloads](https://www.postgresql.org/download/)
2. Run the installer and follow the setup wizard.
3. During installation, set a password for the `postgres` user.
4. Ensure that the **pgAdmin** and **PostgreSQL Server** components are installed.
5. After installation, add PostgreSQL to the system PATH (if not automatically added).

### **For MacOS (Using Homebrew):**
```sh
brew install postgresql
```

### **For Linux (Debian/Ubuntu-based):**
```sh
sudo apt update
sudo apt install postgresql postgresql-contrib
```

## 2. Start and Enable PostgreSQL Service

### **Windows:**
PostgreSQL runs as a background service by default. You can start/stop it using **pgAdmin** or the Windows Services Manager.

### **MacOS/Linux:**
```sh
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 3. Change PostgreSQL Password
If you need to set or change the password for the `postgres` user, follow these steps:

### **Access PostgreSQL:**
```sh
sudo -u postgres psql
```

### **Change Password to your preferences:**
```sql
ALTER USER postgres PASSWORD 'dechen@24';
```

### **Exit PostgreSQL:**
```sql
\q
```

## 4. Configure `.env` File
Make sure your `.env` file contains the correct database connection URL:

```env
DATABASE_URL="postgresql://postgres:dechen@24@localhost:5432/Newedgedb"
```

## 5. Install Prisma and Initialize
If you haven't already installed Prisma, run the following commands:

### **Install Prisma CLI:**
```sh
npm install prisma --save-dev
```

### **Initialize Prisma:**
```sh
npx prisma init
```

This will create a `prisma` folder with a `schema.prisma` file. Modify the `schema.prisma` file to use your database:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 6. Run Database Migrations
After setting up Prisma, apply the schema changes to the database:

```sh
npx prisma migrate dev --name init
```

## 7. Run Prisma Studio
To visualize and manage the database in a GUI:

```sh
npx prisma studio
```

## 8. Start Development Server
Run your Node.js application with the following command:

```sh
npm run dev
```


