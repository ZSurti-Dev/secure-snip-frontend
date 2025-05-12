import React from 'react';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  return (
    <div className="flex justify-center items-start px-4 py-6 min-h-screen">
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Help - How to Use SecureSnip</h2>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">1. Navigate to the App</h3>
          <p>Open SecureSnip in your browser (e.g., <a href="https://secure-snip.vercel.app" className="text-blue-600 underline">https://secure-snip.vercel.app</a> or <code>http://localhost:5173</code> for local testing).</p>

          <h3 className="text-lg font-semibold">2. Create a New Snippet</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Click <strong>"New Snippet"</strong> in the navbar or <strong>"Back to Home"</strong> then <strong>"Create Snippet"</strong>.</li>
            <li>Fill in the form:
              <ul className="list-circle pl-5 mt-1">
                <li><strong>Title</strong>: Enter a title (e.g., "Meeting Notes").</li>
                <li><strong>Message</strong>: Type your secure message.</li>
                <li><strong>Password</strong>: Set a password (minimum 5 characters).</li>
                <li><strong>Tags</strong>: Add optional tags (e.g., "Work, Personal") separated by commas.</li>
              </ul>
            </li>
            <li>Click <strong>"Generate QR Code"</strong>. If successful, confirm and continue.</li>
          </ul>

          <h3 className="text-lg font-semibold">3. View or Share the Snippet</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Click <strong>"Confirm and Continue"</strong> to see the QR code.</li>
            <li><strong>Download QR Code</strong>: Click the button to save the QR image.</li>
            <li><strong>Share QR Code</strong>: Click to share via supported devices.</li>
            <li>Scan the QR code with a device to access the snippet.</li>
          </ul>

          <h3 className="text-lg font-semibold">4. Access the Snippet</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>On the <strong>"View Snippet"</strong> page, enter the password.</li>
            <li>Click <strong>"Decrypt"</strong> to unlock the message (watch the lock animation).</li>
          </ul>

          <h3 className="text-lg font-semibold">5. Manage Snippets</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Go to <strong>"Home"</strong> in the navbar to see all snippets.</li>
            <li>Click <strong>"View Message"</strong> to access, or delete if needed.</li>
          </ul>

          <h3 className="text-lg font-semibold">6. Get Help</h3>
          <p>Click <strong>"Help"</strong> in the navbar for these instructions or troubleshooting.</p>

          <Link to="/snippets">
            <button className="mt-4 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;