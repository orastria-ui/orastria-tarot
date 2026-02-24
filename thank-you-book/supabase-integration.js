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
            `${SUPABASE_URL}/rest/v1/orastria_submissions?id=eq.${uid}&select=*`,
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

        // 2. Update buy = true in database
        console.log('📝 Updating buy status to true...');
        
        const updateResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/orastria_submissions?id=eq.${uid}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    buy: true,
                    stripe_session_id: sessionId || null
                })
            }
        );

        if (updateResponse.ok) {
            console.log('✅ Database updated: buy = true');
        } else {
            console.error('⚠️  Database update failed:', await updateResponse.text());
        }

        // 3. Convert birth_time from 12h to 24h format
        function convert12hTo24h(time12h) {
            if (!time12h) return null;
            
            const match = time12h.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
            if (!match) return time12h; // Return as-is if format doesn't match
            
            let [_, hours, minutes, period] = match;
            hours = parseInt(hours);
            
            if (period.toUpperCase() === 'PM' && hours !== 12) {
                hours += 12;
            } else if (period.toUpperCase() === 'AM' && hours === 12) {
                hours = 0;
            }
            
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
        
        // 4. Send all data to n8n webhook
        console.log('📤 Sending data to n8n webhook...');
        
        const webhookPayload = {
            user_id: userData.user_id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            date_birth: userData.date_birth,
            birth_time: convert12hTo24h(userData.hcur_min_am),
            place_of_birth: userData.place_of_birth,
            sun_sign: userData.sun_sign,
            gender: userData.genre,
            single: userData.single,
            relationship_goal: userData.answer_question,
            mindset: userData.answer_answer,
            cover_color: userData.color_book,
            variant: userData.variant,
            purchase_timestamp: new Date().toISOString(),
            ip_address: userData.ip_address,
            fbclid: userData.fbclid,
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
