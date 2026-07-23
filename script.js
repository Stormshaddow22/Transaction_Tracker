document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // UNIFIED SETTINGS & NAVIGATION MODULE
    // ==========================================
    const menuBtn = document.getElementById('menuBtn');
    const settingsDrawer = document.getElementById('settingsDrawer');
    const closeSettings = document.getElementById('closeSettings');
    const darkThemeToggle = document.getElementById('darkThemeToggle');
    const editLogoBtn = document.getElementById('editLogoBtn');
    const logoUpload = document.getElementById('logoUpload');
    const profileImg = document.getElementById('profileImg');
    const profileInitials = document.getElementById('profileInitials');
    const printProfileImg = document.getElementById('printProfileImg');
    const connectSheetsBtn = document.getElementById('connectSheetsBtn');

    const goHomeBtn = document.getElementById('goHomeBtn') || document.getElementById('goToHome');
    const goStatsBtn = document.getElementById('goStatsBtn') || document.getElementById('goToStats');
    const goDashBtn = document.getElementById('goDashBtn') || document.getElementById('goToDash');

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

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' && darkThemeToggle) {
        document.body.setAttribute('data-theme', 'dark');
        darkThemeToggle.checked = true;
    }

    if (menuBtn && settingsDrawer) {
        menuBtn.addEventListener('click', () => { settingsDrawer.style.display = 'flex'; });
    }
    if (closeSettings && settingsDrawer) {
        closeSettings.addEventListener('click', () => { settingsDrawer.style.display = 'none'; });
    }
    window.addEventListener('click', (e) => { 
        if (settingsDrawer && e.target === settingsDrawer) settingsDrawer.style.display = 'none'; 
    });

    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
            if (settingsDrawer) settingsDrawer.style.display = 'none';
            window.location.href = 'index.html';
        });
    }
    if (goStatsBtn) {
        goStatsBtn.addEventListener('click', () => {
            if (settingsDrawer) settingsDrawer.style.display = 'none';
            window.location.href = 'stats.html';
        });
    }
    if (goDashBtn) {
        goDashBtn.addEventListener('click', () => {
            if (settingsDrawer) settingsDrawer.style.display = 'none';
            window.location.href = 'dash.html';
        });
    }

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
    // ==========================================

    // Form Elements & Logic
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
    
    const reviewModal = document.getElementById('reviewModal');
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');

    const dateInput = document.getElementById('Date');
    if (dateInput) dateInput.valueAsDate = new Date();

    let computedFlow = '';
    let finalPlatformOrType = '';

    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(el => {
        el.addEventListener('input', () => el.classList.remove('highlight-error'));
        el.addEventListener('change', () => el.classList.remove('highlight-error'));
    });

    if (mainCategory) {
        mainCategory.addEventListener('change', function() {
            if (deliveryType) deliveryType.value = '';
            if (foodPlatform) foodPlatform.value = '';
            if (tradingType) tradingType.value = '';
            if (salePlatform) salePlatform.value = '';
            if (deliveryGroup) deliveryGroup.classList.add('hidden');
            if (foodPlatformGroup) foodPlatformGroup.classList.add('hidden');
            if (tradingGroup) tradingGroup.classList.add('hidden');
            if (salePlatformGroup) salePlatformGroup.classList.add('hidden');
            hideNextSteps();

            if (this.value === 'Delivery' && deliveryGroup) deliveryGroup.classList.remove('hidden');
            else if (this.value === 'Trading' && tradingGroup) tradingGroup.classList.remove('hidden');
        });
    }

    if (deliveryType) {
        deliveryType.addEventListener('change', function() {
            if (foodPlatform) foodPlatform.value = '';
            if (foodPlatformGroup) foodPlatformGroup.classList.add('hidden');
            if (this.value === 'Food delivered') {
                if (foodPlatformGroup) foodPlatformGroup.classList.remove('hidden');
                hideNextSteps();
            } else {
                computedFlow = (this.value === 'Food delivered') ? 'In' : 'Out';
                if (flowIndicator) {
                    flowIndicator.innerText = computedFlow === 'In' ? 'Flow: IN (Positive)' : 'Flow: OUT (Negative)';
                    flowIndicator.style.color = computedFlow === 'In' ? '#107c41' : '#d83b01';
                }
                showNextSteps(this.value);
            }
        });
    }

    if (foodPlatform) {
        foodPlatform.addEventListener('change', function() {
            computedFlow = 'In';
            if (flowIndicator) {
                flowIndicator.innerText = 'Flow: IN (Positive)';
                flowIndicator.style.color = '#107c41';
            }
            showNextSteps(this.value + ' (Food)');
        });
    }

    if (tradingType) {
        tradingType.addEventListener('change', function() {
            if (salePlatform) salePlatform.value = '';
            if (salePlatformGroup) salePlatformGroup.classList.add('hidden');
            if (this.value === 'Item sale') {
                if (salePlatformGroup) salePlatformGroup.classList.remove('hidden');
                hideNextSteps();
            } else if (this.value === 'Stock purchase') {
                computedFlow = 'Out';
                if (flowIndicator) {
                    flowIndicator.innerText = 'Flow: OUT (Negative)';
                    flowIndicator.style.color = '#d83b01';
                }
                showNextSteps('Stock purchase');
            }
        });
    }

    if (salePlatform) {
        salePlatform.addEventListener('change', function() {
            computedFlow = 'In';
            if (flowIndicator) {
                flowIndicator.innerText = 'Flow: IN (Positive)';
                flowIndicator.style.color = '#107c41';
            }
            showNextSteps(this.value);
        });
    }

    function showNextSteps(labelIdentifier) {
        finalPlatformOrType = labelIdentifier;
        if (amountGroup) amountGroup.classList.remove('hidden');
        if (paymentGroup) paymentGroup.classList.remove('hidden');
        if (noteGroup) noteGroup.classList.remove('hidden');
        if (reviewBtn) reviewBtn.classList.remove('hidden');
    }

    function hideNextSteps() {
        if (amountGroup) amountGroup.classList.add('hidden');
        if (paymentGroup) paymentGroup.classList.add('hidden');
        if (noteGroup) noteGroup.classList.add('hidden');
        if (reviewBtn) reviewBtn.classList.add('hidden');
    }

    function validateAndFindBlank() {
        const visibleElements = [
            { el: document.getElementById('Date') },
            { el: mainCategory }
        ];

        if (deliveryGroup && !deliveryGroup.classList.contains('hidden')) visibleElements.push({ el: deliveryType });
        if (foodPlatformGroup && !foodPlatformGroup.classList.contains('hidden')) visibleElements.push({ el: foodPlatform });
        if (tradingGroup && !tradingGroup.classList.contains('hidden')) visibleElements.push({ el: tradingType });
        if (salePlatformGroup && !salePlatformGroup.classList.contains('hidden')) visibleElements.push({ el: salePlatform });
        if (amountGroup && !amountGroup.classList.contains('hidden')) visibleElements.push({ el: amountInput });
        if (paymentGroup && !paymentGroup.classList.contains('hidden')) visibleElements.push({ el: paymentMode });

        for (let item of visibleElements) {
            if (item.el && (!item.el.value || item.el.value.trim() === '')) {
                item.el.classList.add('highlight-error');
                item.el.focus();
                item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return false;
            }
        }
        return true;
    }

    if (reviewBtn) {
        reviewBtn.addEventListener('click', function() {
            if (!validateAndFindBlank()) return;

            let rawAmount = parseFloat(amountInput ? amountInput.value : 0);
            if (isNaN(rawAmount)) {
                if (amountInput) {
                    amountInput.classList.add('highlight-error');
                    amountInput.focus();
                }
                return;
            }

            let adjustedAmount = computedFlow === 'Out' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

            const sumDate = document.getElementById('sumDate');
            const sumCategory = document.getElementById('sumCategory');
            const sumFlow = document.getElementById('sumFlow');
            const sumAmount = document.getElementById('sumAmount');
            const sumPayment = document.getElementById('sumPayment');
            const sumNote = document.getElementById('sumNote');
            const dateEl = document.getElementById('Date');
            const noteEl = document.getElementById('Note');

            if (sumDate && dateEl) sumDate.innerText = dateEl.value;
            if (sumCategory) sumCategory.innerText = finalPlatformOrType;
            if (sumFlow) sumFlow.innerText = computedFlow;
            if (sumAmount) sumAmount.innerText = '£' + adjustedAmount.toFixed(2);
            if (sumPayment && paymentMode) sumPayment.innerText = paymentMode.value || 'Not selected';
            if (sumNote && noteEl) sumNote.innerText = noteEl.value || 'None';

            if (reviewModal) reviewModal.style.display = 'flex';
        });
    }

    if (editBtn) {
        editBtn.addEventListener('click', () => { if (reviewModal) reviewModal.style.display = 'none'; });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const sheetUrl = localStorage.getItem('googleSheetsUrl');
            
            if (!sheetUrl) {
                alert('Please connect to Google Sheets in the Settings menu first!');
                if (reviewModal) reviewModal.style.display = 'none';
                return;
            }

            saveBtn.disabled = true;
            saveBtn.innerText = 'Saving...';

            let platformVal = '';
            let itemTypeVal = finalPlatformOrType;

            if (mainCategory && mainCategory.value === 'Delivery') {
                if (deliveryType && deliveryType.value === 'Food delivered') {
                    itemTypeVal = 'Food Delivery';
                    platformVal = foodPlatform ? foodPlatform.value : '';
                } else {
                    itemTypeVal = deliveryType ? deliveryType.value : '';
                    platformVal = '';
                }
            } else if (mainCategory && mainCategory.value === 'Trading') {
                if (tradingType && tradingType.value === 'Item sale') {
                    itemTypeVal = 'Item Sale';
                    platformVal = salePlatform ? salePlatform.value : '';
                } else {
                    itemTypeVal = 'Stock Purchase';
                    platformVal = '';
                }
            }

            const sumDate = document.getElementById('sumDate');
            const sumFlow = document.getElementById('sumFlow');
            const sumAmount = document.getElementById('sumAmount');
            const sumPayment = document.getElementById('sumPayment');
            const sumNote = document.getElementById('sumNote');

            const payload = {
                date: sumDate ? sumDate.innerText : '',
                platform: platformVal,
                type: mainCategory ? mainCategory.value : '',
                itemType: itemTypeVal,
                flow: sumFlow ? sumFlow.innerText : '',
                amount: sumAmount ? sumAmount.innerText : '',
                paymentMode: sumPayment ? sumPayment.innerText : '',
                note: (sumNote && sumNote.innerText !== 'None') ? sumNote.innerText : ''
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
                    if (reviewModal) reviewModal.style.display = 'none';
                    
                    if (trackerForm) trackerForm.reset();
                    const dateEl = document.getElementById('Date');
                    if (dateEl) dateEl.valueAsDate = new Date();
                    if (mainCategory) mainCategory.value = '';
                    hideNextSteps();
                    if (deliveryGroup) deliveryGroup.classList.add('hidden');
                    if (tradingGroup) tradingGroup.classList.add('hidden');
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
    }
});
