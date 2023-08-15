const successModal = document.querySelector('.modal-wrap')
const closeModal = document.querySelector('.modal-close')

export const toggleModalSuccess = () => {
  if (successModal.style.display === 'none') {
    successModal.style.display = 'block'
  } else if (successModal.style.display === 'block') {
    successModal.style.display = 'none'
  } else {
    successModal.style.display = 'block'
  }
}

closeModal.addEventListener('click', toggleModalSuccess)