import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

const QrDetails: React.FC = () => {
  const location = useLocation();
  const { title, id } = location.state || {};
  const qrRef = useRef<HTMLCanvasElement>(null);

  // URL to encode in the QR code
  const qrCodeUrl = `${window.location.origin}/view?id=${id}`;

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'qrcode'}.png`;
      link.click();
    }
  };

  const shareQRCode = async () => {
    const canvas = qrRef.current;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'SecureSnip QR Code',
          text: 'Scan this QR code to view the secure message.',
        });
      } else {
        alert('Sharing is not supported on this device.');
      }
    }
  };

  return (
    <div className="flex justify-center items-start px-4 py-6 min-h-screen">
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-5">{title || 'Untitled Snippet'}</h2>
        <div className="flex justify-center mb-4">
          <QRCodeCanvas value={qrCodeUrl} size={200} ref={qrRef} />
        </div>
        <button
          onClick={downloadQRCode}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg mb-2"
        >
          Download QR Code
        </button>
        <button
          onClick={shareQRCode}
          className="w-full py-3 bg-[#0C4AD3] hover:bg-[#023DBF] text-white rounded-lg mb-2"
        >
          Share QR Code
        </button>
        <Link to="/snippets">
          <button className="w-full py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default QrDetails;