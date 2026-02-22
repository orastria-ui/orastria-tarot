// Supabase Integration for Thank You Page
const SUPABASE_URL = 'https://bkxgpjxfexndjwawaiph.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJreGdwanhmZXhuZGp3YXdhaXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MTY1MjEsImV4cCI6MjA1NTM5MjUyMX0.cqsC76Qr-NcjzXDxEbw55HRB4EZ7IUhXIB-y1xFvbnU';
const N8N_WEBHOOK = 'https://ismypartner.app.n8n.cloud/webhook/ff1c88e1-5523-4a12-960b-82a2660528d0';

// Get UID and Stripe session from URL
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid') || localStorage.getItem('orastria_uid');
const sessionId = urlParams.get('session_id');

console.log('🎉 Thank you page loaded - UID:', uid, 'Session:', sessionId);

// Process purchase on page load
(async function processPurchase() {
    if (!uid) {
        console.error('❌ No UID found - cannot process purchase');
        return;
    }

    try {
        console.log('📊 Fetching user data from database...');
        
        // 1. Fetch user data from Supabase
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/orastria_submissions?user_id=eq.${uid}&select=*`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            }
        );

        const users = await response.json();
        
        if (!users || users.length === 0) {
            console.error('❌ User not found in database for UID:', uid);
            return;
        }

        const userData = users[0];
        console.log('✅ User data loaded:', userData.email);

        // 2. Update buy = "yes" in database
        console.log('📝 Updating buy status to "yes"...');
        
        const updateResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/orastria_submissions?user_id=eq.${uid}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    buy: 'yes',
                    stripe_session_id: sessionId || null,
                    purchase_timestamp: new Date().toISOString()
                })
            }
        );

        if (updateResponse.ok) {
            console.log('✅ Database updated: buy = "yes"');
        } else {
            console.error('⚠️  Database update failed:', await updateResponse.text());
        }

        // 3. Send all data to n8n webhook
        console.log('📤 Sending data to n8n webhook...');
        
        const webhookPayload = {
            // User data from database
            user_id: userData.user_id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            date_birth: userData.date_birth,
            birth_time: userData.hcur_min_am,
            place_of_birth: userData.place_of_birth,
            place_birth_coordinates: userData.place_birth_coordonate,
            sun_sign: userData.sun_sign,
            gender: userData.genre,
            single: userData.single,
            relationship_goal: userData.answer_question,
            mindset: userData.answer_answer,
            cover_color: userData.color_book,
            variant: userData.variant,
            
            // Stripe data
            stripe_session_id: sessionId || null,
            
            // Purchase metadata
            purchase_timestamp: new Date().toISOString(),
            price: '7.99',
            currency: 'EUR',
            product: 'orastria-full-book',
            
            // Tracking data
            user_agent: navigator.userAgent,
            ip_address: userData.ip_address,
            fbclid: userData.fbclid,
            
            // Original submission timestamp
            submitted_at: userData.created_at
        };

        const webhookResponse = await fetch(N8N_WEBHOOK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhookPayload)
        });

        if (webhookResponse.ok) {
            console.log('✅ Webhook sent successfully');
            console.log('📦 Payload:', webhookPayload);
        } else {
            console.error('❌ Webhook failed:', webhookResponse.status, await webhookResponse.text());
        }

    } catch (error) {
        console.error('❌ Purchase processing error:', error);
    }
})();

// Export tracking function for compatibility
window.orastriaTracking = {
    trackPurchase: () => {
        console.log('✓ Purchase tracking already processed on page load');
    }
};
