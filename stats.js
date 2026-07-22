document.addEventListener('DOMContentLoaded', () => {
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
    const goHomeBtn = document.getElementById('goHomeBtn');

    const loadReportBtn = document.getElementById('loadReportBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');
    const statsSummary = document.getElementById('statsSummary');
    
    const statTotalIn = document.getElementById('statTotalIn');
    const statTotalOut = document.getElementById('statTotalOut');
    const statNet = document.getElementById('statNet');
    const statDeliveryEarnings = document.getElementById('statDeliveryEarnings');
    const statDeliveryExpense = document.getElementById('statDeliveryExpense');
    const statTradingEarnings = document.getElementById('statTradingEarnings');
    const statRestockExpense = document.getElementById('statRestockExpense');
    const reportResults = document.getElementById('reportResults');

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonthVal = `${currentYear}-${currentMonth}`;
    
    fromDateInput.value = currentMonthVal;
    toDateInput.value = currentMonthVal;

    const savedLogo = localStorage.getItem('userLogo');
    if (savedLogo) {
        profileImg.src = savedLogo;
        profileImg.classList.remove('hidden');
        profileInitials.classList.add('hidden');

        printProfileImg.src = savedLogo;
        printProfileImg.style.display = 'inline-block';
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        darkThemeToggle.checked = true;
    }

    menuBtn.addEventListener('click', () => { settingsDrawer.style.display = 'flex'; });
    closeSettings.addEventListener('click', () => { settingsDrawer.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === settingsDrawer) settingsDrawer.style.display = 'none'; });

    goHomeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

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

                printProfileImg.src = base64Image;
                printProfileImg.style.display = 'inline-block';

                localStorage.setItem('userLogo', base64Image);
                settingsDrawer.style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    darkThemeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

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

    loadReportBtn.addEventListener('click', async () => {
        const sheetUrl = localStorage.getItem('googleSheetsUrl');
        if (!sheetUrl) {
            alert('Please connect to Google Sheets in the Settings menu first!');
            return;
        }

        const fromVal = fromDateInput.value; 
        const toVal = toDateInput.value;     

        loadReportBtn.disabled = true;
        loadReportBtn.innerText = 'Loading Report...';
        reportResults.innerHTML = '<p style="text-align: center; color: var(--label-color);">Fetching data from Google Sheets...</p>';

        try {
            const response = await fetch(sheetUrl);
            const result = await response.json();

            if (result.result === 'success') {
                let transactions = result.data || [];

                if (fromVal || toVal) {
                    transactions = transactions.filter(tx => {
                        if (!tx.yearMonth) return false;
                        if (fromVal && tx.yearMonth < fromVal) return false;
                        if (toVal && tx.yearMonth > toVal) return false;
                        return true;
                    });
                }

                renderReport(transactions);
            } else {
                reportResults.innerHTML = `<p style="text-align: center; color: var(--error-border);">Error: ${result.error || 'Unknown error'}</p>`;
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            reportResults.innerHTML = `<p style="text-align: center; color: var(--error-border);">Network error or invalid Web App URL response.</p>`;
        } finally {
            loadReportBtn.disabled = false;
            loadReportBtn.innerText = 'Show Report';
        }
    });

    downloadPdfBtn.addEventListener('click', () => {
        window.print();
    });

    function renderReport(transactions) {
        if (transactions.length === 0) {
            statsSummary.classList.add('hidden');
            downloadPdfBtn.classList.add('hidden');
            reportResults.innerHTML = '<p style="text-align: center; color: var(--label-color);">No transactions found for the selected date range.</p>';
            return;
        }

        const fromVal = fromDateInput.value;
        const toVal = toDateInput.value;

        // Render formatted date range (e.g. Jan 2026 - Feb 2027) in PDF header
        const printDateRange = document.getElementById('printDateRange');
        if (printDateRange) {
            const formatMonth = (val) => {
                if (!val) return '';
                const [y, m] = val.split('-');
                const d = new Date(y, m - 1, 1);
                return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            };
            const formattedFrom = formatMonth(fromVal);
            const formattedTo = formatMonth(toVal);

            if (formattedFrom && formattedTo) {
                printDateRange.textContent = `${formattedFrom} - ${formattedTo}`;
            } else if (formattedFrom) {
                printDateRange.textContent = `From ${formattedFrom}`;
            } else if (formattedTo) {
                printDateRange.textContent = `Up to ${formattedTo}`;
            } else {
                printDateRange.textContent = '';
            }
        }

        let deliveryEarnings = 0;
        let deliveryExpense = 0;
        let tradingEarnings = 0;
        let restockExpense = 0;

        let html = `
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--input-border); text-align: left; color: var(--label-color);">
                        <th style="padding: 8px;">Date</th>
                        <th style="padding: 8px;">Category / Platform</th>
                        <th style="padding: 8px;">Flow</th>
                        <th style="padding: 8px; text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
        `;

        transactions.forEach(tx => {
            const cleanAmount = parseFloat(String(tx.amount || '').replace('£', '').replace(',', '')) || 0;
            const absAmount = Math.abs(cleanAmount);
            const flowVal = String(tx.flow || '').toLowerCase();
            const typeVal = String(tx.type || tx.category || '').toLowerCase();
            const cleanDate = tx.date ? tx.date.split('T')[0] : '';

            if (typeVal.includes('delivery')) {
                if (flowVal.includes('in')) {
                    deliveryEarnings += absAmount;
                } else {
                    deliveryExpense += absAmount;
                }
            } else if (typeVal.includes('trading')) {
                if (flowVal.includes('in')) {
                    tradingEarnings += absAmount;
                } else {
                    restockExpense += absAmount;
                }
            } else {
                if (typeVal.includes('stock purchase') || typeVal.includes('sale')) {
                    if (flowVal.includes('in')) tradingEarnings += absAmount;
                    else restockExpense += absAmount;
                } else {
                    if (flowVal.includes('in')) deliveryEarnings += absAmount;
                    else deliveryExpense += absAmount;
                }
            }

            html += `
                <tr style="border-bottom: 1px solid var(--input-border);">
                    <td style="padding: 8px;">${cleanDate}</td>
                    <td style="padding: 8px;">${tx.category || ''}</td>
                    <td style="padding: 8px; color: ${flowVal.includes('out') ? '#d83b01' : '#107c41'}; font-weight: bold;">${tx.flow || ''}</td>
                    <td style="padding: 8px; text-align: right; font-weight: bold;">${tx.amount || ''}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;

        const totalIn = deliveryEarnings + tradingEarnings;
        const totalOut = deliveryExpense + restockExpense;
        const netBalance = totalIn - totalOut;

        statTotalIn.textContent = `£${totalIn.toFixed(2)}`;
        statTotalOut.textContent = `£${totalOut.toFixed(2)}`;
        statNet.textContent = `£${netBalance.toFixed(2)}`;
        statNet.style.color = netBalance >= 0 ? '#107c41' : '#d83b01';

        statDeliveryEarnings.textContent = `£${deliveryEarnings.toFixed(2)}`;
        statDeliveryExpense.textContent = `£${deliveryExpense.toFixed(2)}`;
        statTradingEarnings.textContent = `£${tradingEarnings.toFixed(2)}`;
        statRestockExpense.textContent = `£${restockExpense.toFixed(2)}`;

        statsSummary.classList.remove('hidden');
        downloadPdfBtn.classList.remove('hidden');
        reportResults.innerHTML = html;
    }
});
