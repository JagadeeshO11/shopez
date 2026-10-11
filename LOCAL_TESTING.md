# ShopEZ frontend: local testing

## Prerequisites
- Node.js 18 or newer (Node 24 is supported by this project)
- The ShopEZ backend running locally on port 5000

## Start locally
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`.
3. Set `REACT_APP_API_URL=http://localhost:5000/api/v1`.
4. Set `REACT_APP_GOOGLE_CLIENT_ID` to the Web OAuth client ID when Google sign-in is configured. Leave it blank to test email OTP only.
5. Start the app: `npm start`.

Create React App reads environment variables at startup. Restart `npm start` after changing `.env`.

## Authentication
- Email OTP uses the backend Resend configuration. Codes expire in 10 minutes.
- Google sign-in needs the same client ID in frontend and backend environment files.
- Do not commit `.env`. Only `.env.example` belongs in Git.

## Checkout
The mobile field accepts a 10-digit Indian mobile number beginning with 6–9. The backend repeats this validation before saving an order.
