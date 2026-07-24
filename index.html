<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Transaction Tracker</title>
    
    <!-- PWA Manifest & iOS Support -->
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icon-192x192.png">
    <meta name="apple-mobile-web-app-status-bar" content="#107c41">
    <meta name="theme-color" content="#107c41">

    <!-- External Stylesheet -->
    <link rel="stylesheet" href="styles.css">
</head>
<body data-theme="light">

<!-- Top Left Floating Bar: Profile/Logo -->
<div class="top-left-bar">
    <div class="profile-container" id="profileContainer" title="Custom Logo / Profile Picture">
        <span class="profile-placeholder" id="profileInitials">Me</span>
        <img id="profileImg" src="" alt="Logo" class="hidden">
    </div>
</div>

<!-- Top Right Floating Bar: Sandwich Menu -->
<div class="top-right-bar">
    <div class="menu-icon" id="menuBtn" title="Settings Menu">☰</div>
   </div>

<div class="form-container">
    <h2>Add Transaction</h2>
    <form id="trackerForm">
        
        <!-- Date with calendar picker trigger -->
        <div class="form-group" style="position: relative;">
            <label for="Date">Date</label>
            <div style="position: relative; display: flex; align-items: center;">
                <input type="text" id="Date" name="Date" placeholder="DD/MM/YYYY" readonly required style="cursor: pointer; background-color: inherit; color: inherit;">
                <input type="date" id="hiddenDatePicker" style="position: absolute; opacity: 0; pointer-events: none; width: 100%; height: 100%; left: 0; top: 0;">
            </div>
        </div>

        <!-- Main Category -->
        <div class="form-group">
            <label for="mainCategory">Choice</label>
            <select id="mainCategory" required>
                <option value="" disabled selected>Select category...</option>
                <option value="Trading">Trading</option>
                <option value="Delivery">Delivery</option>
            </select>
        </div>

        <!-- Delivery Sub-options -->
        <div class="form-group hidden" id="deliveryGroup">
            <label for="deliveryType">Delivery Type</label>
            <select id="deliveryType">
                <option value="" disabled selected>Select delivery option...</option>
                <option value="Food delivered">Food delivered</option>
                <option value="Car maintainence">Car maintainence</option>
                <option value="Fuel">Fuel</option>
                <option value="Insurance">Insurance</option>
                <option value="Delivery expense">Delivery expense</option>
            </select>
        </div>

        <!-- Food Delivery Sub-options -->
        <div class="form-group hidden" id="foodPlatformGroup">
            <label for="foodPlatform">Food App</label>
            <select id="foodPlatform">
                <option value="" disabled selected>Select platform...</option>
                <option value="Uber">Uber</option>
                <option value="Just eat">Just Eat</option>
                <option value="Deliveroo">Deliveroo</option>
                <option value="Amazon">Amazon</option>
            </select>
        </div>

        <!-- Trading Sub-options -->
        <div class="form-group hidden" id="tradingGroup">
            <label for="tradingType">Trading Type</label>
            <select id="tradingType">
                <option value="" disabled selected>Select trading option...</option>
                <option value="Stock purchase">Stock purchase</option>
                <option value="Item sale">Item sale</option>
            </select>
        </div>

        <!-- Item Sale Sub-options -->
        <div class="form-group hidden" id="salePlatformGroup">
            <label for="salePlatform">Platform</label>
            <select id="salePlatform">
                <option value="" disabled selected>Select platform...</option>
                <option value="Vinted">Vinted</option>
                <option value="Facebook">Facebook</option>
                <option value="EBay">eBay</option>
            </select>
        </div>

        <!-- Amount -->
        <div class="form-group hidden" id="amountGroup">
            <label for="Amount">Amount (£)</label>
            <input type="number" step="0.01" id="Amount" placeholder="0.00" required>
            <small id="flowIndicator" style="font-weight: bold; display: block; margin-top: 4px;"></small>
        </div>

        <!-- Payment Mode -->
        <div class="form-group hidden" id="paymentGroup">
            <label for="Payment Mode">Payment Mode</label>
            <select id="Payment Mode">
                <option value="" disabled selected>Select payment mode...</option>
                <option value="Cash">Cash</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank transfer">Bank transfer</option>
            </select>
        </div>

        <!-- Note -->
        <div class="form-group hidden" id="noteGroup">
            <label for="Note">Note (Optional)</label>
            <textarea id="Note" rows="2" placeholder="Optional notes..."></textarea>
        </div>

        <button type="button" id="reviewBtn" class="hidden">Review Entry</button>
    </form>
</div>

<!-- Confirmation Modal Popup -->
<div class="modal" id="reviewModal">
    <div class="modal-content">
        <h3>Confirm Entry</h3>
        <div class="summary-item"><span>Date:</span> <span id="sumDate"></span></div>
        <div class="summary-item"><span>Platform / Type:</span> <span id="sumCategory"></span></div>
        <div class="summary-item"><span>IN / OUT:</span> <span id="sumFlow"></span></div>
        <div class="summary-item"><span>Amount:</span> <span id="sumAmount"></span></div>
        <div class="summary-item"><span>Payment Mode:</span> <span id="sumPayment"></span></div>
        <div class="summary-item"><span>Note:</span> <span id="sumNote"></span></div>

        <div class="modal-buttons">
            <button type="button" class="btn-edit" id="editBtn">Edit</button>
            <button type="button" id="saveBtn">Save</button>
        </div>
    </div>
</div>

<!-- External JavaScript Link -->
<script src="settings.js" defer></script>
<script src="script.js" defer></script>

<!-- PWA Service Worker Registration -->
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
</script>

<!-- Custom Success Modal -->
<div class="modal" id="successModal">
    <div class="modal-content" style="text-align: center;">
        <h3 style="color: var(--primary-color);">Good job Lets keep going</h3>
        <p style="margin: 15px 0; font-size: 14px; font-weight: 500;">Changes saved succesfully</p>
        <button type="button" id="successOkBtn" style="margin-top: 10px;">OK</button>
    </div>
</div>
</body>
</html>
