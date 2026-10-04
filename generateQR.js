const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Define the path for the 'qrcodes' folder
const qrDir = path.join(__dirname, 'qrcodes');

// Check if 'qrcodes' folder exists and create it if not
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir); // Create the directory
    console.log(`Directory created: ${qrDir}`);
}

// Database connection setup
const connection = require('./db'); // Your database connection file

connection.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');

    // Fetch data from the database
    connection.query('SELECT * FROM table1', (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        // Generate QR codes for each medicine record
        results.forEach(row => {
            const qrData = JSON.stringify(row); // Data for the QR code
            
            // Sanitize the medicine name for the filename
            const fileName = `${row.Name.replace(/[^a-zA-Z0-9]/g, '_')}_QR.png`;
            const filePath = path.join(qrDir, fileName);

            QRCode.toFile(filePath, qrData, err => {
                if (err) {
                    console.error(`Failed to generate QR code for ${row.Name}:`, err);
                } else {
                    console.log(`QR code generated for ${row.Name}: ${filePath}`);
                }
            });
        });

        connection.end(); // Close the database connection
    });
});
