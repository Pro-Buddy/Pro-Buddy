const API_BASE = '/api';

export async function apiLogin(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return res.json();
}

export async function apiSignup(name, email, password) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    return res.json();
}

export async function apiUpdateProfile(email, name, bio, college) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, bio, college })
    });
    return res.json();
}

export async function apiSaveEvaluation(data) {
    const res = await fetch(`${API_BASE}/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json();
}

export async function apiGetEvaluations(email) {
    const res = await fetch(`${API_BASE}/evaluations/${encodeURIComponent(email)}`);
    return res.json();
}

export async function apiClearEvaluations(email) {
    const res = await fetch(`${API_BASE}/evaluations/${encodeURIComponent(email)}`, { method: 'DELETE' });
    return res.json();
}
