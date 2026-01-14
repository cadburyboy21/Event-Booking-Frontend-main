// utils/ticketApi.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all tickets for logged-in user
export const getMyTickets = async () => {
  const response = await axios.get(`${API_URL}/api/tickets/my-tickets`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Get specific ticket by ID
export const getTicketById = async (ticketId) => {
  const response = await axios.get(`${API_URL}/api/tickets/${ticketId}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

// Cancel a ticket
export const cancelTicket = async (ticketId) => {
  const response = await axios.put(
    `${API_URL}/api/tickets/${ticketId}/cancel`,
    {},
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};

// Get organizer bookings
export const getOrganizerBookings = async () => {
  const response = await axios.get(`${API_URL}/api/tickets/organizer/bookings`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
