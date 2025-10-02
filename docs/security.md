# Security Implementation for Spotify Tokens

## Overview

This document explains the security measures implemented to address the warning about storing sensitive Spotify access tokens in the database.

## Security Issues Addressed

### 1. **Token Encryption at Rest**
- All Spotify tokens are encrypted using PostgreSQL's `pgcrypto` extension
- Each token is encrypted with a unique IV (Initialization Vector)
- Encryption keys are derived from user ID + application secret
- Tokens are never stored in plain text

### 2. **Row Level Security (RLS)**
- Users can only access their own tokens
- Strict RLS policies prevent cross-user data access
- All database operations are authenticated

### 3. **Token Rotation**
- Automatic token refresh when expired
- Rotation counter tracks token updates
- Old tokens are securely deactivated

### 4. **Secure API Access**
- Tokens are only accessible through secure edge functions
- Client-side code never has direct access to raw tokens
- All token operations go through authenticated endpoints

## Implementation Details

### Database Schema
```sql
-- Encrypted token storage
CREATE TABLE public.spotify_tokens (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  access_token_encrypted BYTEA NOT NULL,
  access_token_iv BYTEA NOT NULL,
  refresh_token_encrypted BYTEA NOT NULL,
  refresh_token_iv BYTEA NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);
```

### Security Functions
- `encrypt_spotify_token()` - Encrypts tokens with unique IVs
- `decrypt_spotify_token()` - Decrypts tokens for authenticated users only
- `store_spotify_tokens()` - Securely stores encrypted tokens
- `get_spotify_access_token()` - Returns decrypted token for API calls
- `revoke_spotify_tokens()` - Securely deactivates tokens

### Edge Functions
- `get-spotify-tokens` - Secure token retrieval with automatic refresh
- `spotify-token` - Secure token storage during OAuth flow

## Security Best Practices Implemented

### 1. **Encryption**
- ✅ Tokens encrypted at rest using AES encryption
- ✅ Unique IV for each token
- ✅ Key derivation from user context

### 2. **Access Control**
- ✅ RLS policies restrict access to user's own tokens
- ✅ All functions require authentication
- ✅ No direct database access from client

### 3. **Token Management**
- ✅ Automatic token refresh
- ✅ Secure token revocation
- ✅ Expired token cleanup

### 4. **API Security**
- ✅ Edge functions handle all token operations
- ✅ JWT authentication required
- ✅ No token exposure to client-side code

## Environment Variables Required

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Spotify
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Encryption (set in Supabase dashboard)
app.encryption_key=your_encryption_key
```

## Migration Instructions

1. **Run the migration**:
   ```bash
   supabase db push
   ```

2. **Set encryption key** in Supabase dashboard:
   - Go to Settings > Database
   - Add custom configuration: `app.encryption_key = 'your-secret-key'`

3. **Deploy edge functions**:
   ```bash
   supabase functions deploy get-spotify-tokens
   supabase functions deploy spotify-token
   ```

4. **Set environment variables** in Supabase dashboard:
   - Go to Settings > Edge Functions
   - Add all required environment variables

## Security Monitoring

### Recommended Monitoring
- Monitor token rotation frequency
- Alert on failed token refreshes
- Track token usage patterns
- Monitor for suspicious access patterns

### Cleanup Procedures
- Automatic cleanup of expired tokens (30+ days old)
- Manual cleanup procedures for security incidents
- Regular security audits

## Incident Response

### If tokens are compromised:
1. Immediately revoke all user tokens using `revoke_spotify_tokens()`
2. Force re-authentication for affected users
3. Rotate encryption keys
4. Monitor for unauthorized access

### If database is compromised:
1. All tokens are encrypted and unusable without encryption keys
2. Encryption keys are stored separately from the database
3. Immediate key rotation required
4. Force re-authentication for all users

## Compliance

This implementation addresses:
- ✅ **Data Protection**: Tokens encrypted at rest
- ✅ **Access Control**: Strict RLS policies
- ✅ **Audit Trail**: Token usage tracking
- ✅ **Token Rotation**: Automatic refresh and rotation
- ✅ **Secure Storage**: No plaintext token storage
- ✅ **API Security**: Edge function protection

## Testing

### Security Tests
1. Verify tokens are encrypted in database
2. Test RLS policies prevent cross-user access
3. Verify automatic token refresh works
4. Test token revocation functionality
5. Verify edge functions require authentication

### Performance Tests
1. Token encryption/decryption performance
2. Edge function response times
3. Database query performance with RLS
4. Token refresh latency

This implementation provides enterprise-grade security for Spotify token storage while maintaining usability and performance.
