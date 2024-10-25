import React from 'react';

const PaymentSuccess = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Payment Successful!</h1>
      <p style={styles.message}>Thank you for your payment. Your transaction was completed successfully.</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#f9fbfc',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    color: '#34495e',
    fontSize: '2.5em',
  },
  message: {
    color: '#2c3e50',
    fontSize: '1.2em',
    marginTop: '20px',
  },
};

export default PaymentSuccess;
