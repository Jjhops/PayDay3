const errorText = document.querySelector(".error_text");
let Password = "PayDay3#5!gU0%$";

function pusscheck() {
    if(document.getElementById('pass1').value != Password){
        alert('ERROR! Password Not Much.')
        return false;
    }
    if(document.getElementById('pass1').value === Password){
        alert("Your archive password: PayDay3!$")
        window.open('../img/PayDay3Demo.rar')
    }
}

function bindModal(trigger, modal, close) {
    trigger = document.querySelector(trigger),
    modal = document.querySelector(modal),
    close = document.querySelector(close)

    const body = document.body

    trigger.addEventListener('click', e => {
        e.preventDefault()
        modal.style.display = 'flex'
        body.classList.add(locked)
    });
    close.addEventListener('click', () => {
        modal.style.display = 'none'
        body.classList.remove('locked')
    });
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.style.display = 'none'
            body.classList.remove('locked')
        }
    })
}
bindModal ('.modal__btn', '.modal__wrapper', '.modal__close')


