# AdMob Setup Guide 📱

This guide will help you set up real ads in your Student Toolkit app.

## Step 1: Get AdMob Account

1. Go to [Google AdMob](https://apps.admob.com/)
2. Sign in with your Google account
3. Create a new app or add your existing app

## Step 2: Create Ad Units

### For Both iOS and Android Apps:

1. In AdMob dashboard → Your Apps → Select your app
2. Click "Add ad unit" for **each platform separately**

#### **Banner Ads** (Create 2 separate units):
- **Android Banner**: 
  - Platform: Android
  - Name: "Main Banner Android"
  - Size: "Banner (320x50)"
  - Copy the **Android Ad Unit ID** (looks like: `ca-app-pub-xxxxxxxxxxxxxxxxx/yyyyyyyyyy`)

- **iOS Banner**:
  - Platform: iOS  
  - Name: "Main Banner iOS"
  - Size: "Banner (320x50)"
  - Copy the **iOS Ad Unit ID** (looks like: `ca-app-pub-xxxxxxxxxxxxxxxxx/zzzzzzzzzz`)

#### **Rewarded Ads** (Create 2 separate units):
- **Android Rewarded**:
  - Platform: Android
  - Name: "AI Bonus Reward Android"
  - Reward: "10 AI uses"
  - Copy the **Android Ad Unit ID** (looks like: `ca-app-pub-xxxxxxxxxxxxxxxxx/aaaaaaaaaa`)

- **iOS Rewarded**:
  - Platform: iOS
  - Name: "AI Bonus Reward iOS"  
  - Reward: "10 AI uses"
  - Copy the **iOS Ad Unit ID** (looks like: `ca-app-pub-xxxxxxxxxxxxxxxxx/bbbbbbbbbb`)

## Step 3: Update App Configuration

### Update Ad Unit IDs in your components:

**File: `src/components/ads/BannerAdComponent.tsx`**
```typescript
const AD_UNIT_ID = Platform.select({
  web: null,
  ios: __DEV__
    ? TestIds?.BANNER // Keep this for testing
    : 'ca-app-pub-xxxxxxxxxxxxxxxxx/zzzzzzzzzz', // Replace with your iOS banner ad unit ID
  android: __DEV__
    ? TestIds?.BANNER // Keep this for testing
    : 'ca-app-pub-xxxxxxxxxxxxxxxxx/yyyyyyyyyy', // Replace with your Android banner ad unit ID
});
```

**File: `src/components/ads/RewardedAdComponent.tsx`**
```typescript
const AD_UNIT_ID = Platform.select({
  web: null,
  ios: __DEV__
    ? TestIds?.REWARDED // Keep this for testing
    : 'ca-app-pub-xxxxxxxxxxxxxxxxx/bbbbbbbbbb', // Replace with your iOS rewarded ad unit ID
  android: __DEV__
    ? TestIds?.REWARDED // Keep this for testing
    : 'ca-app-pub-xxxxxxxxxxxxxxxxx/aaaaaaaaaa', // Replace with your Android rewarded ad unit ID
});
```

### Update App ID (Optional):
**File: `app.json`** (in your mobile directory)
```json
{
  "expo": {
    "name": "student-toolkit-mobile",
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy",
          "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~zzzzzzzzzz"
        }
      ]
    ]
  }
}
```

## Step 4: Test Your Ads

### Development Testing:
- Ads will automatically use **test ad units** in development mode
- You'll see "Test Ad" banners and can interact with test rewarded ads
- No real ads will show, and you won't earn money

### Production Testing:
1. Build your app for production: `expo build:android` or `expo build:ios`
2. Install on a real device (not simulator)
3. Real ads will appear (after AdMob approval, usually takes a few hours)

## Step 5: AdMob Policies & Best Practices

### ✅ Do:
- Place ads where they don't interfere with app functionality
- Test ad placement thoroughly
- Follow AdMob content policies
- Implement proper ad loading states

### ❌ Don't:
- Encourage users to click ads
- Place ads too close to buttons
- Use fake ad clicks
- Violate content policies

## Step 6: Monitor Performance

1. Go to AdMob dashboard
2. Monitor metrics:
   - **Impressions**: How many times ads were shown
   - **Clicks**: How many times ads were clicked
   - **Revenue**: Your earnings
   - **Fill rate**: Percentage of ad requests that showed ads

## Current Implementation

### Banner Ads:
- Location: Bottom of all AI screens
- Size: 320x50 (standard banner)
- Auto-refresh: Every 30 seconds

### Rewarded Ads:
- Trigger: When user runs out of AI uses
- Reward: 10 bonus AI uses
- User experience: Watch full ad → Get instant reward

## Troubleshooting

### Ads Not Showing:
1. Check if you're using real device (not simulator)
2. Verify Ad Unit IDs are correct
3. Check internet connection
4. Wait a few hours after creating ad units

### Low Fill Rate:
1. Check your app's geographic targeting
2. Ensure ad requests are properly formatted
3. Contact AdMob support if persistent

### Revenue Optimization:
1. Test different ad placements
2. Monitor user engagement
3. Consider interstitial ads between screens (future feature)

## Next Steps

Once ads are working:
1. Monitor your AdMob dashboard
2. Consider A/B testing ad placements
3. Add more ad types (interstitial, native)
4. Implement ad mediation for higher fill rates

## Support

- AdMob Help Center: https://support.google.com/admob/
- React Native Google Mobile Ads: https://github.com/invertase/react-native-google-mobile-ads

---

**Important**: Always test thoroughly in development before releasing to production!
