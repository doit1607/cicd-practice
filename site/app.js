document.getElementById('calc').addEventListener('submit', (event) => {
  event.preventDefault();

  const a = Number(document.getElementById('a').value);
  const b = Number(document.getElementById('b').value);
  const op = document.getElementById('op').value;
  const result = document.getElementById('result');

  try {
    result.textContent = `= ${window.calculator[op](a, b)}`;
  } catch (error) {
    result.textContent = `Lỗi: ${error.message}`;
  }
});
