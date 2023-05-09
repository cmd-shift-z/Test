const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../config');
const { isAuthenticated } = require("../routes/auth");

// Configure your MSSQL connection settings here
const sqlConfig = {
  user: 'username',
  password: 'password',
  server: 'server_address',
  database: 'database_name',
};

function generateTestData(count, type) {
    const testData = [];
    for (let i = 1; i <= count; i++) {
      testData.push({
        id: i,
        name: `${type} Request #${i}`,
        department: `Department ${i}`,
        date: new Date(),
        comments: `Test comment for ${type} request #${i}`
      });
    }
    return testData;
  }
  



router.get('/:type/:page?', isAuthenticated, async (req, res) => {
    const { type, page } = req.params;
    const validTypes = ['it', 'vehicle', 'maintenance'];
  
    if (!validTypes.includes(type) || isNaN(page)) {
      res.status(404).send('Invalid URL');
      return;
    }

    const currentPage = page ? parseInt(page, 10) : 1;
  
    try {
      let it, vehicle, maintenance;
  
      if (config.sandboxMode) {
        // Use test data
        it = { rows: generateTestData(9, 'IT') };
        vehicle = { rows: generateTestData(22, 'Vehicle') };
        maintenance = { rows: generateTestData(38, 'Maintenance') };
      } else {
        // Fetch data from the database
        it = await pool.query('SELECT * FROM it');
        vehicle = await pool.query('SELECT * FROM vehicle');
        maintenance = await pool.query('SELECT * FROM maintenance');
      }
  
      res.render('checkForms', {
        currentType: type,
        data: {
          it: it.rows,
          vehicle: vehicle.rows,
          maintenance: maintenance.rows
        },
        currentPage: currentPage,
        itemsPerPage: 10
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  router.get('/', (req, res) => {
    res.redirect('/checkForms/it/1');
  });
  
module.exports = router;
