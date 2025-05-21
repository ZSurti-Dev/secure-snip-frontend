SecureSnip
SecureSnip is a web app for creating, sharing, and viewing encrypted messages via QR codes.
Technologies Used

Frontend: React (TypeScript), React Router, Axios, QRCode.react, Framer Motion, Tailwind CSS  
Backend: Node.js, Express, MongoDB (Mongoose), bcrypt, crypto  
Deployment: Vercel (Frontend), Render (Backend)  
Environment: dotenv

Setup

Clone the repo: git clone <repository-url>
Backend:
Navigate to the backend folder: cd backend
Install dependencies: npm install
Set up .env with MONGO_URI and ENCRYPTION_KEY
Run the server: npm start


Frontend:
Navigate to the frontend folder: cd frontend
Install dependencies: npm install
Set up .env with VITE_API_URL and VITE_BASE_URL
Run the app: npm run dev



Usage

Visit the app URL (e.g., https://secure-snip.vercel.app).
Create Snippet:
Go to "Create Secure Snippet."
Enter title, message, password (min 5 chars), and optional tags.
Submit to generate a QR code.


Share/Download QR:
On the QR details page, download or share the QR code.


View Snippet:
Scan the QR code or navigate to /view/:id.
Enter the password to decrypt and view the message.


Delete Snippet:
On the view page, click "Delete" to remove the snippet.



Notes

Ensure MongoDB is running for backend data storage.
The app uses encryption for secure message storage.

