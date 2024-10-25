import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2'; // Ensure chart.js and react-chartjs-2 are installed
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Welcome = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [weeklyData, setWeeklyData] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [buttonHover, setButtonHover] = useState(false); // State for button hover
  const [rowHoverIndex, setRowHoverIndex] = useState(null); // State for row hover

  // Handle user ID and password submission
  const handleSubmit = () => {
    const expectedPassword = `${userId}@smarte`;
    
    if (!userId.trim()) {
      alert("Please enter a valid user ID.");
    } else if (password !== expectedPassword) {
      alert("Incorrect password. Please try again.");
    } else {
      generateTableData();
      setIsAuthenticated(true);
    }
  };

  // Generate random weekly kWh usage and calculate total bill
  const generateTableData = () => {
    const ratePerKWh = 0.15;
    let generatedData = [];
    let total = 0;

    for (let i = 1; i <= 4; i++) { // Generate for 4 weeks
      const weeklyKWh = Math.floor(Math.random() * 200) + 50; // Random kWh between 50 and 250
      const weeklyBill = weeklyKWh * ratePerKWh;
      total += weeklyBill;

      generatedData.push({
        week: `Week ${i}`,
        kWh: weeklyKWh,
        bill: weeklyBill.toFixed(2),
      });
    }

    setWeeklyData(generatedData);
    setTotalBill(total.toFixed(2));
  };

  // Prepare data for kWh chart
  const kWhChartData = {
    labels: weeklyData.map(data => data.week),
    datasets: [
      {
        label: 'kWh Used',
        data: weeklyData.map(data => data.kWh),
        backgroundColor: 'rgba(52, 152, 219, 0.5)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Prepare data for bill chart
  const billChartData = {
    labels: weeklyData.map(data => data.week),
    datasets: [
      {
        label: 'Total Bill ($)',
        data: weeklyData.map(data => parseFloat(data.bill)),
        backgroundColor: 'rgba(231, 76, 60, 0.5)',
        borderColor: 'rgba(231, 76, 60, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Handle payment submission
  const handlePayment = () => {
    setPaymentMessage('Payment Successful!');
    setTimeout(() => setPaymentMessage(''), 10000); // Clear message after 10 seconds
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Energy Dashboard</h1>
      
      {!isAuthenticated ? (
        <div style={styles.inputContainer}>
          <label style={styles.label}>Enter your User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={styles.input}
          />
          
          <label style={styles.label}>Enter your Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          
          <button
            style={{
              ...styles.button,
              backgroundColor: buttonHover ? '#1abc9c' : '#3498db',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <h2 style={styles.subHeading}>Usage Summary for User ID: {userId}</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Week</th>
                <th style={styles.tableHeader}>kWh Used</th>
                <th style={styles.tableHeader}>Weekly Bill (in $)</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((data, index) => (
                <tr
                  key={index}
                  onMouseEnter={() => setRowHoverIndex(index)}
                  onMouseLeave={() => setRowHoverIndex(null)}
                  style={{
                    backgroundColor: rowHoverIndex === index ? 'rgba(52, 152, 219, 0.3)' : 'transparent',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <td style={styles.tableData}>{data.week}</td>
                  <td style={styles.tableData}>{data.kWh} kWh</td>
                  <td style={{
                      ...styles.tableData,
                      color: data.bill < 0 ? 'red' : 'green',
                    }}>
                    {data.bill < 0 ? `(${Math.abs(data.bill)})` : `$${data.bill}`}
                  </td>
                </tr>
              ))}
              <tr>
                <td style={styles.totalRow} colSpan="2">Total Bill:</td>
                <td style={styles.totalRow}>{totalBill < 0 ? `(${Math.abs(totalBill)})` : `$${totalBill}`}</td>
              </tr>
            </tbody>
          </table>

          <div style={styles.chartContainer}>
            <h3>KWh Usage Chart</h3>
            <Bar data={kWhChartData} options={{ responsive: true }} />
          </div>

          <div style={styles.chartContainer}>
            <h3>Bill Chart</h3>
            <Bar data={billChartData} options={{ responsive: true }} />
          </div>

          <button
            style={{
              ...styles.paymentButton,
              backgroundColor: buttonHover ? '#e74c3c' : '#c0392b',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            onClick={handlePayment}
          >
            Pay Bill
          </button>

          {totalBill < 0 && (
            <p style={styles.negativeBillMessage}>
              You have excess energy. Consider selling to others!
            </p>
          )}
        </div>
      )}

      {/* Full-screen payment success message overlay */}
      {paymentMessage && (
        <div style={styles.overlay}>
          <div style={styles.overlayContent}>
            <h2>{paymentMessage}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f9fbfc',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    color: '#34495e',
    fontSize: '2.5em',
    marginBottom: '20px',
  },
  subHeading: {
    color: '#2c3e50',
    fontSize: '1.5em',
    margin: '20px 0',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  label: {
    fontSize: '1.2em',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '1em',
    width: '200px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1em',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  tableContainer: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: '20px',
  },
  tableHeader: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
  },
  tableData: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    color: '#2c3e50',
  },
  totalRow: {
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'right',
    backgroundColor: '#ecf0f1',
  },
  chartContainer: {
    margin: '20px 0',
    width: '100%',
  },
  paymentButton: {
    padding: '10px 20px',
    fontSize: '1em',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  negativeBillMessage: {
    color: '#e74c3c',
    fontSize: '1.2em',
    marginTop: '20px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    color: '#fff',
    fontSize: '2em',
  },
};

export default Welcome;
