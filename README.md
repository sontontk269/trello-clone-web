🧩 Trello Clone
A Trello-inspired web application built with React, Redux, Material-UI, and Vite. It allows users to organize tasks, collaborate on projects, and manage boards efficiently.

🚀 Features
🔐 User Authentication: Register, login, and logout securely

🗂️ Board Management: Create, update, and delete project boards

📊 Column Management: Add, edit, and remove columns in each board

📝 Card Management: Add, edit, and delete cards in columns

🔔 Real-Time Notifications: Receive updates for invitations and actions

🎯 Drag & Drop: Reorder columns and cards using a smooth drag-and-drop interface

✍️ Markdown Support: Write rich-text descriptions for cards using markdown

📱 Responsive UI: Optimized for both desktop and mobile devices

🛠️ Tech Stack
🔧 Frontend
React — UI library

Redux Toolkit — State management

Material-UI — Component library with custom theming

React Hook Form — Form handling

Axios — API communication

Socket.IO — Real-time features

Vite — Fast build tool

🌐 Backend
Node.js — RESTful API server (via integration)

🚀 Deployment
Vercel — Frontend hosting

📁 Project Structure
bash
Copy
Edit
/src
┣ /assets # Static assets
┣ /apis # API calls (via Axios)
┣ /components # Reusable UI components
┣ /redux # Redux slices and related logic
┣ /pages # Route-level components
┣ /customHooks # Custom React hooks
┣ /customLibs # Custom libraries (Dnd kit)
┣ /utils # Utility functions/helpers

📦 Getting Started
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/trello-clone.git
cd trello-clone
Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm run dev
Open in browser:
Navigate to http://localhost:5173

📌 Notes
Ensure the backend server is running and properly connected to the frontend via environment variables.

You can configure the .env file for your API and Socket endpoints.
