
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        const mobile = document.getElementById("mobile").value.trim();

        const password = document.getElementById("password").value;

        if (!mobile || !password) {
            alert("Mobile Number ও Password দিন");
            return;
        }

        if (!/^01[0-9]{9}$/.test(mobile)) {
            alert("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন");
            return;
        }

        const email = mobile + "@international-esim.app";

        try {

            await auth.signInWithEmailAndPassword(
                email,
                password
            );

            alert("Login Successful!");

            window.location.href = "index.html";

        } catch (error) {

            if (error.code === "auth/invalid-credential") {
                alert("Mobile Number অথবা Password ভুল!");
            } else {
                alert("Login Error: " + error.message);
            }

        }

    });

});
