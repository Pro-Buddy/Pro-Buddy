/* ========================================
   PRO BUDDY — Auth & Profile System
   localStorage-based authentication
   ======================================== */

// ---- Storage Keys ----
const STORAGE_KEYS = {
    USERS: 'pb_users',
    CURRENT_USER: 'pb_current_user',
    EVAL_HISTORY: 'pb_eval_history'
};

// ---- Helper: Get/Set Storage ----
function getStorage(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; }
    catch { return null; }
}
function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// ---- User Database (localStorage) ----
function getUsers() { return getStorage(STORAGE_KEYS.USERS) || {}; }
function saveUsers(users) { setStorage(STORAGE_KEYS.USERS, users); }

function getCurrentUser() { return getStorage(STORAGE_KEYS.CURRENT_USER); }
function setCurrentUser(user) { setStorage(STORAGE_KEYS.CURRENT_USER, user); }
function clearCurrentUser() { localStorage.removeItem(STORAGE_KEYS.CURRENT_USER); }

function getEvalHistory() { return getStorage(STORAGE_KEYS.EVAL_HISTORY) || []; }
function saveEvalHistory(history) { setStorage(STORAGE_KEYS.EVAL_HISTORY, history); }

// ---- Simple Hash (for demo — NOT secure for production) ----
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return 'h' + Math.abs(hash).toString(36);
}

// ---- Get User Initials ----
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
}

// ---- Auth State Check ----
function checkAuthState() {
    const user = getCurrentUser();
    const overlay = document.getElementById('authOverlay');
    const appWrapper = document.getElementById('appWrapper');

    if (user) {
        // User is logged in
        overlay.style.display = 'none';
        appWrapper.style.display = 'block';
        updateUserUI(user);
    } else {
        // Show login
        overlay.style.display = 'flex';
        appWrapper.style.display = 'none';
    }
}

// ---- Update all user-facing UI ----
function updateUserUI(user) {
    const initials = getInitials(user.name);

    // Navbar avatar
    const avatarEl = document.getElementById('userAvatar');
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const dropdownName = document.getElementById('dropdownName');
    const dropdownEmail = document.getElementById('dropdownEmail');

    if (avatarEl) avatarEl.textContent = initials;
    if (dropdownAvatar) dropdownAvatar.textContent = initials;
    if (dropdownName) dropdownName.textContent = user.name;
    if (dropdownEmail) dropdownEmail.textContent = user.email;

    // Profile page
    const profileAvatar = document.getElementById('profileBigAvatar');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');

    if (profileAvatar) profileAvatar.textContent = initials;
    if (profileName) profileName.textContent = user.name;
    if (profileEmail) profileEmail.textContent = user.email;

    // Profile stats
    updateProfileStats();
}

// ---- Signup ----
function handleSignup(name, email, password) {
    const users = getUsers();
    if (users[email]) {
        return { success: false, message: 'An account with this email already exists.' };
    }

    const user = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: simpleHash(password),
        bio: '',
        college: '',
        joinedAt: new Date().toISOString()
    };

    users[user.email] = user;
    saveUsers(users);
    setCurrentUser(user);

    return { success: true, user };
}

// ---- Login ----
function handleLogin(email, password) {
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users[normalizedEmail];

    if (!user) {
        return { success: false, message: 'No account found with this email.' };
    }

    if (user.passwordHash !== simpleHash(password)) {
        return { success: false, message: 'Incorrect password. Try again.' };
    }

    setCurrentUser(user);
    return { success: true, user };
}

// ---- Logout ----
function handleLogout() {
    clearCurrentUser();
    const overlay = document.getElementById('authOverlay');
    const appWrapper = document.getElementById('appWrapper');
    overlay.style.display = 'flex';
    appWrapper.style.display = 'none';

    // Reset forms
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
    document.getElementById('loginCard').style.display = 'block';
    document.getElementById('signupCard').style.display = 'none';
}

// ---- Save Evaluation to History ----
function saveEvaluation(formData, scores, feedback) {
    const user = getCurrentUser();
    if (!user) return;

    const history = getEvalHistory();
    history.unshift({
        id: Date.now().toString(36),
        timestamp: new Date().toISOString(),
        userEmail: user.email,
        title: formData.title,
        domain: formData.domain,
        overallScore: scores.overall,
        scores: { ...scores },
        verdict: feedback.verdict
    });

    // Keep max 50 entries
    if (history.length > 50) history.pop();
    saveEvalHistory(history);
}

// ---- Get History for Current User ----
function getUserHistory() {
    const user = getCurrentUser();
    if (!user) return [];
    return getEvalHistory().filter(e => e.userEmail === user.email);
}

// ---- Profile Stats ----
function updateProfileStats() {
    const history = getUserHistory();
    const user = getCurrentUser();

    const totalEl = document.getElementById('pstatTotal');
    const bestEl = document.getElementById('pstatBest');
    const avgEl = document.getElementById('pstatAvg');
    const joinedEl = document.getElementById('pstatJoined');
    const evalCountEl = document.getElementById('profileEvalCount');

    if (totalEl) totalEl.textContent = history.length;
    if (evalCountEl) evalCountEl.textContent = `${history.length} Evaluation${history.length !== 1 ? 's' : ''}`;

    if (history.length > 0) {
        const scores = history.map(e => e.overallScore);
        const best = Math.max(...scores);
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        if (bestEl) bestEl.textContent = best + '/100';
        if (avgEl) avgEl.textContent = avg + '/100';
    } else {
        if (bestEl) bestEl.textContent = '—';
        if (avgEl) avgEl.textContent = '—';
    }

    if (user && user.joinedAt) {
        const d = new Date(user.joinedAt);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (joinedEl) joinedEl.textContent = `${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    renderHistory(history);
}

// ---- Render Evaluation History ----
function renderHistory(history) {
    const listEl = document.getElementById('historyList');
    const emptyEl = document.getElementById('historyEmpty');
    if (!listEl) return;

    // Remove previous history cards (keep the empty state div)
    const existingCards = listEl.querySelectorAll('.history-card');
    existingCards.forEach(c => c.remove());

    if (history.length === 0) {
        if (emptyEl) emptyEl.style.display = 'flex';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    history.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'history-card';

        const d = new Date(entry.timestamp);
        const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        const scoreClass = entry.overallScore >= 75 ? 'high' : entry.overallScore >= 55 ? 'medium' : 'low';
        const domainLabel = entry.domain ? (entry.domain.charAt(0).toUpperCase() + entry.domain.slice(1)).replace(/-/g, ' ') : '';

        card.innerHTML = `
            <div class="history-card-left">
                <div class="history-score-ring ${scoreClass}">${entry.overallScore}</div>
            </div>
            <div class="history-card-body">
                <div class="history-card-title">${entry.title}</div>
                <div class="history-card-meta">
                    <span class="history-domain">${domainLabel}</span>
                    <span class="history-date">${dateStr}</span>
                </div>
            </div>
            <div class="history-card-right">
                <span class="history-verdict">${entry.verdict || ''}</span>
            </div>
        `;
        listEl.appendChild(card);
    });
}

// ---- Show Profile Section ----
function showProfileSection() {
    // Hide main sections
    ['home', 'features', 'how-it-works', 'evaluate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const footer = document.getElementById('footer');
    if (footer) footer.style.display = 'none';

    const profile = document.getElementById('profile');
    if (profile) {
        profile.style.display = 'block';
        profile.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    updateProfileStats();

    // Close dropdown
    const dd = document.getElementById('userDropdown');
    if (dd) dd.classList.remove('show');
}

// ---- Show Main Sections (hide profile) ----
function showMainSections() {
    ['home', 'features', 'how-it-works', 'evaluate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = '';
    });
    const footer = document.getElementById('footer');
    if (footer) footer.style.display = '';

    const profile = document.getElementById('profile');
    if (profile) profile.style.display = 'none';
}

// ---- Password Strength ----
function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', '#ff4757', '#ffb347', '#00d4aa', '#7c5cfc', '#00d4aa'];
    const widths = ['0%', '20%', '40%', '60%', '80%', '100%'];

    return { score, label: labels[score], color: colors[score], width: widths[score] };
}

// ========================================
// EVENT LISTENERS (after DOM ready)
// ========================================
document.addEventListener('DOMContentLoaded', () => {

    // ---- Check Auth ----
    checkAuthState();

    // ---- Toggle Between Login / Signup ----
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    const loginCard = document.getElementById('loginCard');
    const signupCard = document.getElementById('signupCard');

    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginCard.style.display = 'none';
            signupCard.style.display = 'block';
            signupCard.classList.add('auth-card-enter');
            setTimeout(() => signupCard.classList.remove('auth-card-enter'), 500);
        });
    }
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupCard.style.display = 'none';
            loginCard.style.display = 'block';
            loginCard.classList.add('auth-card-enter');
            setTimeout(() => loginCard.classList.remove('auth-card-enter'), 500);
        });
    }

    // ---- Login Form ----
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Show loading
        const btn = document.getElementById('loginBtn');
        btn.querySelector('.btn-text').style.display = 'none';
        btn.querySelector('.btn-loading').style.display = 'inline-flex';
        btn.disabled = true;

        setTimeout(() => {
            const result = handleLogin(email, password);
            btn.querySelector('.btn-text').style.display = 'inline-flex';
            btn.querySelector('.btn-loading').style.display = 'none';
            btn.disabled = false;

            if (result.success) {
                // Transition to app
                const overlay = document.getElementById('authOverlay');
                overlay.classList.add('auth-exit');
                setTimeout(() => {
                    overlay.style.display = 'none';
                    overlay.classList.remove('auth-exit');
                    document.getElementById('appWrapper').style.display = 'block';
                    updateUserUI(result.user);
                }, 600);
            } else {
                showAuthError(loginForm, result.message);
            }
        }, 1200);
    });

    // ---- Signup Form ----
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const btn = document.getElementById('signupBtn');
        btn.querySelector('.btn-text').style.display = 'none';
        btn.querySelector('.btn-loading').style.display = 'inline-flex';
        btn.disabled = true;

        setTimeout(() => {
            const result = handleSignup(name, email, password);
            btn.querySelector('.btn-text').style.display = 'inline-flex';
            btn.querySelector('.btn-loading').style.display = 'none';
            btn.disabled = false;

            if (result.success) {
                const overlay = document.getElementById('authOverlay');
                overlay.classList.add('auth-exit');
                setTimeout(() => {
                    overlay.style.display = 'none';
                    overlay.classList.remove('auth-exit');
                    document.getElementById('appWrapper').style.display = 'block';
                    updateUserUI(result.user);
                }, 600);
            } else {
                showAuthError(signupForm, result.message);
            }
        }, 1400);
    });

    // ---- Google Sign In (demo: auto-create demo account) ----
    const googleBtn = document.getElementById('googleSignIn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            const demoEmail = 'demo@probuddy.ai';
            const users = getUsers();
            if (!users[demoEmail]) {
                handleSignup('Demo User', demoEmail, 'demo123');
            } else {
                handleLogin(demoEmail, 'demo123');
            }
            const overlay = document.getElementById('authOverlay');
            overlay.classList.add('auth-exit');
            setTimeout(() => {
                overlay.style.display = 'none';
                overlay.classList.remove('auth-exit');
                document.getElementById('appWrapper').style.display = 'block';
                updateUserUI(getCurrentUser());
            }, 600);
        });
    }

    // ---- Password Strength Meter ----
    const signupPw = document.getElementById('signupPassword');
    const pwFill = document.getElementById('pwFill');
    const pwLabel = document.getElementById('pwLabel');

    if (signupPw) {
        signupPw.addEventListener('input', () => {
            const result = checkPasswordStrength(signupPw.value);
            if (pwFill) {
                pwFill.style.width = result.width;
                pwFill.style.background = result.color;
            }
            if (pwLabel) {
                pwLabel.textContent = result.label;
                pwLabel.style.color = result.color;
            }
        });
    }

    // ---- Toggle Password Visibility ----
    function setupPwToggle(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        if (toggle && input) {
            toggle.addEventListener('click', () => {
                input.type = input.type === 'password' ? 'text' : 'password';
            });
        }
    }
    setupPwToggle('toggleLoginPw', 'loginPassword');
    setupPwToggle('toggleSignupPw', 'signupPassword');

    // ---- User Avatar Dropdown ----
    const avatarBtn = document.getElementById('userAvatarBtn');
    const dropdown = document.getElementById('userDropdown');

    if (avatarBtn && dropdown) {
        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== avatarBtn) {
                dropdown.classList.remove('show');
            }
        });
    }

    // ---- Dropdown: Profile ----
    const profileLink = document.getElementById('dropdownProfile');
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            showProfileSection();
        });
    }

    // ---- Dropdown: History ----
    const historyLink = document.getElementById('dropdownHistory');
    if (historyLink) {
        historyLink.addEventListener('click', (e) => {
            e.preventDefault();
            showProfileSection();
        });
    }

    // ---- Dropdown: Logout ----
    const logoutLink = document.getElementById('dropdownLogout');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.remove('show');
            handleLogout();
        });
    }

    // ---- Edit Profile ----
    const editBtn = document.getElementById('editProfileBtn');
    const editCard = document.getElementById('profileEditCard');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editForm = document.getElementById('editProfileForm');

    if (editBtn && editCard) {
        editBtn.addEventListener('click', () => {
            const user = getCurrentUser();
            document.getElementById('editName').value = user.name || '';
            document.getElementById('editBio').value = user.bio || '';
            document.getElementById('editCollege').value = user.college || '';
            editCard.style.display = 'block';
            editCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    if (cancelEditBtn && editCard) {
        cancelEditBtn.addEventListener('click', () => {
            editCard.style.display = 'none';
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = getCurrentUser();
            user.name = document.getElementById('editName').value.trim();
            user.bio = document.getElementById('editBio').value.trim();
            user.college = document.getElementById('editCollege').value.trim();

            // Update in users DB
            const users = getUsers();
            users[user.email] = user;
            saveUsers(users);
            setCurrentUser(user);

            updateUserUI(user);
            editCard.style.display = 'none';

            if (typeof showToast === 'function') {
                showToast('✅ Profile updated successfully!');
            }
        });
    }

    // ---- Clear History ----
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            const user = getCurrentUser();
            if (!user) return;
            let history = getEvalHistory();
            history = history.filter(e => e.userEmail !== user.email);
            saveEvalHistory(history);
            updateProfileStats();
            if (typeof showToast === 'function') {
                showToast('🗑️ Evaluation history cleared.');
            }
        });
    }
});

// ---- Auth Error Display ----
function showAuthError(formEl, message) {
    // Remove existing error
    const existing = formEl.querySelector('.auth-error');
    if (existing) existing.remove();

    const err = document.createElement('div');
    err.className = 'auth-error';
    err.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> ${message}`;
    formEl.insertBefore(err, formEl.firstChild);

    setTimeout(() => {
        if (err.parentElement) err.remove();
    }, 5000);
}
