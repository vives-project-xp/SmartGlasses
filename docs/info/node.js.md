# Node.js Reference Guide

![node.js logo](../assets/node.js_logo.png)
## What is Node.js?

Node.js is a [**JavaScript runtime**](https://nodejs.org/en/about/) built on the [**V8 engine**](https://nodejs.org/en/learn/getting-started/the-v8-javascript-engine), the same engine that powers Google Chrome. Instead of running JavaScript inside a browser, Node.js allows you to run JavaScript directly on your machine as a backend or scripting environment.

It was designed around a simple but powerful idea: [**non-blocking, event‑driven I/O**](https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking). This lets Node.js handle massive numbers of concurrent connections with very little overhead.

Node.js powers everything from tiny automation scripts to full-scale backend servers and real-time platforms.

!!! warning
	This file serves as a reference for understanding node.js. For installation or setup, see the [Getting Started](../Getting%20Started/README.md) folder.
---

## Why use Node.js?

* Run JavaScript outside the browser.
* Build fast, scalable network applications.
* Handle thousands of concurrent requests efficiently.
* Use one language for both frontend and backend.
* Massive ecosystem through **npm**, the world’s largest package registry.
* Perfect for real‑time systems (chat apps, live dashboards, IoT).
* Plays well inside CI/CD pipelines.
* Lightweight and highly portable.

Node.js modernizes the full-stack JavaScript workflow by giving developers a simple, powerful backend environment.

---

## Project Structure

A typical Node.js project uses a `package.json` file in the project root. This file describes:

* dependencies
* scripts
* metadata
* engine version
* configuration for tools and frameworks

Here is an example `package.json`:

```json
{
  "name": "example-node-project",
  "version": "1.0.0",
  "description": "Simple Node.js example project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.19.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  },
  "engines": {
    "node": ">=18"
  }
}
```

This file acts as the configuration backbone of your Node.js project.

---

## Running Node.js Scripts

A Node.js application starts with a simple JavaScript file. For example, `index.js`:

```javascript
console.log("Hello from Node.js!");
```

Run it using:

```bash
node index.js
```

Or use a development watcher like `nodemon`:

```bash
npx nodemon index.js
```

---

## Node.js Modules and Packages

Node.js uses a module system. You can load modules using:

```javascript
const fs = require("fs");
```

or ES module syntax:

```javascript
import fs from "fs";
```

To install packages from npm:

```bash
npm install express
```

This installs the package into the `node_modules` folder and registers it in `package.json`.

---

## Express.js — the most common Node.js server

A minimal Express server:

```javascript
import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```
-	`import express from "express";` — Import the Express module.

-	`const app = express();` — Create an Express application.

-	`const port = 3000;` — Define the port number (3000).

-	`app.get("/", (req, res) => { ... });` — Define a route for GET requests to the root URL.

- `res.send("Hello from Express!");` — Send a response to the client (Hello from Express!).

-	`app.listen(port, () => { ... });` — Start the server on the specified port.

Run it via:

```bash
npm start
```

Or:

```bash
node index.js
```

---

## Node.js Package Management

### Check installed Node.js versions:

```bash
node -v # Check the installed Node.js version
npm -v # Check the installed npm version
```
### Install a package:

```bash
npm install <package-name> # Install a package and add it to package.json
```
  
### Uninstall a package:

```bash
npm uninstall <package-name> # Remove a package and update package.json
```

### Update packages:

```bash
npm update # Update all packages to their latest versions
```

### Install dev dependencies:

```bash
npm install nodemon --save-dev # Install nodemon as a development dependency
```

### Install a specific version:

```bash
npm install express@4.19.0 # Install a specific version of a package
```

---

## Node.js in Development vs Production

### Development

* Use hot‑reload tools like `nodemon`.
* Enable logging.
* Use environment variables via `.env`.

### Production

* Use `pm2` or Docker to run the server.
* Minimize debugging overhead.
* Use reverse proxies like Nginx.
* Configure environment variables securely.

Start a production process via PM2:

```bash
pm2 start index.js # Start the Node.js app with PM2
```

---

## Working With Environment Variables

Create a `.env` file:

```bash
PORT=3000 # Server port
API_KEY=my-secret-key # API key for authentication
```

Load it in your app using **dotenv**:

```bash
npm install dotenv # Install dotenv package
```

```javascript
import "dotenv/config"; //Load environment variables from .env file
console.log(process.env.PORT);  // Access the PORT variable
```

---

## Useful Node.js Commands — Reference

### General

| Command               | Description               |
| --------------------- | ------------------------- |
| `node <file>`         | Run a JavaScript file     |
| `node -v`            | Check Node.js version     |
| `npm -v`             | Check npm version         |
| `node --watch <file>` | Watch mode for Node 18+   |
| `npm init -y`            | Initialize a new project with default settings |
| `npm install` or `npm i`| Install all dependencies  |
| `npm run <script>`    | Run a custom script       |

### Package Management

| Command               | Description              |
| --------------------- | ------------------------ |
| `npm install <pkg>`   | Install a package        |
| `npm uninstall <pkg>` | Remove a package         |
| `npm update`          | Update outdated packages |
| `npm ls`              | List installed packages  |
| `npm outdated`        | Show outdated packages   |
| `npm audit`           | Check for vulnerabilities |
| `npm audit fix`      | Fix vulnerabilities      |
| `npm cache clean --force` | Clear npm cache          |
|

### Development Tools

| Tool               | Purpose                        |
| ------------------ | ------------------------------ |
| `nodemon`          | Restart app on file changes    |
| `pm2`              | Run Node.js in production      |
| `eslint`           | Lint and format code           |
| `vite` / `webpack` | Build frontend apps using Node |
| `dotenv`          | Load environment variables     |
| `ts-node`          | Run TypeScript files directly  |
| `jest`             | Testing framework for Node.js   |
| `supertest`        | HTTP assertions for testing     |
| `babel`           | Transpile modern JS for Node    |
| `prettier`        | Code formatter                  |

---

## Example: Creating a Basic Node.js Server

1. Create a project folder.
2. Initialize the project:

```bash
npm init -y
```

3. Install Express:

```bash
npm install express
```

4. Create `index.js`:

```javascript
import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Node.js server running!");
});

app.listen(port, () => console.log(`Server on ${port}`));
```

5. Start the server:

```bash
node index.js
```

6. Open your browser and go to:

```
http://localhost:3000
```

7. Enjoy your running Node.js backend!

---

## Best Practices

* ⚠️ Use environment variables for sensitive data.
* Keep dependencies updated.
* Separate routes, controllers, and services.
* Validate all external input.
* Use `async/await` for clean asynchronous code.
* Log errors clearly with tools like `winston`.
* Use TypeScript when scaling larger systems.

---

## Additional Resources

* [Node.js Documentation](https://nodejs.org/en/docs)
* [npm](https://www.npmjs.com/)
* [Express.js](https://expressjs.com/)
* [12 Factor App](https://12factor.net/)
* [W3Schools JavaScript Tutorial](https://www.w3schools.com/js/default.asp)
* [W3Schools Node.js Tutorial](https://www.w3schools.com/nodejs/default.asp)
