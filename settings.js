// --- GLOBAL SESSION & RELOAD REDIRECT CHECK ---
(function() {
    const path = window.location.pathname;
    const isHome = path.endsWith('index.html') || path.endsWith('index.html') || path === '/' || path === '';
    
    // 1. Check if the page was refreshed
    const navEntries = performance.getEntriesByType('navigation');
    const isReload = (navEntries.length > 0 && navEntries[0].type === 'reload') || 
                     (performance.navigation && performance.navigation.type === 1);

    // 2. Check if the app was closed and reopened (sessionStorage gets cleared on close)
    const hasActiveSession = sessionStorage.getItem('app_active');

    // 3. If not on home, and it's either a reload OR a fresh app launch, redirect home
    if (!isHome) {
        if (isReload || !hasActiveSession) {
            sessionStorage.removeItem('app_active');
            window.location.replace('index.html');
            return;
        }
    }

    // Mark session as active for normal internal link navigation
    sessionStorage.setItem('app_active', 'true');
})();

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. INJECT UNIFIED SETTINGS MENU
    // This ensures every page has the exact same options and IDs
    const settingsHTML = `
    <div class="settings-drawer" id="settingsDrawer">
        <div class="settings-content">
            <h3>Settings <span class="close-settings" id="closeSettings">&times;</span></h3>
            
            <div class="setting-item">
                <span style="cursor: pointer; color: var(--primary-color); font-weight: bold">Dark Theme</span>
                <label class="switch">
                    <input type="checkbox" id="darkThemeToggle">
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="setting-item">
                <span style="cursor: pointer; color: var(--primary-color); font-weight: bold;" id="editLogoBtn">Edit Profile picture</span>
                <input type="file" id="logoUpload" accept="image/*" class="hidden">
            </div>
            
            <div class="setting-item">
                <span id="goHomeBtn" style="cursor: pointer; color: var(--primary-color); font-weight: bold">Add Transaction</span>
            </div>

            <div class="setting-item">
                <span id="goDashBtn" style="cursor: pointer; color: var(--primary-color); font-weight: bold">Analytics Dashboard</span>
            </div>

            <div class="setting-item">
                <span id="goStatsBtn" style="cursor: pointer; color: var(--primary-color); font-weight: bold">Sales statement</span>
            </div>
            
            <div class="setting-item connect-sheets">
                <span id="connectSheetsBtn" style="cursor: pointer; color: var(--primary-color); font-weight: bold">Connect to Google Sheets</span>
            </div>
        </div>
    </div>
    `;
    
    // Insert the menu into the body of whatever page loaded this script
    document.body.insertAdjacentHTML('beforeend', settingsHTML);


    // 2. ATTACH FUNCTIONALITY TO THE INJECTED MENU
    const menuBtn = document.getElementById('menuBtn');
    const settingsDrawer = document.getElementById('settingsDrawer');
    const closeSettings = document.getElementById('closeSettings');
    const darkThemeToggle = document.getElementById('darkThemeToggle');
    const editLogoBtn = document.getElementById('editLogoBtn');
    const logoUpload = document.getElementById('logoUpload');
    const profileImg = document.getElementById('profileImg');
    const profileInitials = document.getElementById('profileInitials');
    const printProfileImg = document.getElementById('printProfileImg');
    
    const goHomeBtn = document.getElementById('goHomeBtn');
    const goDashBtn = document.getElementById('goDashBtn');
    const goStatsBtn = document.getElementById('goStatsBtn');
    const connectSheetsBtn = document.getElementById('connectSheetsBtn');

    // Handle Saved Logo
    const savedLogo = localStorage.getItem('userLogo');
    if (savedLogo) {
        if (profileImg) {
            profileImg.src = savedLogo;
            profileImg.classList.remove('hidden');
        }
        if (profileInitials) profileInitials.classList.add('hidden');
        if (printProfileImg) {
            printProfileImg.src = savedLogo;
            printProfileImg.style.display = 'inline-block';
        }
    }

    // Handle Saved Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' && darkThemeToggle) {
        document.body.setAttribute('data-theme', 'dark');
        darkThemeToggle.checked = true;
    }

    // Open/Close Menu
    if (menuBtn && settingsDrawer) {
        menuBtn.addEventListener('click', () => { settingsDrawer.style.display = 'flex'; });
    }
    if (closeSettings && settingsDrawer) {
        closeSettings.addEventListener('click', () => { settingsDrawer.style.display = 'none'; });
    }
    window.addEventListener('click', (e) => { 
        if (settingsDrawer && e.target === settingsDrawer) settingsDrawer.style.display = 'none'; 
    });

    // Navigation Links
    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    if (goDashBtn) {
        goDashBtn.addEventListener('click', () => {
            window.location.href = 'dash.html'; 
        });
    }
    if (goStatsBtn) {
        goStatsBtn.addEventListener('click', () => {
            window.location.href = 'stats.html';
        });
    }

    // Logo Upload Logic
    if (editLogoBtn && logoUpload) {
        editLogoBtn.addEventListener('click', () => logoUpload.click());
        logoUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64Image = e.target.result;
                    if (profileImg) {
                        profileImg.src = base64Image;
                        profileImg.classList.remove('hidden');
                    }
                    if (profileInitials) profileInitials.classList.add('hidden');
                    if (printProfileImg) {
                        printProfileImg.src = base64Image;
                        printProfileImg.style.display = 'inline-block';
                    }
                    localStorage.setItem('userLogo', base64Image);
                    if (settingsDrawer) settingsDrawer.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Theme Toggle Logic
    if (darkThemeToggle) {
        darkThemeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Connect Google Sheets Logic
    if (connectSheetsBtn) {
        connectSheetsBtn.addEventListener('click', () => {
            const currentUrl = localStorage.getItem('googleSheetsUrl') || '';
            const userUrl = prompt("Paste your Google Apps Script Web App URL here:", currentUrl);
            
            if (userUrl !== null && userUrl.trim() !== "") {
                localStorage.setItem('googleSheetsUrl', userUrl.trim());
                alert("Google Sheets connection saved!");
            } else if (userUrl !== null && userUrl.trim() === "") {
                localStorage.removeItem('googleSheetsUrl');
                alert("Connection URL cleared.");
            }
        });
    }
});
