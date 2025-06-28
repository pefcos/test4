const express = require('express');
const path = require('path');
const morgan = require('morgan');
const itemsRouter = require('./routes/items');
const statsRouter = require('./routes/stats');
const cors = require('cors');
const { getCookie, notFound, globalErrorHandler } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { initStatsService } = require('./services/statsService');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
// Basic middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(logger);

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/stats', statsRouter);

// File Watcher initialization
initStatsService();

app.use(getCookie);

// Error Handlers
app.use(notFound);
app.use(globalErrorHandler);

app.listen(port, () => console.log('Backend running on http://localhost:' + port));
