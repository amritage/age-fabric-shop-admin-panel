# OTP Login Functionality

This document describes the OTP (One-Time Password) login functionality implemented in the admin panel.

## Overview

The OTP login system provides an alternative authentication method using email-based one-time passwords instead of traditional username/password login.

## Features

- **Email-based OTP**: Users enter their email address to receive a 6-digit OTP
- **Modal-based OTP Entry**: Clean modal interface for entering the OTP
- **Resend Functionality**: Users can resend OTP with a 60-second cooldown
- **Form Validation**: Client-side validation for email and OTP fields
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Works on all device sizes

## API Endpoints

The OTP functionality uses the following external API endpoints:

- **Request OTP**: `POST https://adorable-gentleness-production.up.railway.app/api/loginotp/request`
  - Body: `{ "email": "user@example.com" }`
  
- **Verify OTP**: `POST https://adorable-gentleness-production.up.railway.app/api/loginotp/verify`
  - Body: `{ "email": "user@example.com", "otp": "123456" }`

## File Structure

```
src/
├── app/
│   └── otplogin/
│       └── page.tsx                 # OTP login page
├── forms/
│   └── otp-login-form.tsx           # OTP login form component
└── redux/
    └── auth/
        └── otpApi.ts                # OTP API slice for Redux
```

## Usage

### Accessing OTP Login

Users can access the OTP login page at:
```
https://age-fabric-shop-admin-panel-production-ab86.up.railway.app/otplogin
```

### User Flow

1. **Email Entry**: User enters their email address
2. **OTP Request**: System sends OTP to the provided email
3. **Modal Display**: OTP entry modal appears with countdown timer
4. **OTP Entry**: User enters the 6-digit OTP
5. **Verification**: System verifies OTP and logs user in
6. **Redirect**: On success, user is redirected to dashboard

### Navigation

- **From Regular Login**: Link to OTP login available on `/login` page
- **From OTP Login**: Link to regular login available on `/otplogin` page

## Technical Implementation

### Redux Integration

The OTP functionality uses a separate Redux API slice (`otpApi`) with its own base URL to handle external API calls.

### Form Validation

- **Email**: Required, valid email format
- **OTP**: Required, exactly 6 digits

### Security Features

- **Countdown Timer**: Prevents spam OTP requests
- **Input Validation**: Client-side validation for all inputs
- **Error Handling**: Graceful error handling with user feedback

## Styling

The OTP login uses the existing design system:
- **Theme Colors**: Uses `theme` (#0989FF) and `themeDark` (#056ECE)
- **Button Styles**: `tp-btn` and `tp-btn-outline` classes
- **Responsive**: Mobile-first responsive design

## Error Messages

Common error scenarios and their user-friendly messages:
- Invalid email format
- OTP request failure
- Invalid OTP
- Network errors
- Server errors

## Future Enhancements

Potential improvements for the OTP system:
- SMS OTP support
- Biometric authentication
- Remember device functionality
- Advanced security features 