const express = require('express');
require('dotenv').config();
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const authRoute = require('./routes/users');
const positionRoute = require('./routes/positions');
const candidateRoute = require('./routes/candidates');
const voteRoute = require('./routes/votes');
const requirementsRoute = require('./routes/requirements');
const docRoute = require('./routes/document');
const app = express();

app.use(
	cors({
		origin: (origin, callback) => {
			const allowedOrigins = [
				'http://localhost:5173', // Local frontend
				'https://biometricvote.vercel.app', // Production frontend
				'https://biometric-auth-tawny.vercel.app', // Another allowed origin
			];

			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true, // Allow cookies to be sent and received
	})
);

// Security measures
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"], // Allow loading scripts from same origin
				//   scriptSrc: ["'self'", "https://trusted-cdn.com"], // Allow scripts from trusted sources
				objectSrc: ["'none'"], // Block Flash/Plugins
			},
		},
		frameguard: { action: 'deny' }, // Prevent Clickjacking
		referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Control Referrer Header
		xssFilter: true, // Prevent XSS Attacks
		dnsPrefetchControl: { allow: false }, // Prevent DNS Prefetching
	})
);

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/positions', positionRoute);
app.use('/api/candidates', candidateRoute);
app.use('/api/votes', voteRoute);
app.use('/api/requirements', requirementsRoute);
app.use('/api/document', docRoute);

module.exports = app;
