# Rest-Client

### Description

This is a browser-based REST Client developed to simplify API workflows. Quickly send reswitch between setups instantly, and never lose results with automatic request history.

### ✨ Features

- 🔐 Secure Authentication: Full user login and authorization powered by Firebase.
- 🚀 Powerful REST Client: Craft requests with any method, URL, headers, and body. Dynamically inject values using environment variables and generate code snippets in various languages for any request.
- 📊 History and analysis: Every request is automatically saved. Filter and search your history by date, HTTP method, or status code to quickly find and replay past requests.
- 🌍 Environment Variables: Create multiple environments with custom variables to manage different configurations
- 🇬🇧 Internationalization (i18n): Full support for both English and Russian languages.
- 🌙 Themes: Switch between light and dark themes.

### 🛠️ Tech Stack

- Frontend: React 18, TypeScript, Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- Backend, Auth & Database: Firebase (Authentication, Firestore)
- Deployment: Vercel
- Testing: Jest & React Testing Library
- Code Quality: ESLint, Prettier, Husky (for Git hooks)
- Package Manager: pnpm

### Prerequisites

This project requires Node.js (v18 or higher). The recommended package manager is pnpm.

1. Install Node.js (includes npm): Download from the official website
2. Install pnpm globally (if you haven't already):

```
npm install -g pnpm
```

3. Verify installations:

```
node --version
pnpm --version
```

4. Create a .env file in the root directory

```
NEXT_PUBLIC_API_KEY=AIzaSyDQAFC879YU9rhiOI0B9fTEdt0TVU4xis8
NEXT_PUBLIC_AUTH_DOMAIN=rest-client-app-c8844.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=rest-client-app-c8844
NEXT_PUBLIC_APP_ID=1:433521416875:web:0d5c0a5fdeaa303f44f5ee
NEXT_PUBLIC_SENDER_ID=433521416875
NEXT_PUBLIC_MEASUREMENT_ID=G-T3KHVLHZ1B
```

### Setup and Running

1. Clone the repository:
   ```
   git clone https://github.com/morven2018/rest-client-app.git
   ```
2. Navigate to the project directory:

   ```
   cd rest-client-app
   ```

3. Install dependencies using pnpm:

   ```
   pnpm install
   ```

4. Start the development server:
   ```
   pnpm dev
   ```
5. Build the project for production:
   ```
   pnpm build
   ```
6. Start production server:
   ```
   pnpm start
   ```
7. Run ESLint to check for linting issues and automatically fix them:
   ```
   pnpm lint
   ```
8. Format the codebase using Prettier:
   ```
   pnpm format:fix
   ```
9. Set up Git hooks (Husky):
   ```
   pnpm prepare
   ```
10. Run the test suite:
    ```
    pnpm test
    ```
11. Run the test suite and generate a code coverage report:
    ```
    pnpm test:coverage
    ```
12. Run tests in watch mode:
    ```
    pnpm test:watch
    ```

### Contributing

1. Fork the Project
   - Click the 'Fork' button at the top of the repository page to create your own copy.
2. Setup Your Local Environment
   - Clone your forked repository to your local machine:

   ```
   git clone https://github.com/your-username/rest-client-app.git
   cd rest-client-app
   ```

   - Install dependencies using pnpm (required):

   ```
   pnpm install
   ```

3. Create a Feature Branch
   - Create a new branch for your feature or fix. Use a clear naming convention:
4. Make Your Changes & Commit
   - Implement your feature or a bug fix
   - Commit your changes with a descriptive message
5. Push to Your Fork
6. Open a Pull Request (PR)
   - Go to the original repository and open a Pull Request from your branch to the `develop` branch.
   - Provide a clear title and description explaining the changes and their purpose.
