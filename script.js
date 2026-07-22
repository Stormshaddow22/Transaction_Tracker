document.addEventListener('DOMContentLoaded', () => {
    // Form Elements
    const trackerForm = document.getElementById('trackerForm');
    const mainCategory = document.getElementById('mainCategory');
    const deliveryGroup = document.getElementById('deliveryGroup');
    const deliveryType = document.getElementById('deliveryType');
    const foodPlatformGroup = document.getElementById('foodPlatformGroup');
    const foodPlatform = document.getElementById('foodPlatform');
    const tradingGroup = document.getElementById('tradingGroup');
    const tradingType = document.getElementById('tradingType');
    const salePlatformGroup = document.getElementById('salePlatformGroup');
    const salePlatform = document.getElementById('salePlatform');
    const amountGroup = document.getElementById('amountGroup');
    const amountInput = document.getElementById('Amount');
    const flowIndicator = document.getElementById('flowIndicator');
    const paymentGroup = document.getElementById('paymentGroup');
    const paymentMode = document.getElementById('Payment Mode');
    const noteGroup = document.getElementById('noteGroup');
    const reviewBtn = document.getElementById('reviewBtn');
    
    // Modal Elements
    const reviewModal = document.getElementById('reviewModal');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');

    // Settings Elements
    const menuBtn = document.getElementById('menuBtn');
    const settingsDrawer = document.getElementById('settingsDrawer');
    const closeSettings = document.getElementById('closeSettings');
    const darkThemeToggle = document.getElementById('darkThemeToggle');
    const editLogoBtn = document.getElementById('editLogoBtn');
    const logoUpload = document.getElementById('logoUpload');
    const profileImg = document.getElementById('profileImg');
    const profileInitials = document.getElementById('profileInitials');
    const connectSheetsBtn = document.getElementById('connectSheetsBtn');
    const goToStats = document.getElementById('goToStats');

    // Initialize Default Date
    document.getElementById('Date').valueAsDate = new Date();

    let computedFlow = '';
    let finalPlatformOrType = '';

    // Load saved logo
    const savedLogo = localStorage.getItem('userLogo');
    if (savedLogo) {
        profileImg.src = savedLogo;
        profileImg.classList.remove('hidden');
        profileInitials.classList.add('hidden');
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        darkThemeToggle.checked = true;
    }

    // Settings Drawer Open/Close
    menuBtn.addEventListener('click', () => { settingsDrawer.style.display = 'flex'; });
    closeSettings.addEventListener('click', () => { settingsDrawer.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === settingsDrawer) settingsDrawer.style.display = 'none'; });

    // Navigate to Sales Stats page
    if (goToStats) {
        goToStats.addEventListener('click', () => {
            window.location.href = 'https://stormshaddow22.github.io/Transaction_Tracker/stats.html';
        });
    }

    // Logo Upload Logic
    editLogoBtn.addEventListener('click', () => logoUpload.click());
    logoUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Image = e.target.result;
                profileImg.src = base64Image;
                profileImg.classList.remove('hidden');
                profileInitials.classList.add('hidden');
                localStorage.setItem('userLogo', base64Image);
                settingsDrawer.style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    // Dark Theme Switch
    darkThemeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Connect Google Sheets URL
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

    // Clear highlights on edit
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(el => {
        el.addEventListener('input', () => el.classList.remove('highlight-error'));
        el.addEventListener('change', () => el.classList.remove('highlight-error'));
    });

    // Category Logic
    mainCategory.addEventListener('change', function() {
        deliveryType.value = ''; foodPlatform.value = ''; tradingType.value = ''; salePlatform.value = '';
        deliveryGroup.classList.add('hidden'); foodPlatformGroup.classList.add('hidden');
        tradingGroup.classList.add('hidden'); salePlatformGroup.classList.add('hidden');
        hideNextSteps();

        if (this.value === 'Delivery') deliveryGroup.classList.remove('hidden');
        else if (this.value === 'Trading') tradingGroup.classList.remove('hidden');
    });

    deliveryType.addEventListener('change', function() {
        foodPlatform.value = ''; foodPlatformGroup.classList.add('hidden');
        if (this.value === 'Food delivered') {
            foodPlatformGroup.classList.remove('hidden');
            hideNextSteps();
        } else {
            computedFlow = (this.value === 'Food delivered') ? 'In' : 'Out';
            flowIndicator.innerText = computedFlow === 'In' ? 'Flow: IN (Positive)' : 'Flow: OUT (Negative)';
            flowIndicator.style.color = computedFlow === 'In' ? '#107c41' : '#d83b01';
            showNextSteps(this.value);
        }
    });

    foodPlatform.addEventListener('change', function() {
        computedFlow = 'In';
        flowIndicator.innerText = 'Flow: IN (Positive)';
        flowIndicator.style.color = '#107c41';
        showNextSteps(this.value + ' (Food)');
    });

    tradingType.addEventListener('change', function() {
        salePlatform.value = ''; salePlatformGroup.classList.add('hidden');
        if (this.value === 'Item sale') {
            salePlatformGroup.classList.remove('hidden');
            hideNextSteps();
        } else if (this.value === 'Stock purchase') {
            computedFlow = 'Out';
            flowIndicator.innerText = 'Flow: OUT (Negative)';
            flowIndicator.style.color = '#d83b01';
            showNextSteps('Stock purchase');
        }
    });

    salePlatform.addEventListener('change', function() {
        computedFlow = 'In';
        flowIndicator.innerText = 'Flow: IN (Positive)';
        flowIndicator.style.color = '#107c41';
        showNextSteps(this.value);
    });

    function showNextSteps(labelIdentifier) {
        finalPlatformOrType = labelIdentifier;
        amountGroup.classList.remove('hidden');
        paymentGroup.classList.remove('hidden');
        noteGroup.classList.remove('hidden');
        reviewBtn.classList.remove('hidden');
    }

    function hideNextSteps() {
        amountGroup.classList.add('hidden');
        paymentGroup.classList.add('hidden');
        noteGroup.classList.add('hidden');
        reviewBtn.classList.add('hidden');
    }

    // Validation
    function validateAndFindBlank() {
        const visibleElements = [
            { el: document.getElementById('Date') },
            { el: mainCategory }
        ];

        if (!deliveryGroup.classList.contains('hidden')) visibleElements.push({ el: deliveryType });
        if (!foodPlatformGroup.classList.contains('hidden')) visibleElements.push({ el: foodPlatform });
        if (!tradingGroup.classList.contains('hidden')) visibleElements.push({ el: tradingType });
        if (!salePlatformGroup.classList.contains('hidden')) visibleElements.push({ el: salePlatform });
        if (!amountGroup.classList.contains('hidden')) visibleElements.push({ el: amountInput });
        if (!paymentGroup.classList.contains('hidden')) visibleElements.push({ el: paymentMode });

        for (let item of visibleElements) {
            if (!item.el.value || item.el.value.trim() === '') {
                item.el.classList.add('highlight-error');
                item.el.focus();
                item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return false;
            }
        }
        return true;
    }

    // Open Modal
    reviewBtn.addEventListener('click', function() {
        if (!validateAndFindBlank()) return;

        let rawAmount = parseFloat(amountInput.value);
        if (isNaN(rawAmount)) {
            amountInput.classList.add('highlight-error');
            amountInput.focus();
            return;
        }

        let adjustedAmount = computedFlow === 'Out' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

        document.getElementById('sumDate').innerText = document.getElementById('Date').value;
        document.getElementById('sumCategory').innerText = finalPlatformOrType;
        document.getElementById('sumFlow').innerText = computedFlow;
        document.getElementById('sumAmount').innerText = '£' + adjustedAmount.toFixed(2);
        document.getElementById('sumPayment').innerText = paymentMode.value || 'Not selected';
        document.getElementById('sumNote').innerText = document.getElementById('Note').value || 'None';

        reviewModal.style.display = 'flex';
    });

    editBtn.addEventListener('click', () => { reviewModal.style.display = 'none'; });

    // Send Data to Google Sheets via fetch()
    saveBtn.addEventListener('click', function() {
        const sheetUrl = localStorage.getItem('googleSheetsUrl');
        
        if (!sheetUrl) {
            alert('Please connect to Google Sheets in the Settings menu first!');
            reviewModal.style.display = 'none';
            return;
        }

        saveBtn.disabled = true;
        saveBtn.innerText = 'Saving...';

        let platformVal = '';
        let itemTypeVal = finalPlatformOrType;

        if (mainCategory.value === 'Delivery') {
            if (deliveryType.value === 'Food delivered') {
                itemTypeVal = 'Food Delivery';
                platformVal = foodPlatform.value;
            } else {
                itemTypeVal = deliveryType.value;
                platformVal = '';
            }
        } else if (mainCategory.value === 'Trading') {
            if (tradingType.value === 'Item sale') {
                itemTypeVal = 'Item Sale';
                platformVal = salePlatform.value;
            } else {
                itemTypeVal = 'Stock Purchase';
                platformVal = '';
            }
        }

        const payload = {
            date: document.getElementById('sumDate').innerText,
            platform: platformVal,
            type: mainCategory.value,  // <--- Add this line here!
            itemType: itemTypeVal,
            flow: document.getElementById('sumFlow').innerText,
            amount: document.getElementById('sumAmount').innerText,
            paymentMode: document.getElementById('sumPayment').innerText,
            note: document.getElementById('sumNote').innerText === 'None' ? '' : document.getElementById('sumNote').innerText
        };

        fetch(sheetUrl, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.result === 'success') {
                alert('Saved to Google Sheets successfully!');
                reviewModal.style.display = 'none';
                
                // Reset form
                trackerForm.reset();
                document.getElementById('Date').valueAsDate = new Date();
                mainCategory.value = '';
                hideNextSteps();
                deliveryGroup.classList.add('hidden');
                tradingGroup.classList.add('hidden');
            } else {
                alert('Error saving data: ' + data.error);
            }
        })
        .catch(err => {
            console.error('Save Error:', err);
            alert('Network error. Check your connection or Web App URL.');
        })
        .finally(() => {
            saveBtn.disabled = false;
            saveBtn.innerText = 'Save';
        });
    });
});
