document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();

        const mobile = document.getElementById("newMobile").value.trim();

        const password = document.getElementById("newPassword").value;

        const confirm = document.getElementById("confirmPassword").value;

        if (!name || !mobile || !password || !confirm) {
            alert("সব তথ্য পূরণ করুন");
            return;
        }

        if (!/^01[0-9]{9}$/.test(mobile)) {
            alert("সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন");
            return;
        }

        if (password.length < 6) {
            alert("Password কমপক্ষে ৬ অক্ষরের হতে হবে");
            return;
        }

        if (password !== confirm) {
            alert("Password মিলছে না");
            return;
        }

        const email = mobile + "@international-esim.app";

        try {

            const result = await auth.createUserWithEmailAndPassword(
                email,
                password
            );

            const user = result.user;

            await db.collection("customers").doc(user.uid).set({

                name: name,
                phone: mobile,

                simPermission: false,
                simActive: false,

                esimPermission: false,
                esimActive: false,

                roamingPermission: false,
                roamingActive: false,

                hotspotPermission: false,
                hotspotActive: false

            });

            alert("Account Successfully Created!");

            window.location.href = "login.html";

        } catch (error) {

            alert("Registration Error: " + error.message);

        }

    });

});