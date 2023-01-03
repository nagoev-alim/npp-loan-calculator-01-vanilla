// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='calc'>
  <h2 class='title'>Loan Calculator</h2>
  <form data-form=''>
    <input type='number' name='amount' placeholder='Loan amount' class='form__input'>
    <input type='number' name='interest' placeholder='Interest' class='form__input'>
    <input type='number' name='repay' placeholder='Years to repay' class='form__input'>
    <button type='submit'>Calculate</button>
  </form>

  <ul data-output=''>
    <li>
      <p>Monthly Payments:</p>
      <p class='h3'><sup>$</sup><span data-monthly=''>0</span></p>
    </li>
    <li>
      <p>Total Principal Paid:</p>
      <p class='h3'><sup>$</sup><span data-principal=''>0</span></p>
    </li>
    <li>
      <p>Total Interest Paid:</p>
      <p class='h3'><sup>$</sup><span data-interest=''>0</span></p>
    </li>
  </ul>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Create Class
class App {
  constructor() {
    this.DOM = {
      form: document.querySelector('[data-form]'),
      output: document.querySelector('[data-output]'),
      monthly: document.querySelector('[data-monthly]'),
      principal: document.querySelector('[data-principal]'),
      interest: document.querySelector('[data-interest]'),
    };

    this.DOM.form.addEventListener('submit', this.onSubmit);
  }

  /**
   * @function submitHandler - Form submit handler
   * @param event
   */
  onSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const { amount, interest, repay } = Object.fromEntries(new FormData(form).entries());

    const inputs = {
      amount: parseInt(amount),
      interest: parseInt(interest),
      repay: parseInt(repay),
    };

    if (isNaN(inputs.amount) || isNaN(inputs.interest) || isNaN(inputs.repay)) {
      showNotification('warning', 'Please fill all fields');
      return;
    }

    form.querySelector('button').textContent = 'Loading...';
    setTimeout(() => {
      this.DOM.output.classList.add('show');
      const principle = inputs.amount;
      const interest = inputs.interest / 100 / 12;
      const payments = inputs.repay * 12;

      const x = Math.pow(1 + interest, payments);
      const monthly = (principle * x * interest) / (x - 1);

      if (isFinite(monthly)) {
        this.DOM.monthly.textContent = monthly.toFixed(2);
        this.DOM.principal.textContent = (monthly * payments).toFixed(2);
        this.DOM.interest.textContent = (monthly * interest).toFixed(2);
        form.reset();
      }
      form.querySelector('button').textContent = 'Submit';
    }, 1500);
  };
}

// ⚡️Class instance
new App();
