import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Starting in-process Vite dev server...');
  const server = await createServer({
    configFile: path.join(__dirname, 'vite.config.js'),
    root: __dirname,
    server: { port: 5173 },
  });
  await server.listen();
  console.log('Vite server running at http://localhost:5173');

  console.log('Launching Chrome with puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    // 1. Screen 1: Login Page
    console.log('1. Capturing Screen 1: Login Page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await wait(800);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screen-1-login.png'),
    });
    console.log('✔ Saved screenshots/screen-1-login.png');

    // Authenticate session in localStorage
    console.log('Authenticating simulated session...');
    await page.evaluate(() => {
      const user = {
        id: 'usr-1',
        name: 'Mr. Emmanuel Mugabo',
        email: 'teacher@intango.ac.rw',
        role: 'Lead DSE Instructor',
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('intango_auth_user', JSON.stringify(user));
    });

    // 2. Screen 2: Dashboard
    console.log('2. Capturing Screen 2: Dashboard...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    await wait(1800); // allow Chart.js animation
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screen-2-dashboard.png'),
    });
    console.log('✔ Saved screenshots/screen-2-dashboard.png');

    // 3. Screen 3: Add Student
    console.log('3. Capturing Screen 3: Add Student...');
    await page.goto('http://localhost:5173/add-student', { waitUntil: 'networkidle0' });
    await wait(800);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screen-3-add-student.png'),
    });
    console.log('✔ Saved screenshots/screen-3-add-student.png');

    // 4. Screen 4: Student List
    console.log('4. Capturing Screen 4: Student List...');
    await page.goto('http://localhost:5173/students', { waitUntil: 'networkidle0' });
    await wait(800);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screen-4-student-list.png'),
    });
    console.log('✔ Saved screenshots/screen-4-student-list.png');

    // 5. Screen 5: Student Details
    console.log('5. Capturing Screen 5: Student Details...');
    await page.goto('http://localhost:5173/students/INT-2026-001', { waitUntil: 'networkidle0' });
    await wait(800);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screen-5-student-details.png'),
    });
    console.log('✔ Saved screenshots/screen-5-student-details.png');

    // 6. Screen 6: Reports
    console.log('6. Capturing Screen 6: Reports...');
    await page.goto('http://localhost:5173/reports', { waitUntil: 'networkidle0' });
    await wait(1800); // allow Chart.js animation
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'screen-6-reports.png'),
    });
    console.log('✔ Saved screenshots/screen-6-reports.png');

    console.log('\n🎉 ALL SIX SCREENS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during screen capture:', err);
  } finally {
    await browser.close();
    await server.close();
    process.exit(0);
  }
}

run();
