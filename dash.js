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

    // Dashboard Specific Logic
    const loadDashBtn = document.getElementById('loadDashBtn');
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');

    const btnTrading = document.getElementById('btnTrading');
    const btnDeliveries = document.getElementById('btnDeliveries');
    const dashContent = document.getElementById('dashContent');
    const dashPlaceholder = document.getElementById('dashPlaceholder');

    const mainChartTitle = document.getElementById('mainChartTitle');
    const mainBarChart = document.getElementById('mainBarChart');
    const sideContainers = document.getElementById('sideContainers');
    const timeChartTitle = document.getElementById('timeChartTitle');
    const timeGroupingLabel = document.getElementById('timeGroupingLabel');
    const timeSeriesGraph = document.getElementById('timeSeriesGraph');

    let currentMode = 'trading';
    let cachedTransactions = [];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentVal = `${currentYear}-${currentMonth}`;
    if (fromDateInput) fromDateInput.value = currentVal;
    if (toDateInput) toDateInput.value = currentVal;

    if (btnTrading) {
        btnTrading.addEventListener('click', () => {
            currentMode = 'trading';
            btnTrading.classList.add('active');
            if (btnDeliveries) btnDeliveries.classList.remove('active');
            if (cachedTransactions.length > 0) renderDashboard();
        });
    }

    if (btnDeliveries) {
        btnDeliveries.addEventListener('click', () => {
            currentMode = 'deliveries';
            btnDeliveries.classList.add('active');
            if (btnTrading) btnTrading.classList.remove('active');
            if (cachedTransactions.length > 0) renderDashboard();
        });
    }

    if (loadDashBtn) {
        loadDashBtn.addEventListener('click', async () => {
            const sheetUrl = localStorage.getItem('googleSheetsUrl');
            if (!sheetUrl) {
                alert('Please connect to Google Sheets in the Settings menu first!');
                return;
            }

            loadDashBtn.disabled = true;
            loadDashBtn.innerText = 'Loading...';
            if (dashPlaceholder) {
                dashPlaceholder.style.display = 'block';
                dashPlaceholder.textContent = 'Fetching data from Google Sheets...';
            }
            if (dashContent) dashContent.classList.add('hidden');

            try {
                const response = await fetch(sheetUrl);
                const result = await response.json();

                if (result.result === 'success') {
                    cachedTransactions = result.data || [];
                    renderDashboard();
                } else {
                    if (dashPlaceholder) dashPlaceholder.textContent = `Error: ${result.error || 'Unknown error'}`;
                }
            } catch (err) {
                console.error('Fetch Error:', err);
                if (dashPlaceholder) dashPlaceholder.textContent = 'Network error or invalid Web App URL response.';
            } finally {
                loadDashBtn.disabled = false;
                loadDashBtn.innerText = 'Load Dashboard';
            }
        });
    }

    function renderDashboard() {
        const fromVal = fromDateInput ? fromDateInput.value : '';
        const toVal = toDateInput ? toDateInput.value : '';

        let txs = cachedTransactions.filter(tx => {
            if (!tx.yearMonth) return false;
            if (fromVal && tx.yearMonth < fromVal) return false;
            if (toVal && tx.yearMonth > toVal) return false;
            return true;
        });

        if (txs.length === 0) {
            if (dashPlaceholder) {
                dashPlaceholder.style.display = 'block';
                dashPlaceholder.textContent = 'No transactions found for the selected date range.';
            }
            if (dashContent) dashContent.classList.add('hidden');
            return;
        }

        if (dashPlaceholder) dashPlaceholder.style.display = 'none';
        if (dashContent) dashContent.classList.remove('hidden');

        if (currentMode === 'trading') {
            renderTradingView(txs, fromVal, toVal);
        } else {
            renderDeliveriesView(txs, fromVal, toVal);
        }
    }

    function renderTradingView(txs, fromVal, toVal) {
        let stats = {
            vinted: { name: 'Vinted', count: 0, value: 0 },
            ebay: { name: 'eBay', count: 0, value: 0 },
            facebook: { name: 'Facebook', count: 0, value: 0 },
            expense: { name: 'Expense', count: 0, expense: 0 }
        };

        txs.forEach(tx => {
            const cat = String(tx.category || tx.type || '').toLowerCase();
            const flow = String(tx.flow || '').toLowerCase();
            const amt = Math.abs(parseFloat(String(tx.amount || '').replace('£', '').replace(',', '')) || 0);

            // Filter out deliveries
            if (cat.includes('delivery') || cat.includes('uber') || cat.includes('just eat') || cat.includes('amazon')) return;

            if (flow.includes('in') && (cat.includes('trading') || cat.includes('sale') || cat.includes('vinted') || cat.includes('ebay') || cat.includes('facebook'))) {
                if (cat.includes('ebay')) { stats.ebay.count++; stats.ebay.value += amt; }
                else if (cat.includes('facebook') || cat.includes('fb')) { stats.facebook.count++; stats.facebook.value += amt; }
                else { stats.vinted.count++; stats.vinted.value += amt; }
            } else if (flow.includes('out') && (cat.includes('stock purchase') || cat.includes('expense') || cat.includes('trading'))) {
                stats.expense.expense += amt;
                stats.expense.count++;
            }
        });

        const activeItems = Object.keys(stats).filter(key => stats[key].count > 0 || stats[key].value > 0 || stats[key].expense > 0);

        if (activeItems.length === 0) {
            if (dashPlaceholder) {
                dashPlaceholder.style.display = 'block';
                dashPlaceholder.textContent = 'No trading data found for this period.';
            }
            if (dashContent) dashContent.classList.add('hidden');
            return;
        }

        const totalCount = ['vinted', 'ebay', 'facebook'].reduce((sum, k) => sum + stats[k].count, 0);
        const totalValue = ['vinted', 'ebay', 'facebook'].reduce((sum, k) => sum + stats[k].value, 0);
        const totalExpense = stats.expense.expense;
        const totalProfit = totalValue - totalExpense;

        if (mainChartTitle) {
            mainChartTitle.innerHTML = `
                Trading Sales Value & Count<br>
                <span style="font-size: 11px; font-weight: normal; color: var(--label-color);">
                    Total Items Sold: <strong>${totalCount}</strong> | 
                    Sales Value: <strong style="color: #107c41;">£${totalValue.toFixed(2)}</strong> | 
                    Total Profit: <strong style="color: ${totalProfit >= 0 ? '#107c41' : '#d83b01'};">£${totalProfit.toFixed(2)}</strong>
                </span>
            `;
        }

        const maxVal = Math.max(...activeItems.map(k => {
            if (k === 'expense') return stats[k].expense;
            return Math.max(stats[k].value, stats[k].count);
        }), 1);

        const slotWidth = 340 / activeItems.length;

        let barsSvg = '';
        let sideCardsHtml = '';

        activeItems.forEach((key, index) => {
            const item = stats[key];
            const slotCenter = 40 + (index * slotWidth) + (slotWidth / 2);

            if (key === 'expense') {
                const barH = (item.expense / maxVal) * 130;
                const xPos = slotCenter - 11;
                barsSvg += `
                    ${item.expense > 0 ? `
                        <rect x="${xPos}" y="${160 - barH}" width="22" height="${barH}" fill="#d83b01" stroke="#000" stroke-width="1.5" />
                        <text x="${xPos + 11}" y="${Math.max(18, 160 - barH - 4)}" font-size="8" text-anchor="middle" fill="var(--text-color)" font-weight="bold">£${item.expense.toFixed(0)}</text>
                    ` : ''}
                    <text x="${slotCenter}" y="175" font-size="10" text-anchor="middle" fill="var(--text-color)" font-weight="bold">Expense</text>
                `;
            } else {
                const valH = (item.value / maxVal) * 130;
                const cntH = (item.count / maxVal) * 130;
                const xVal = slotCenter - 23;
                const xCnt = slotCenter + 1;

                barsSvg += `
                    <rect x="${xVal}" y="${160 - valH}" width="22" height="${valH}" fill="#f7931e" stroke="#000" stroke-width="1.5" />
                    ${item.value > 0 ? `<text x="${xVal + 11}" y="${Math.max(18, 160 - valH - 4)}" font-size="8" text-anchor="middle" fill="var(--text-color)" font-weight="bold">£${item.value.toFixed(0)}</text>` : ''}
                    <rect x="${xCnt}" y="${160 - cntH}" width="22" height="${cntH}" fill="#8b5cf6" stroke="#000" stroke-width="1.5" />
                    ${item.count > 0 ? `<text x="${xCnt + 11}" y="${Math.max(18, 160 - cntH - 4)}" font-size="8" text-anchor="middle" fill="var(--text-color)" font-weight="bold">${item.count}</text>` : ''}
                    <text x="${slotCenter}" y="175" font-size="10" text-anchor="middle" fill="var(--text-color)" font-weight="bold">${item.name}</text>
                `;
            }

            sideCardsHtml += `
                <div class="side-card">
                    <div class="side-card-title">${key === 'expense' ? 'Trading Expenses' : item.name}</div>
                    <div style="font-size: 11px; color: var(--label-color);">${key === 'expense' ? 'Stock Outflows' : 'Sold: ' + item.count}</div>
                    <div class="side-card-val" style="color: ${key === 'expense' ? '#d83b01' : 'inherit'};">£${key === 'expense' ? item.expense.toFixed(2) : item.value.toFixed(2)}</div>
                </div>
            `;
        });

        // Add the extra Total Profit Summary Box at the end
        sideCardsHtml += `
            <div class="side-card" style="border: 2px dashed #107c41;">
                <div class="side-card-title" style="color: #107c41; font-weight: bold;">Total Profit</div>
                <div style="font-size: 11px; color: var(--label-color);">Sales minus Expenses</div>
                <div class="side-card-val" style="color: ${totalProfit >= 0 ? '#107c41' : '#d83b01'};">£${totalProfit.toFixed(2)}</div>
            </div>
        `;

        if (mainBarChart) {
            mainBarChart.innerHTML = `
                <div style="display: flex; justify-content: flex-end; gap: 15px; font-size: 11px; margin-bottom: 8px;">
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: #f7931e; display: inline-block; border: 1px solid #000;"></span> Sales Value (£)</span>
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: #8b5cf6; display: inline-block; border: 1px solid #000;"></span> Items Sold</span>
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: #d83b01; display: inline-block; border: 1px solid #000;"></span> Expenses (£)</span>
                </div>
                <svg viewBox="0 0 400 200" style="width: 100%; height: auto; background: var(--input-bg); border-radius: 6px;">
                    <line x1="40" y1="20" x2="380" y2="20" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="40" y1="60" x2="380" y2="60" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="40" y1="100" x2="380" y2="100" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="40" y1="140" x2="380" y2="140" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="40" y1="160" x2="390" y2="160" stroke="#000" stroke-width="2" />
                    <line x1="40" y1="10" x2="40" y2="160" stroke="#000" stroke-width="2" />
                    ${barsSvg}
                </svg>
            `;
        }

        if (sideContainers) sideContainers.innerHTML = sideCardsHtml;

        renderTimeSeriesGraph(txs, fromVal, toVal, ['vinted', 'ebay', 'facebook'], 'sales');
    }

    function renderDeliveriesView(txs, fromVal, toVal) {
        if (mainChartTitle) mainChartTitle.textContent = 'Deliveries: Earnings & Expenses';

        let stats = {
            uber: { name: 'Uber', count: 0, earned: 0 },
            justeat: { name: 'Just Eat', count: 0, earned: 0 },
            amazon: { name: 'Amazon', count: 0, earned: 0 },
            expense: { name: 'Expense', count: 0, expense: 0 }
        };

        txs.forEach(tx => {
            const cat = String(tx.category || tx.type || '').toLowerCase();
            const flow = String(tx.flow || '').toLowerCase();
            const amt = Math.abs(parseFloat(String(tx.amount || '').replace('£', '').replace(',', '')) || 0);

            // Only process delivery-related rows
            if (!cat.includes('delivery') && !cat.includes('uber') && !cat.includes('just eat') && !cat.includes('justeat') && !cat.includes('amazon')) {
                return;
            }

            if (flow.includes('in')) {
                if (cat.includes('just eat') || cat.includes('justeat')) {
                    stats.justeat.count++;
                    stats.justeat.earned += amt;
                } else if (cat.includes('amazon')) {
                    stats.amazon.count++;
                    stats.amazon.earned += amt;
                } else {
                    stats.uber.count++;
                    stats.uber.earned += amt;
                }
            } else {
                stats.expense.expense += amt;
                stats.expense.count++;
            }
        });

        const activeItems = Object.keys(stats).filter(key => stats[key].count > 0 || stats[key].earned > 0 || stats[key].expense > 0);

        if (activeItems.length === 0) {
            if (dashPlaceholder) {
                dashPlaceholder.style.display = 'block';
                dashPlaceholder.textContent = 'No delivery data found for this period.';
            }
            if (dashContent) dashContent.classList.add('hidden');
            return;
        }

        const maxVal = Math.max(...activeItems.map(k => {
            if (k === 'expense') return stats[k].expense;
            return Math.max(stats[k].earned, stats[k].count);
        }), 1);

        const slotWidth = 340 / activeItems.length;

        let barsSvg = '';
        let sideCardsHtml = '';

        activeItems.forEach((key, index) => {
            const item = stats[key];
            const slotCenter = 40 + (index * slotWidth) + (slotWidth / 2);

            if (key === 'expense') {
                const barH = (item.expense / maxVal) * 130;
                const xPos = slotCenter - 11;
                barsSvg += `
                    ${item.expense > 0 ? `
                        <rect x="${xPos}" y="${160 - barH}" width="22" height="${barH}" fill="#d83b01" stroke="#000" stroke-width="1.5" />
                        <text x="${xPos + 11}" y="${Math.max(18, 160 - barH - 4)}" font-size="8" text-anchor="middle" fill="var(--text-color)" font-weight="bold">£${item.expense.toFixed(0)}</text>
                    ` : ''}
                    <text x="${slotCenter}" y="175" font-size="10" text-anchor="middle" fill="var(--text-color)" font-weight="bold">${item.name}</text>
                `;
            } else {
                const earnedH = (item.earned / maxVal) * 130;
                const countH = (item.count / maxVal) * 130;
                const xEarned = slotCenter - 23;
                const xCount = slotCenter + 1;

                barsSvg += `
                    <rect x="${xEarned}" y="${160 - earnedH}" width="22" height="${earnedH}" fill="#107c41" stroke="#000" stroke-width="1.5" />
                    ${item.earned > 0 ? `<text x="${xEarned + 11}" y="${Math.max(18, 160 - earnedH - 4)}" font-size="8" text-anchor="middle" fill="var(--text-color)" font-weight="bold">£${item.earned.toFixed(0)}</text>` : ''}
                    
                    <rect x="${xCount}" y="${160 - countH}" width="22" height="${countH}" fill="#0078d4" stroke="#000" stroke-width="1.5" />
                    ${item.count > 0 ? `<text x="${xCount + 11}" y="${Math.max(18, 160 - countH - 4)}" font-size="8" text-anchor="middle" fill="var(--text-color)" font-weight="bold">${item.count}</text>` : ''}
                    
                    <text x="${slotCenter}" y="175" font-size="10" text-anchor="middle" fill="var(--text-color)" font-weight="bold">${item.name}</text>
                `;
            }

            sideCardsHtml += `
                <div class="side-card">
                    <div class="side-card-title">${item.name}</div>
                    <div style="font-size: 11px; color: var(--label-color);">${key === 'expense' ? 'Total Expenses' : 'Count: ' + item.count}</div>
                    <div class="side-card-val" style="color: ${key === 'expense' ? '#d83b01' : '#107c41'};">£${key === 'expense' ? item.expense.toFixed(2) : item.earned.toFixed(2)}</div>
                </div>
            `;
        });

        if (mainBarChart) {
            mainBarChart.innerHTML = `
                <div style="display: flex; justify-content: flex-end; gap: 15px; font-size: 11px; margin-bottom: 8px;">
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: #107c41; display: inline-block; border: 1px solid #000;"></span> Earnings (£)</span>
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: #0078d4; display: inline-block; border: 1px solid #000;"></span> Delivery Count</span>
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; background: #d83b01; display: inline-block; border: 1px solid #000;"></span> Expenses (£)</span>
                </div>
                <svg viewBox="0 0 400 200" style="width: 100%; height: auto; background: var(--input-bg); border-radius: 6px;">
                    <line x1="40" y1="20" x2="380" y2="20" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="40" y1="60" x2="380" y2="60" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="40" y1="100" x2="380" y2="100" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="40" y1="140" x2="380" y2="140" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="40" y1="160" x2="390" y2="160" stroke="#000" stroke-width="2" />
                    <line x1="40" y1="10" x2="40" y2="160" stroke="#000" stroke-width="2" />
                    ${barsSvg}
                </svg>
            `;
        }

        if (sideContainers) sideContainers.innerHTML = sideCardsHtml;

        renderTimeSeriesGraph(txs, fromVal, toVal, ['uber', 'justeat', 'amazon'], 'deliveries');
    }

    function renderTimeSeriesGraph(txs, fromVal, toVal, platforms, metricType) {
        if (timeChartTitle) {
            timeChartTitle.textContent = currentMode === 'trading' ? 'Sales Performance Breakdown' : 'Weekly Delivery Performance';
        }

        let spanMonths = 1;
        if (fromVal && toVal) {
            const [fYear, fMonth] = fromVal.split('-').map(Number);
            const [tYear, tMonth] = toVal.split('-').map(Number);
            spanMonths = (tYear - fYear) * 12 + (tMonth - fMonth) + 1;
        }

        let groupingRule = 'daily';
        if (spanMonths >= 12) {
            groupingRule = 'monthly';
        } else if (spanMonths > 2) {
            groupingRule = '15days';
        } else {
            groupingRule = 'daily';
        }

        if (timeGroupingLabel) {
            timeGroupingLabel.textContent = `Interval Grouping: ${groupingRule === 'daily' ? 'Daily' : groupingRule === '15days' ? '15-Day Intervals' : 'Monthly'}`;
        }

        let groupedData = {};

        let startDate = new Date(fromVal ? fromVal + '-01' : new Date().setDate(1));
        let endDate = new Date(toVal ? toVal + '-31' : new Date());
        
        txs.forEach(tx => {
            if (!tx.date) return;
            const d = new Date(tx.date);
            if (!isNaN(d)) {
                if (d < startDate) startDate = new Date(d);
                if (d > endDate) endDate = new Date(d);
            }
        });

        if (groupingRule === 'daily') {
            let curr = new Date(startDate);
            if (fromVal) curr = new Date(fromVal + '-01');
            let lastDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
            if (toVal) {
                const [tY, tM] = toVal.split('-').map(Number);
                lastDay = new Date(tY, tM, 0);
            }

            while (curr <= lastDay) {
                const k = curr.toISOString().split('T')[0];
                groupedData[k] = { [platforms[0]]: 0, [platforms[1]]: 0, [platforms[2]]: 0 };
                curr.setDate(curr.getDate() + 1);
            }
        }

        txs.forEach(tx => {
            if (!tx.date) return;
            const dateObj = new Date(tx.date);
            if (isNaN(dateObj)) return;

            const flow = String(tx.flow || '').toLowerCase();
            if (!flow.includes('in')) return;

            let key = '';
            if (groupingRule === 'monthly') {
                key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            } else if (groupingRule === '15days') {
                const day = dateObj.getDate();
                const half = day <= 15 ? 'H1' : 'H2';
                key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')} (${half})`;
            } else {
                key = tx.date.split('T')[0];
            }

            if (!groupedData[key]) {
                groupedData[key] = {
                    [platforms[0]]: 0,
                    [platforms[1]]: 0,
                    [platforms[2]]: 0
                };
            }

            const cat = String(tx.category || tx.type || '').toLowerCase();
            const amt = Math.abs(parseFloat(String(tx.amount || '').replace('£', '').replace(',', '')) || 0);

            let matchedPlatform = platforms[0];
            if (metricType === 'deliveries') {
                if (cat.includes('just eat') || cat.includes('justeat')) matchedPlatform = platforms[1];
                else if (cat.includes('amazon')) matchedPlatform = platforms[2];
                else matchedPlatform = platforms[0];
            } else {
                if (cat.includes('ebay')) matchedPlatform = platforms[1];
                else if (cat.includes('facebook') || cat.includes('fb')) matchedPlatform = platforms[2];
                else matchedPlatform = platforms[0];
            }

            groupedData[key][matchedPlatform] += amt;
        });

        const sortedKeys = Object.keys(groupedData).sort();

        if (sortedKeys.length === 0) {
            if (timeSeriesGraph) timeSeriesGraph.innerHTML = '<div style="text-align: center; font-size: 12px; color: var(--label-color);">No interval data available for this timeframe.</div>';
            return;
        }

        let maxVal = 1;
        sortedKeys.forEach(key => {
            const row = groupedData[key];
            maxVal = Math.max(maxVal, row[platforms[0]], row[platforms[1]], row[platforms[2]]);
        });

        const svgWidth = 500;
        const svgHeight = 220;
        const chartWidth = 420;
        const chartHeight = 150;
        const xStep = sortedKeys.length > 1 ? chartWidth / (sortedKeys.length - 1) : chartWidth;

        let p1Points = [];
        let p2Points = [];
        let p3Points = [];

        sortedKeys.forEach((key, index) => {
            const row = groupedData[key];
            const x = 60 + (index * xStep);
            
            const y1 = 180 - ((row[platforms[0]] / maxVal) * chartHeight);
            const y2 = 180 - ((row[platforms[1]] / maxVal) * chartHeight);
            const y3 = 180 - ((row[platforms[2]] / maxVal) * chartHeight);

            p1Points.push(`${x},${y1}`);
            p2Points.push(`${x},${y2}`);
            p3Points.push(`${x},${y3}`);
        });

        if (timeSeriesGraph) {
            timeSeriesGraph.innerHTML = `
                <div style="display: flex; justify-content: flex-end; gap: 15px; font-size: 11px; margin-bottom: 8px;">
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 3px; background: #f7931e; display: inline-block;"></span> ${platforms[0]}</span>
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 3px; background: #8b5cf6; display: inline-block;"></span> ${platforms[1]}</span>
                    <span style="display: flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 3px; background: #0078d4; display: inline-block;"></span> ${platforms[2]}</span>
                </div>
                <svg viewBox="0 0 ${svgWidth} ${svgHeight}" style="width: 100%; height: auto; background: var(--input-bg); border-radius: 6px;">
                    <line x1="50" y1="30" x2="480" y2="30" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="50" y1="67" x2="480" y2="67" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="50" y1="105" x2="480" y2="105" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="50" y1="142" x2="480" y2="142" stroke="#ccc" stroke-dasharray="3,3" />
                    <line x1="50" y1="180" x2="480" y2="180" stroke="#000" stroke-width="1.5" />

                    <polyline fill="none" stroke="#f7931e" stroke-width="2.5" points="${p1Points.join(' ')}" />
                    <polyline fill="none" stroke="#8b5cf6" stroke-width="2.5" points="${p2Points.join(' ')}" />
                    <polyline fill="none" stroke="#0078d4" stroke-width="2.5" points="${p3Points.join(' ')}" />

                    ${sortedKeys.map((key, index) => {
                        const x = 60 + (index * xStep);
                        const shortKey = key.length > 8 ? key.slice(5) : key;
                        return `<text x="${x}" y="195" font-size="9" text-anchor="middle" fill="var(--text-color)">${shortKey}</text>`;
                    }).join('')}
                </svg>
            `;
        }
    }
});