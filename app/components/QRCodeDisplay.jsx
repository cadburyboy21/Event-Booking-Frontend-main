'use client';

import React from 'react';

export default function QRCodeDisplay({ qrCode, ticketId }) {
  const handleDownload = () => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `ticket-${ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (typeof window === 'undefined') return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket ${ticketId}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .ticket-print {
              text-align: center;
              padding: 20px;
            }
            img {
              max-width: 400px;
              margin: 20px 0;
            }
            h2 {
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="ticket-print">
            <h2>Event Ticket</h2>
            <p>Ticket ID: ${ticketId}</p>
            <img src="${qrCode}" alt="QR Code" />
            <p>Scan this QR code at the event entrance</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          QR Code
        </h3>

        {/* QR Code Image */}
        <div className="bg-white p-4 rounded-lg border-4 border-gray-200 mb-6">
          <img
            src={qrCode}
            alt="Ticket QR Code"
            className="w-64 h-64 md:w-80 md:h-80"
          />
        </div>

        <p className="text-sm text-gray-600 text-center mb-6">
          Scan this QR code at the event entrance for verification
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
