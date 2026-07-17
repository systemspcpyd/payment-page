// --- CONFIGURATION ---
const KEY_EXCHANGE_URL = "https://devlinkv2.paydee.co/mpigw/mkReq";
const PUBLICKEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq8j2SHHfzMLlhYppnlk-QqjjjZwMkhK6s6rERd0JhhY_6-Md4Z0327uEdfNbJrSEPJVPT55gjRhx4MorEhrabuafuY8thSPS4epwkOjjPtELwZxViWe1dzG5TQakJ_i8ZOQuUYFJg02RcwUTzE3ty-x7mkwj9t2wAdRqTagyaDIAVMTxP_Y4AS76xjA3aH43Q0HKHGAxxIlXBIQxImuPhlUbPtVtTHIsUwkIx2BDh8kPZ3Mgr3Cyky0F-cHpEFSi3rPSSLD_FVHlJRW2cODVm8E-s98CURQYs1npzDztzZgZPnnb9K57CB2Z50Ve6qUV7z4-uHs3nehiMJHktIs7LQIDAQAB";
const PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCryPZIcd/MwuWF
immeWT5CqOONnAySErqzqsRF3QmGFj/r4x3hnTfbu4R181smtIQ8lU9PnmCNGHHg
yisSGtpu5p+5jy2FI9Lh6nCQ6OM+0QvBnFWJZ7V3MblNBqQn+Lxk5C5RgUmDTZFz
BRPMTe3L7HuaTCP23bAB1GpNqDJoMgBUxPE/9jgBLvrGMDdofjdDQcocYDHEiVcE
hDEia4+GVRs+1W1McixTCQjHYEOHyQ9ncyCvcLKTLQX5wekQVKLes9JIsP8VUeUl
FbZw4NWbwT6z3wJRFBizWenMPO3NmBk+edv0rnsIHZnnRV7qpRXvPj64ezed6GIw
keS0izstAgMBAAECggEAC59vu8Fp/S6B8rHwPnoBopH5v3bmSisr6FnD/jQb3695
XgpCVyWuMKxJzzngGh4kRP3B3Xxfl6b77Ckm69/W6qJTqULnjLa6nyAfw0uL4I//
+yFgOjPtomXCCKpL3gvQIgVm9YseqwcgXFy6FQcqxog2vrRVye9Vksdz9SgjAktP
UeTaAgyfHGcKqQvWb8E0N5hpPfQMsw9p5vKdoSyrokb6mTSzMn2K9NlCtXNYvzyp
gmivt5H4wYGHrl+GFJnKfbb0Qv0O3BUaRTbyuUXBwJqWGYIiAk7288rdAuiiZPgV
+iS4QKvG/RTCilg8FfJTJy/Mea9sVO3kVLwouB8xwwKBgQDCoopJ4C6hCkk7jHyE
/t9hD3h7OhGQOVX1DkgJyAlbqCIxvNPZp2B3ae7FAjAtFf8/gPCHY7EKc6tfUUAz
GZuz3/o4aCMeEoAAzSkijBkWzhWq79CUBnlR0/Md0a4DmhIQGFUzF7QvV1ZtCvRS
mN6YfqA5+zAMViwhrAtc48j5OwKBgQDh8iZCoogGhgAZQ+41+OgrZlClFoUYAa69
+lLKWMxAOdgkm04ZNbxIjRAXN3fWydjHnI+8S+RHiURxU+Lq3oyR13gpWSaS12Mh
DRk4CVsFpoRYXLqU3tPIg0nsEBgU7/UPdSPgaL07t1Xu/j0HOnm1U0WtSKEzXJ85
1R8/eAIWtwKBgHxi2hPqZIJgi3q2BqIMLH/gHjRKYQ0Vx1xMGze9ElX0Np4oug8g
S6MlHQXkpxs5Mp3H7m/oAy3VzFCnIWtG0136JvRDgSXn1swsUTyV4jbTz78lcdwX
4xKrbHTDGv2MSjzlABYd8PZMT5xyYsAimCdGzWkgoY1QyPVf+QcNP9QfAoGACyZJ
4QvoLno6UwTZImyv+ERKQntEAhVDLDjIERgkrB6unc/UIMZYDjR30M156m13dxIw
vZf5IdaSPA1pqzFkOmYpldDCaIicaasdzXgYt8Spzzp0Mph0VvazlSSOK6pTq3ma
VZ6Vh/baFLsTA+JM0zfSvmRRIBm3+cCclCM15y0CgYANc3IGearrmbVgyVZ74+0M
SL+FRlqBUM8bvGHdPzXV8CLr5NlItcINVHiCO70UmTCNx7b0Ga3vFsVhG8h9VQZu
68zG+AEkbgDYEbzCsVsgYMtASTlVgG9KQoqGeIKhKdUQliV+DKn2uLW8SBetfXwX
BjUoANFzgScOUTPCSQACXQ==
-----END PRIVATE KEY-----`;

let pollTimer = null;
let visualCountdownInterval = null;
let maxLimitTimeout = null;
let isFirstRun = true;

let targetTrxnId = "";
let targetAmount = "";

/**
 * Triggered automatically by qr-inquiry.html on window load.
 */
function autoTriggerStatusCheck(originalTrxnId, amount) {
    targetTrxnId = originalTrxnId;
    targetAmount = amount;
    triggerInquiry();
}

/**
 * Builds the secure MAC and submits the inquiry form inside the hidden iframe
 */
async function triggerInquiry() {
    const statusLabel = document.getElementById("inquiry-status-text");
    if (statusLabel && isFirstRun) {
        statusLabel.innerText = "Querying gateway for status...";
        statusLabel.style.color = "black";
    }

    const d = new Date();
    const ts = d.getFullYear() + (d.getMonth() + 1).toString().padStart(2, '0') + 
               d.getDate().toString().padStart(2, '0') + d.getHours().toString().padStart(2, '0') + 
               d.getMinutes().toString().padStart(2, '0') + d.getSeconds().toString().padStart(2, '0');
    
    const inqId = "INQ" + ts;

    // Populate hidden inquiry parameters inside the form
    document.getElementById("INQ_PURCH_DATE").value = ts;
    document.getElementById("INQ_TRXN_ID").value = inqId;
    document.getElementById("INQ_ORI_TRXN_ID").value = targetTrxnId;
    document.getElementById("INQ_PURCH_AMT").value = targetAmount;

    try {
        // Step A: Key Exchange with gateway
        const mkRes = await fetch(KEY_EXCHANGE_URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "merchantId": "000000000000003",
                "pubKey": PUBLICKEY,
                "purchaseId": inqId
            })
        });
        const mkResult = await mkRes.json();
        if (mkResult.errorCode !== "000") throw new Error("Inquiry Key Exchange Failed");

        // Step B: Generate RSA signature
        const rawData = "INQ" + "000000000000003" + inqId + targetTrxnId + ts + "458" + targetAmount;
        const signature = await signData(rawData, PRIVATE_KEY_PEM);
        document.getElementById("INQ_MAC").value = signature;

        // Step C: Post securely using the iframe
        document.getElementById("inq-form").submit();

    } catch (err) {
        console.error(err);
        resetCheckState();
        if (statusLabel) {
            statusLabel.innerText = "Check Failed: " + err.message;
            statusLabel.style.color = "red";
            document.getElementById("status-spinner").style.display = "none";
        }
    }
}

/**
 * Cryptographic RSA signing utility
 */
async function signData(message, pem) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n|\r/g, '');
    const binaryKey = Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;
    
    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        binaryKey,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await window.crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, data);
    
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Triggers the 10-second countdown visual block on the UI
 */
function start10SecVisualTimer() {
    let timeLeft = 10;
    const countdownText = document.getElementById("countdown-text");
    
    if (countdownText) {
        countdownText.innerText = `Establishing final status: ${timeLeft}s remaining`;
    }

    clearInterval(visualCountdownInterval);
    visualCountdownInterval = setInterval(() => {
        timeLeft--;
        if (countdownText) {
            countdownText.innerText = `Establishing final status: ${timeLeft}s remaining`;
        }

        if (timeLeft <= 0) {
            clearInterval(visualCountdownInterval);
        }
    }, 1000);
}

/**
 * Resets tracking processes and cleans the UI timers
 */
function resetCheckState() {
    clearInterval(visualCountdownInterval);
    clearTimeout(pollTimer);
    clearTimeout(maxLimitTimeout);
    document.getElementById("status-spinner").style.display = "none";
    const countdownText = document.getElementById("countdown-text");
    if (countdownText) countdownText.innerText = "";
}

/**
 * Listen for the gateway response captured from within the target iframe.
 */
window.addEventListener("message", function(event) {
    const data = event.data;
    const statusLabel = document.getElementById("inquiry-status-text");

    if (data.MPI_ERROR_CODE === "004") {
        if (statusLabel) {
            statusLabel.innerText = "Transaction processing, verification in progress...";
            statusLabel.style.color = "orange";
        }

        // Setup the absolute 10-second timeout on the very first "004" detection
        if (isFirstRun) {
            isFirstRun = false;
            start10SecVisualTimer();

            maxLimitTimeout = setTimeout(() => {
                resetCheckState();
                if (statusLabel) {
                    statusLabel.innerText = "Transaction Failed (Status Verification Timeout)";
                    statusLabel.style.color = "red";
                }
                console.warn("User transaction verification timed out after 10 seconds of '004' status.");
            }, 10000);
        }

        // Poll again in 2.5 seconds if we haven't hit the 10-second threshold yet
        clearTimeout(pollTimer);
        pollTimer = setTimeout(() => {
            triggerInquiry();
        }, 2500);

    } else if (data.MPI_ERROR_CODE) {
        // Any status code other than '004' means the payment has a final result (Success or Failure)
        resetCheckState();
        const query = new URLSearchParams(data).toString();
        
        // Redirect the parent window to your landing redirect page
        window.location.href = `/payment-status.html?${query}`;
    }
});
