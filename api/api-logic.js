// api-logic.js

// mpReq function
async function mpReq() {
    // Scrolls the main parent page to the top for better UX
    window.top.scrollTo({ top: 0, behavior: 'smooth' });
    
    const form = document.getElementById("form");
    const payButton = document.querySelector("button[onclick='mpReq()']");
    const responseType = document.getElementById("MPI_RESPONSE_TYPE").value;

    // 1. Set Return URL from Config
    document.getElementById("MPI_RETURN_URL").value = CONFIG.VERCEL_CALLBACK_URL;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Disable empty fields (Server requires this for MAC verification)
    inputs.forEach(input => {
        if (!input.value.trim()) input.disabled = true;
    });

    // --- CASE A: Standard Form Redirect ---
    if (!responseType) {
        payButton.disabled = true;
        payButton.innerText = "Redirecting...";
        form.submit();
        
        // Cleanup UI in case they navigate back
        setTimeout(() => {
            inputs.forEach(input => input.disabled = false);
            payButton.disabled = false;
            payButton.innerText = "Pay";
        }, 2000);
        return; 
    }

    // --- CASE B: JSON Capture and Forward ---
    payButton.disabled = true;
    payButton.innerText = "Processing...";

    // Re-enable to gather data for the manual fetch payload
    inputs.forEach(input => input.disabled = false);
    const formData = new FormData(form);
    const payload = new URLSearchParams();
    
    formData.forEach((value, key) => {
        if (value.trim() !== "") payload.append(key, value);
    });

    try {
        const response = await fetch(CONFIG.PAYMENT_REQUEST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payload
        });

        const data = await response.json();

        // Dynamically build the redirect form to Vercel
        const callbackForm = document.getElementById("redirect-form");
        callbackForm.action = CONFIG.VERCEL_CALLBACK_URL; 
        callbackForm.method = "POST";
        callbackForm.innerHTML = ""; 

        Object.keys(data).forEach(key => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            // Handle nested objects by stringifying them
            input.value = typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key];
            callbackForm.appendChild(input);
        });

        callbackForm.submit();

    } catch (error) {
        console.error('Error:', error);
        alert("Fetch failed. Check CORS or network.");
        payButton.disabled = false;
        payButton.innerText = "Pay";
    }
}


// Channel Inquiry function
function channel() {
    const MID = document.forms["form"]["MPI_MERC_ID"].value;
    const transactionID = document.forms["form"]["MPI_TRXN_ID"].value;
    const MAC = document.forms["form"]["MPI_MAC"].value;

    const params = new URLSearchParams({
        "MPI_MERC_ID": MID,
        "MPI_TRXN_ID": transactionID,
        "MPI_MAC": MAC
    });

    // Calling from CONFIG
    fetch(`${CONFIG.GET_CHANNEL_URL}?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('table-body');
            tbody.innerHTML = ""; 
            // ... rest of your logic
        });
}

async function mkReq() {
    let MID = document.forms["form"]["MPI_MERC_ID"].value;
    let transactionID = document.forms["form"]["MPI_TRXN_ID"].value;

    const raw = JSON.stringify({
        "merchantId": MID,
        "pubKey": CONFIG.PUBLICKEY, // Calling from CONFIG
        "purchaseId": transactionID
    });

    try {
        const response = await fetch(CONFIG.KEY_EXCHANGE_URL, { // Calling from CONFIG
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: raw
        });
        const result = await response.json();
        alert(result.errorCode === "000" ? "✅ Success" : "❌ Failed");
    } catch (error) {
        alert("⚠️ Connection Error");
    }
}

async function mpi_mkReq() {
    let MID = document.forms["form"]["MPI_MERC_ID"].value;
    let transactionID = document.forms["form"]["MPI_TRXN_ID"].value;

    const raw = JSON.stringify({
        merchantId: MID,
        pubKey: CONFIG.PUBLICKEY, // Use CONFIG here
        purchaseId: transactionID
    });

    try {
        const response = await fetch(CONFIG.MPI_KEY_EXCHANGE_URL, { // Use CONFIG here
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: raw
        });

        console.log("HTTP status:", response.status);

        const text = await response.text();
        console.log("Raw response:", text);

        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            throw new Error("Response is not JSON");
        }

        if (result.errorCode === "000") {
            alert(`✅ Success!\nCode: ${result.errorCode}`);
        } else {
            alert(`❌ Failed\nCode: ${result.errorCode}\nMessage: ${result.errorMessage}`);
        }

    } catch (error) {
        console.error('Error:', error);
        alert("⚠️ Check console for details.");
    }
}

function clear_mac() {
    let rawString = document.forms["form"]["MPI_MERC_ID"].value + document.forms["form"]["MPI_TRXN_ID"].value;
    try {
        const CLEAN_KEY = CONFIG.PRIVATE_KEY.replace(/^[ \t]+/gm, ''); // Calling from CONFIG
        let sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
        sig.init(CLEAN_KEY);
        sig.updateString(rawString);
        let sigValueHex = sig.sign();
        let base64UrlValue = hextob64(sigValueHex).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        document.forms["form"]["MPI_MAC"].value = base64UrlValue;
    } catch (e) {
        alert("Error generating MAC.");
    }
}
