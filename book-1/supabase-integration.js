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

// ══════════════════════════════════════════════════════════════════
// SESSION TRACKING — Create or resume session on page load
// ══════════════════════════════════════════════════════════════════

/**
 * Get or create a session entry in Supabase
 * Returns: { id, last_step, email, isNew }
 */
async function getOrCreateSession() {
    if (!window.supabaseClient) {
        console.warn('Supabase not ready for session tracking');
        return null;
    }

    const uid = window.orastriaUID || localStorage.getItem('orastria_uid');
    if (!uid) {
        console.warn('No UID available for session tracking');
        return null;
    }

    try {
        // 1. Check if entry exists for this UID
        // Try by 'id' first (if UID was migrated to database ID by resolveSessionUID)
        let existing = null;
        let selectError = null;

        // First try: lookup by 'id' (UID might be the database ID after migration)
        const { data: byId, error: idError } = await window.supabaseClient
            .from('orastria_submissions')
            .select('id, last_step, email, user_id')
            .eq('id', uid)
            .maybeSingle();

        if (!idError && byId) {
            existing = byId;
            console.log('✓ Session found by id:', existing.id);
        } else {
            // Second try: lookup by 'user_id' (original client-generated UUID)
            const { data: byUserId, error: userIdError } = await window.supabaseClient
                .from('orastria_submissions')
                .select('id, last_step, email, user_id')
                .eq('user_id', uid)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (userIdError) {
                selectError = userIdError;
            } else if (byUserId) {
                existing = byUserId;
                console.log('✓ Session found by user_id:', existing.id);
            }
        }

        if (selectError) {
            console.error('Session lookup error:', selectError);
            return null;
        }

        // 2. If exists → return it (for resume)
        if (existing) {
            console.log('✓ Existing session found:', existing.id, '| last_step:', existing.last_step);
            return { id: existing.id, last_step: existing.last_step || 0, email: existing.email, isNew: false };
        }

        // 3. If not → create new entry with click IDs
        const fbclid = localStorage.getItem('orastria_fbclid') || null;
        const gclid = localStorage.getItem('orastria_gclid') || null;
        const msclkid = localStorage.getItem('orastria_msclkid') || null;
        const ipAddress = await getUserIP();
        
        // Capture full arrival URL (path + query params)
        const fromOld = window.location.pathname + window.location.search;

        const { data: newEntry, error: insertError } = await window.supabaseClient
            .from('orastria_submissions')
            .insert([{
                user_id: uid,
                last_step: 0,
                variant: 'book-1',
                fbclid: fbclid,
                gclid: gclid,
                msclkid: msclkid,
                from_old: fromOld,
                user_agent: navigator.userAgent,
                ip_address: ipAddress
            }])
            .select()
            .single();

        if (insertError) {
            console.error('Session creation error:', insertError);
            return null;
        }

        console.log('✓ New session created:', newEntry.id, '| gclid:', gclid ? '✓' : '–', '| fbclid:', fbclid ? '✓' : '–', '| msclkid:', msclkid ? '✓' : '–');
        return { id: newEntry.id, last_step: 0, email: null, isNew: true };

    } catch (err) {
        console.error('Session tracking failed:', err);
        return null;
    }
}

// ══════════════════════════════════════════════════════════════════
// STEP UPDATE QUEUE — Handle clicks before session is ready
// ══════════════════════════════════════════════════════════════════

let stepUpdateQueue = [];
let sessionReady = false;

function queueStepUpdate(step) {
    if (sessionReady && window.orastriaSessionId) {
        sendStepUpdate(step);
    } else {
        stepUpdateQueue = [step]; // Keep only latest
        console.log('⏳ Step queued:', step);
    }
}

function sendStepUpdate(step) {
    if (!window.orastriaSessionId || !window.supabaseClient) return;

    window.supabaseClient
        .from('orastria_submissions')
        .update({ last_step: step, updated_at: new Date().toISOString() })
        .eq('id', window.orastriaSessionId)
        .then(({ error }) => {
            if (error) console.error('Step update error:', error);
            else console.log('✓ Step tracked:', step);
        });
}

function flushStepQueue() {
    if (stepUpdateQueue.length > 0 && window.orastriaSessionId) {
        const maxStep = Math.max(...stepUpdateQueue);
        console.log('→ Flushing queued steps:', maxStep);
        sendStepUpdate(maxStep);
        stepUpdateQueue = [];
    }
}

// ══════════════════════════════════════════════════════════════════
// SESSION INIT — Run on page load
// ══════════════════════════════════════════════════════════════════

async function initSession() {
    const session = await getOrCreateSession();
    if (session) {
        window.orastriaSessionId = session.id;
        window.orastriaLastStep = session.last_step;
        window.orastriaHasEmail = !!session.email;

        // Mark session as ready
        sessionReady = true;

        // Flush any queued updates
        flushStepQueue();

        // Dispatch event for quiz.js to handle resume
        window.dispatchEvent(new CustomEvent('orastria-session-ready', {
            detail: session
        }));
    }
}

// Auto-init after a short delay (to ensure UID is set by user-tracking.js)
setTimeout(initSession, 500);

// ══════════════════════════════════════════════════════════════════
// ORIGINAL FUNCTIONS (kept for compatibility)
// ══════════════════════════════════════════════════════════════════

// Submit to Supabase (UPDATE existing session instead of INSERT)
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

        // If we have a session ID, UPDATE instead of INSERT
        if (window.orastriaSessionId) {
            const { data, error } = await window.supabaseClient
                .from('orastria_submissions')
                .update({
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
                    user_agent: navigator.userAgent,
                    ip_address: ipAddress,
                    fbclid: fbclid,
                    gclid: gclid,
                    msclkid: msclkid,
                    lang: 'en',
                    last_step: 13,
                    updated_at: new Date().toISOString()
                })
                .eq('id', window.orastriaSessionId)
                .select();

            if (error) {
                console.error('Supabase update error:', error);
                return { success: false, error: error.message };
            }

            console.log('✓ Session updated with quiz data:', window.orastriaSessionId);
            console.log('  → IP:', ipAddress, '| fbclid:', fbclid ? '✓' : '–', '| gclid:', gclid ? '✓' : '–', '| msclkid:', msclkid ? '✓' : '–');
            return { success: true, data: data[0] };
        }

        // Fallback: INSERT if no session (shouldn't happen normally)
        console.warn('No session ID — falling back to INSERT');
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
                lang: 'en',
                last_step: 13
            }])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }

        console.log('✓ Submitted to Orastria database (INSERT fallback):', data);
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
window.getOrCreateSession = getOrCreateSession;
window.queueStepUpdate = queueStepUpdate;
window.initSession = initSession;
