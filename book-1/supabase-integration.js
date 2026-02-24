// Supabase Integration for Orastria Book-1
const SUPABASE_URL = 'https://bkxgpjxfexndjwawaiph.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qw9JxZ0SwYY5s_yOOylcgg_BWF2FnQ7';

// Initialize Supabase client (script already loaded in HTML)
(function initSupabase() {
    if (typeof supabase !== 'undefined') {
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✓ Supabase connected to Orastria database');
    } else {
        console.error('Supabase library not loaded - check script tag in HTML');
    }
})();

// Get user IP
async function getUserIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch (e) {
        console.warn('Could not fetch IP:', e);
        return null;
    }
}

// Submit to Supabase
async function submitToOrastriaDB(formData) {
    if (!window.supabaseClient) {
        console.error('Supabase not loaded');
        return { success: false, error: 'Database not ready' };
    }

    try {
        // Get IP address
        const ipAddress = await getUserIP();
        
        // Get fbclid, gclid, msclkid from localStorage
        const fbclid = localStorage.getItem('orastria_fbclid') || null;
        const gclid = localStorage.getItem('orastria_gclid') || null;
        const msclkid = localStorage.getItem('orastria_msclkid') || null;

        const { data, error } = await window.supabaseClient
            .from('orastria_submissions')
            .insert([{
                user_id: window.orastriaUID || null,
                email: formData.email || null,
                first_name: formData.firstName || null,
                last_name: formData.lastName || null,
                date_birth: formData.dateBirth || null,
                hcur_min_am: formData.birthTime || null,
                place_of_birth: formData.birthPlace || null,
                place_birth_coordonate: formData.placeCoords || null,
                sun_sign: formData.zodiac || null,
                genre: formData.gender || null,
                single: formData.status === 'single',
                answer_question: formData.goal || null,
                answer_answer: formData.mindset || null,
                color_book: formData.coverColor || null,
                variant: 'book-1',
                user_agent: navigator.userAgent,
                ip_address: ipAddress,
                fbclid: fbclid,
                gclid: gclid,
                msclkid: msclkid,
                lang: 'en'
            }])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }

        console.log('✓ Submitted to Orastria database:', data);
        console.log('  → IP:', ipAddress, '| fbclid:', fbclid ? '✓' : '–', '| gclid:', gclid ? '✓' : '–', '| msclkid:', msclkid ? '✓' : '–');
        return { success: true, data: data[0] };

    } catch (err) {
        console.error('Submission error:', err);
        return { success: false, error: err.message };
    }
}

// Create Klaviyo profile and subscribe to list (with custom properties)
async function createKlaviyoProfile(email, firstName, uid, customProps = {}) {
    try {
        const res = await fetch('https://orastria-api.orastria.workers.dev/klaviyo/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                firstName, 
                uid,
                // Custom properties for Klaviyo
                zodiac: customProps.zodiac || null,
                gender: customProps.gender || null,
                status: customProps.status || null,
                goal: customProps.goal || null,
                mindset: customProps.mindset || null,
                loveLanguage: customProps.loveLanguage || null,
                birthDate: customProps.birthDate || null,
                birthPlace: customProps.birthPlace || null,
                coverColor: customProps.coverColor || null
            })
        });
        const data = await res.json();
        if (data.success) {
            console.log('✓ Klaviyo profile created:', data.klaviyo_id, '| Props:', Object.keys(customProps).length);
            return data.klaviyo_id;
        } else {
            console.error('Klaviyo error:', data.error);
            return null;
        }
    } catch (err) {
        console.error('Klaviyo request failed:', err);
        return null;
    }
}

// Export for use in quiz.js
window.submitToOrastriaDB = submitToOrastriaDB;
window.createKlaviyoProfile = createKlaviyoProfile;
