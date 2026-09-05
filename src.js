const currentElement = document.querySelector('#current');
const previousElement = document.querySelector('#previous');
let current = '0';
let previous = '';
let operator = null;
let shouldReset = false;

function render() {
	currentElement.textContent = current;
	previousElement.textContent = previous && operator ? `${previous} ${displayOperator(operator)}` : '';
}

function displayOperator(value) { return value === '*' ? '×' : value === '/' ? '÷' : value === '-' ? '−' : value; }

function addNumber(value) {
	if (shouldReset) { current = '0'; shouldReset = false; }
	if (value === '.' && current.includes('.')) return;
	if (current === '0' && value !== '.') current = value;
	else if (current.length < 16) current += value;
	render();
}

function chooseOperator(value) {
	if (operator && !shouldReset) calculate();
	previous = current;
	operator = value;
	shouldReset = true;
	render();
}

function calculate() {
	if (!operator || previous === '') return;
	const left = Number(previous);
	const right = Number(current);
	const result = operator === '+' ? left + right : operator === '-' ? left - right : operator === '*' ? left * right : right === 0 ? NaN : left / right;
	current = Number.isFinite(result) ? String(Math.round(result * 100000000) / 100000000) : 'Қате';
	previous = '';
	operator = null;
	shouldReset = true;
	render();
}

function clear() { current = '0'; previous = ''; operator = null; shouldReset = false; render(); }
function deleteLast() { if (!shouldReset) current = current.length > 1 ? current.slice(0, -1) : '0'; render(); }
function percent() { current = String(Number(current) / 100); render(); }

document.querySelectorAll('[data-number]').forEach(button => button.addEventListener('click', () => addNumber(button.dataset.number)));
document.querySelectorAll('[data-operator]').forEach(button => button.addEventListener('click', () => chooseOperator(button.dataset.operator)));
document.querySelector('[data-action="equals"]').addEventListener('click', calculate);
document.querySelector('[data-action="clear"]').addEventListener('click', clear);
document.querySelector('[data-action="delete"]').addEventListener('click', deleteLast);
document.querySelector('[data-action="percent"]').addEventListener('click', percent);
document.addEventListener('keydown', event => {
	if (/^[0-9.]$/.test(event.key)) addNumber(event.key);
	if ('+-*/'.includes(event.key)) chooseOperator(event.key);
	if (event.key === 'Enter' || event.key === '=') calculate();
	if (event.key === 'Escape') clear();
	if (event.key === 'Backspace') deleteLast();
});
