'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getTicketById, cancelTicket } from '../../../utils/ticketApi';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import Loading from '../../components/Loading';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (user && params.ticketId) {
      fetchTicket();
    }
  }, [user, params.ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await getTicketById(params.ticketId);
      setTicket(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (!confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }

    try {
      setCancelling(true);
      await cancelTicket(params.ticketId);
      alert('Ticket cancelled successfully');
      fetchTicket(); // Refresh ticket data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel ticket');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Please log in to view this ticket
          </h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Loading />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {error || 'Ticket not found'}
          </h1>
          <button
            onClick={() => router.push('/tickets')}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-8 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.push('/tickets')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Tickets
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Ticket Header */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {ticket.event?.title}
                  </h1>
                  <p className="text-red-100">Ticket ID: {ticket.ticketId}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Event Date & Time
                  </h3>
                  <p className="text-lg text-gray-900">
                    {formatDate(ticket.event?.eventDate)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Location
                  </h3>
                  <p className="text-lg text-gray-900">
                    {ticket.event?.location}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Ticket Holder
                  </h3>
                  <p className="text-lg text-gray-900">{ticket.user?.name}</p>
                  <p className="text-sm text-gray-600">{ticket.user?.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Issued On
                  </h3>
                  <p className="text-lg text-gray-900">
                    {formatDate(ticket.issuedAt || ticket.createdAt)}
                  </p>
                </div>
              </div>

              {ticket.event?.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Event Description
                  </h3>
                  <p className="text-gray-700">{ticket.event.description}</p>
                </div>
              )}

              {/* Expiration Warning */}
              {ticket.status === 'expired' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        This ticket has expired. The event date has passed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          {ticket.qrCode && ticket.status === 'active' && (
            <div className="mb-6">
              <QRCodeDisplay qrCode={ticket.qrCode} ticketId={ticket.ticketId} />
            </div>
          )}

          {/* Action Buttons */}
          {ticket.status === 'active' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <button
                onClick={handleCancelTicket}
                disabled={cancelling}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Ticket'}
              </button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Cancelling will restore the seat availability
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
