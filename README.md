# BookItNow - Event Management System Frontend

A modern, premium-designed frontend for the Event Management System built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Role-Based Access Control**: Support for Users, Organizers, and Admins
- **Event Management**: Browse, create, and manage events
- **Booking System**: Book events and view tickets
- **Admin Dashboard**: Approve/reject events, view all bookings and users
- **Premium UI**: Dark theme with glassmorphism, gradients, and animations
- **Fully Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Authentication**: JWT with localStorage persistence

## 📦 Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔑 User Roles

### 1. User (Event Attendee)
- Browse and view events
- Book events
- View booking history
- Access: `/dashboard`

### 2. Organizer
- Create and manage events
- View event status (pending/approved/rejected)
- Track seat availability
- Access: `/organizer`

### 3. Admin
- Approve/reject events
- View all bookings
- Manage users
- Access: `/admin`

## 📁 Project Structure

```
app/
├── components/       # Reusable UI components
├── context/         # React Context (Auth)
├── lib/            # API services
├── admin/          # Admin dashboard
├── dashboard/      # User dashboard
├── events/         # Events pages
├── login/          # Login page
├── organizer/      # Organizer dashboard
├── register/       # Registration page
├── layout.tsx      # Root layout
├── page.tsx        # Landing page
└── globals.css     # Global styles
```

## 🎨 Design Features

- **Dark Theme**: Sleek slate-900/950 color scheme
- **Glassmorphism**: Frosted glass effects on cards
- **Gradient Backgrounds**: Vibrant blue-purple gradients
- **Micro-Animations**: Smooth transitions and hover effects
- **Custom Scrollbar**: Styled scrollbar matching the theme
- **Responsive Grid**: Mobile-first responsive layouts

## 🔌 API Integration

The frontend connects to the backend API at the URL specified in `NEXT_PUBLIC_API_URL`.

### API Services:
- `authApi.ts` - Authentication (login, register)
- `eventApi.ts` - Event operations (CRUD)
- `bookingApi.ts` - Booking operations
- `adminApi.ts` - Admin operations
- `organizerApi.ts` - Organizer operations

## 🧪 Testing

1. **Start Backend**: Ensure the backend server is running on port 5000
2. **Start Frontend**: Run `npm run dev`
3. **Test Flows**:
   - Register as User/Organizer
   - Login and explore role-based dashboards
   - Create events (as Organizer)
   - Approve events (as Admin)
   - Book events (as User)

## 📝 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🏗️ Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎯 Key Pages

- `/` - Landing page with featured events
- `/events` - All approved events
- `/events/[id]` - Event detail and booking
- `/login` - User login
- `/register` - User registration
- `/dashboard` - User bookings
- `/organizer` - Organizer dashboard
- `/organizer/create` - Create new event
- `/admin` - Admin dashboard

## 🤝 Contributing

This is a complete implementation of the Event Management System frontend. All core features are implemented and functional.

## 📄 License

This project is part of the Event Management System.
