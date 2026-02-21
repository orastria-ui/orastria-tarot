// Supabase Integration for Orastria Book-1
// Load Supabase client from CDN
const SUPABASE_URL = 'https://bkxgpjxfexndjwawaiph.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qw9JxZ0SwYY5s_yOOylcgg_BWF2FnQ7';

// Load Supabase library
(function loadSupabase() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✓ Supabase connected to Orastria database');
    };
    script.onerror = () => console.error('Failed to load Supabase');
    document.head.appendChild(script);
})();

// Submit to Supabase
async function submitToOrastriaDB(formData) {
    if (!window.supabaseClient) {
        console.error('Supabase not loaded');
        return { success: false, error: 'Database not ready' };
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('orastria_submissions')
            .insert([{
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
                variant: 'v2',
                user_agent: navigator.userAgent,
                lang: 'en'
            }])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return { success: false, error: error.message };
        }

        console.log('✓ Submitted to Orastria database:', data);
        return { success: true, data: data[0] };

    } catch (err) {
        console.error('Submission error:', err);
        return { success: false, error: err.message };
    }
}

// Export for use in quiz.js
window.submitToOrastriaDB = submitToOrastriaDB;
