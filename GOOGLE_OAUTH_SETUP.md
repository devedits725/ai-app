# Google OAuth Setup Instructions

## To enable Google login, you need to configure Google OAuth in your Supabase project:

### 1. Go to your Supabase project dashboard
- Visit https://supabase.com/dashboard/project/abjjccxgzrhknarfwpab
- Navigate to Authentication → Providers

### 2. Enable Google Provider
- Find Google in the list of OAuth providers
- Click the toggle to enable it
- You'll need to provide:
  - **Google Client ID**
  - **Google Client Secret**

### 3. Get Google OAuth Credentials
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable Google+ API
- Go to Credentials → Create Credentials → OAuth client ID
- Select "Web application"
- Add authorized redirect URI: `https://abjjccxgzrhknarfwpab.supabase.co/auth/v1/callback`
- Copy the Client ID and Client Secret

### 4. Configure in Supabase
- Paste the Client ID and Client Secret in the Google provider settings
- Save the configuration

### 5. Environment Variables (Optional)
If you want to configure via environment variables, add to your `.env`:
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Testing
Once configured, users can click the Google button on the login page to authenticate with their Google account.

## Notes
- The redirect URI must exactly match: `https://abjjccxgzrhknarfwpab.supabase.co/auth/v1/callback`
- Make sure your Google OAuth app is configured for the correct environment (development/production)
- Google OAuth requires a verified Google Cloud project
