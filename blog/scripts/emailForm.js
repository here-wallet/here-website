const { toggleModalSuccess } = require("./modal-utils");
const isEmailSent = localStorage.getItem('emailSent') === 'true';
const emailForm = document.querySelector('.subscribe-email-form');
const emailFormElement = document.querySelector('.form-box');
const emailInputElement = document.querySelector('.email-form-input');

const apiUrl = 'https://api.herewallet.app/api/v1/web/blog_subscriptions';
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

if (isEmailSent) {
  emailForm.style.display = 'none';
}

if (emailFormElement) {
  emailFormElement.addEventListener('submit', async function (e) {
    e.preventDefault();
    const emailSent = await sendEmailToApi(emailInputElement.value)
    if (emailSent) {
      toggleModalSuccess()
      localStorage.setItem('emailSent', 'true');
      emailForm.style.display = 'none';
    }
  });
}

async function sendEmailToApi(email) {
  if (!emailPattern.test(email)) {
    const errorElement = document.querySelector('.form-error');
    errorElement.textContent = 'Invalid email format';
    return false;
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'email': email
    })
  };
  try {
    const dataFromApi = await fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.status !== 'ok') {
          throw Error()
        }
        return true
      })
      .catch(() => {
        throw Error()
      });
    return dataFromApi
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}