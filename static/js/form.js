const form = document.getElementById('membership-form')
const submitButton = form.querySelector('button[type=submit]')
const nameInput = form.querySelector('input[name=name]')
const emailInput = form.querySelector('input[name=email]')
const countryInput = form.querySelector('select[name=country]')
const membershipInput = form.querySelector('input[name=membership]')

const makeAPIcalls = async () => {

    // Handle any errors from Checkout
    var handleResult = function(result) {
        if (result.error) {
            var displayError = document.getElementById('error-message');
            displayError.textContent = result.error.message;
        }
    };
    
    const zapier_data = {
        name: nameInput.value,
        email: emailInput.value,
        country: countryInput.value,
        membership: membershipInput.value,
        'opt-in': true
    }

    const zapier_submission = await fetch('https://hooks.zapier.com/hooks/catch/11134193/bdspbo9/', {
        method: 'POST',
        body: JSON.stringify(zapier_data)
    });

    const response = await zapier_submission.json()

    if (response.status !== 'success') return;

    // redirect to thank you
    window.location.href += `thank-you.html?name=${nameInput.value}`
}

const handleSubmit = (event) => {
    event.preventDefault()
    submitButton.disabled = true
    makeAPIcalls()
}

if (form) {
    form.onsubmit = handleSubmit
}
