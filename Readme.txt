bookstore/
├── client/                         # Frontend - React + TypeScript
│   ├── public/                    # Public static files
│   ├── src/
│   │   ├── assets/                # Hình ảnh, icon, font
│   │   ├── components/            # React components tái sử dụng
│   │   ├── contexts/              # React context (auth, cart...)
│   │   ├── pages/                 # Trang: Home, Product, Cart, etc.
│   │   ├── routes/                # Định tuyến bằng react-router-dom
│   │   ├── services/              # Gọi API backend (axios...)
│   │   │   ├── api.ts             # Cấu hình axios instance
│   │   │   ├── book.service.ts
│   │   │   └── user.service.ts
│   │   ├── types/                 # TypeScript types/interfaces
│   │   ├── utils/                 # Hàm tiện ích (formatPrice, handleError...)
│   │   ├── App.tsx                # Root component
│   │   └── main.tsx               # Entry point Vite
│   ├── index.html                 # Template HTML
│   ├── tsconfig.json              # Cấu hình TypeScript
│   ├── tailwind.config.js         # Cấu hình Tailwind CSS
│   └── vite.config.ts             # Cấu hình Vite

├── server/                         # Backend - Node.js + Express (JavaScript)
│   ├── config/                    # DB connect, env config
│   │   ├── db.js
│   │   └── config.js
│   ├── controllers/              # Logic xử lý route
│   │   ├── auth.controller.js
│   │   ├── book.controller.js
│   │   └── order.controller.js
│   ├── models/                   # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── book.model.js
│   │   └── order.model.js
│   ├── routes/                   # Định nghĩa API routes
│   │   ├── auth.routes.js
│   │   ├── book.routes.js
│   │   └── order.routes.js
│   ├── middlewares/             # Auth, error handler, etc.
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── app.js                   # Express app cấu hình middleware, routes
│   └── index.js                 # Khởi chạy server

├── shared/                        # (Tùy chọn) Chứa interface dùng chung cho FE & BE
│   └── types.d.ts

├── .env                           # Biến môi trường (PORT, DB_URI...)
├── package.json                   # Root - quản lý script + cài chung
└── README.md                      # Tài liệu dự án

