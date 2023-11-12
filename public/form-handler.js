document.getElementById('transaction-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Gather form data
  const from = document.getElementById('walletA').value;
  const to = document.getElementById('walletB').value;
  const amount = document.getElementById('amount').value;
  const memo = ''; // Add a memo input in your form if needed

  // Send the form data using fetch (AJAX)
  fetch('/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to, amount, memo }) // Do NOT include the private key here
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Handle response here, e.g., display a success message
  })
  .catch((error) => {
    console.error('Error:', error);
    // Handle errors here, e.g., display an error message
  });
});
