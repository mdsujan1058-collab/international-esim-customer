
document.addEventListener("DOMContentLoaded", function () {

    auth.onAuthStateChanged(async function (user) {

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        const customerRef = db.collection("customers").doc(user.uid);
        const controls = document.querySelectorAll(".control-card");

        const settings = [
            { permission: "simPermission", active: "simActive" },
            { permission: "esimPermission", active: "esimActive" },
            { permission: "roamingPermission", active: "roamingActive" },
            { permission: "hotspotPermission", active: "hotspotActive" }
        ];

        let latestCustomerData = null;

        // Customer Profile
        try {
            const doc = await customerRef.get();

            if (doc.exists) {
                const customer = doc.data();

                const profile = document.createElement("div");
                profile.style.background = "#26376D";
                profile.style.color = "white";
                profile.style.padding = "15px";
                profile.style.borderRadius = "10px";
                profile.style.margin = "15px 0";

                const heading = document.createElement("h3");
                heading.textContent = "Welcome, " + (customer.name || "");

                const phone = document.createElement("p");
                phone.textContent = "Mobile: " + (customer.phone || "");

                profile.append(heading, phone);
                document.querySelector(".app-container").prepend(profile);
            }

        } catch (error) {
            console.error("Profile Error:", error);
        }

        // Service Control Buttons
        controls.forEach(function (card, index) {

            const status = card.querySelector(".status");

            const button = document.createElement("button");
            button.className = "toggle-button";
            button.textContent = "Loading...";

            button.style.padding = "9px 12px";
            button.style.borderRadius = "20px";
            button.style.border = "1px solid #F5CE45";
            button.style.background = "#26376D";
            button.style.color = "#FFFFFF";
            button.style.fontWeight = "bold";

            card.appendChild(button);

            button.addEventListener("click", async function () {

                const setting = settings[index];

                if (!setting || button.disabled) return;

                const current = latestCustomerData;

                if (!current || current[setting.permission] !== true) {
                    alert("Admin এই সার্ভিস চালু করার অনুমতি দেননি।");
                    return;
                }

                const newValue = current[setting.active] !== true;

                button.disabled = true;

                try {
                    await customerRef.update({
                        [setting.active]: newValue
                    });
                } catch (error) {
                    alert("Update Error: " + error.message);
                } finally {
                    button.disabled = false;
                }
            });
        });

        // Real-time Customer Permission
        customerRef.onSnapshot(function (doc) {

            if (!doc.exists) {
                alert("Customer profile পাওয়া যায়নি।");
                return;
            }

            latestCustomerData = doc.data();

            controls.forEach(function (card, index) {

                const setting = settings[index];
                if (!setting) return;

                const status = card.querySelector(".status");
                const button = card.querySelector(".toggle-button");

                const allowed = latestCustomerData[setting.permission] === true;
                const isOn = allowed && latestCustomerData[setting.active] === true;

                status.textContent = isOn ? "ON" : "OFF";
                status.style.color = isOn ? "#43E6A8" : "#FF7888";

                button.textContent = !allowed
                    ? "অনুমতি নেই"
                    : (isOn ? "বন্ধ করুন" : "চালু করুন");

                button.disabled = !allowed;
                button.style.opacity = allowed ? "1" : "0.5";
                button.style.cursor = allowed ? "pointer" : "not-allowed";

                if (index === 0) {
                    const simText = document.querySelector(".sim-card p");
                    const simBadge = document.querySelector(".sim-card .status");

                    if (simText) {
                        simText.textContent = isOn
                            ? "SIM Activated"
                            : "SIM Deactivated";
                    }

                    if (simBadge) {
                        simBadge.textContent = isOn ? "ACTIVE" : "DEACTIVE";
                    }
                }
            });

        }, function (error) {
            console.error("Customer Listener Error:", error);
            alert("Firebase Error: " + error.message);
        });


        // Customer Package List
        const packageContainer = document.getElementById("customerPackages");

        if (packageContainer) {

            db.collection("packages").onSnapshot(function (snapshot) {

                packageContainer.innerHTML = "";

                if (snapshot.empty) {
                    packageContainer.textContent = "এখনো কোনো প্যাকেজ যোগ করা হয়নি।";
                    return;
                }

                snapshot.forEach(function (doc) {

                    const p = doc.data();

                    const card = document.createElement("div");

                    card.style.background = "#FFFFFF";
                    card.style.color = "#17234F";
                    card.style.padding = "16px";
                    card.style.margin = "12px 0";
                    card.style.borderRadius = "12px";
                    card.style.border = "1px solid #DCE2F0";
                    card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";

                    const operator = document.createElement("h3");
                    operator.textContent = "🌐 " + (p.operator || "Package");

                    const name = document.createElement("p");
                    name.textContent = "প্যাকেজ: " + (p.name || "");

                    const data = document.createElement("p");
                    data.textContent = "ডাটা: " + (p.data || "");

                    const validity = document.createElement("p");
                    validity.textContent = "মেয়াদ: " + (p.validity || "");

                    const price = document.createElement("h3");
                    price.textContent = "দাম: " + (p.price ?? "—");

                    price.style.color = "#087443";
                    price.style.marginTop = "10px";

                    card.append(
                        operator,
                        name,
                        data,
                        validity,
                        price
                    );

                    packageContainer.appendChild(card);
                });

            }, function (error) {
                console.error("Package Error:", error);
                packageContainer.textContent = "প্যাকেজ লোড করা যায়নি।";
            });
        }

    });

});


// Customer Logout
function customerLogout() {

    auth.signOut().then(function () {
        window.location.href = "login.html";
    }).catch(function (error) {
        alert("Logout Error: " + error.message);
    });

}
