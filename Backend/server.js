const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
// Cleanup expired tokens periodically
require('./utils/tokenCleanup');
const http = require('http');
const socketIo = require('socket.io');
//Oauth
const session = require('express-session');

const passport = require('./passport');
const authRoutes = require('./routes/auth');

// Khởi tạo Express và HTTP server
const app = express();
const server = http.createServer(app);

// Khởi tạo Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Cho phép tất cả các nguồn gốc (origin) truy cập
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] // Thêm các phương thức khác nếu cần
  }
});

// Kết nối MongoDB Atlas
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
const logger = require('./config/logger');
db.on('error', (error) => logger.error('Database connection error:', error));
db.once('open', () => logger.info('Connected to Database'));

// Middleware
const corsOptions = {
    //origin: "*", // Cho phép tất cả các nguồn gốc (origin) truy cập
    origin: process.env.FRONTEND_URL ,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

const checkTokenExpiration = require('./middlewares/tokenExpiration');
const errorHandler = require('./middlewares/errorHandler');
const authTracker = require('./middlewares/authTracker');
const { loginLimiter, refreshTokenLimiter } = require('./middlewares/rateLimiter');

app.use(checkTokenExpiration);

// Add auth tracking middleware
app.use(authTracker);

// Apply rate limiting to specific routes
app.use('/user/login', loginLimiter);
app.use('/user/token', refreshTokenLimiter);
//
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);


// Routes
const productsRouter = require('./routes/products');
app.use('/products', productsRouter);
const billsRouter = require('./routes/bills')(io); // Truyền io vào billsRouter
app.use('/bills', billsRouter);
const partnersRouter = require('./routes/partners');
app.use('/partners', partnersRouter);
const productTopRouter = require('./routes/productTop');
app.use('/productTop', productTopRouter);
const userRouter = require('./routes/user'); 
app.use('/user', userRouter); 
const cartRouter = require('./routes/cart')(io); // Truyền io vào router
app.use('/cart', cartRouter);
const booksRouter = require('./routes/books');
app.use('/books', booksRouter);

const favoritesRouter = require('./routes/favorites');
app.use('/favorites', favoritesRouter);

const paymentZaloRouter = require('./services/paymentzalo');
app.use('/zalopay', paymentZaloRouter);        // Import và sử dụng các endpoint từ paymentzalo.js

app.use(cookieParser());
// Import và thiết lập WebSocket chat
const setupWebSocket = require('./services/chat');
setupWebSocket(server);

// Khi có kết nối từ client
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Lắng nghe sự kiện từ client
  socket.on('message', (msg) => {
    console.log('Received message:', msg);

    // Phát sự kiện đến tất cả client
    io.emit('message', msg);
  });

  // Khi client ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);


// Khởi chạy server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`Server is running on http://13.238.155.5:${PORT}`);
});

// Xuất io để sử dụng trong các router nếu cần
module.exports = io;

