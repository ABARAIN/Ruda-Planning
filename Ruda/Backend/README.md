# RUDA Backend API

A clean, organized Node.js backend API for RUDA GeoJSON data management with PostgreSQL.

## 🏗️ Architecture

The backend follows a clean architecture pattern with the following structure:

```
Backend/
├── config/           # Configuration files
│   ├── database.js   # Database connection setup
│   └── constants.js  # Application constants
├── controllers/      # Business logic layer
│   └── geoDataController.js
├── middleware/       # Custom middleware
│   ├── errorHandler.js
│   └── validation.js
├── models/          # Data access layer
│   └── GeoDataModel.js
├── routes/          # Route definitions
│   └── geoDataRoutes.js
├── utils/           # Utility functions
│   └── logger.js
├── server.js        # Main application file
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Environment variables configured

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your database configuration:

```env
DB_USER=your_username
DB_HOST=your_host
DB_NAME=your_database
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
NODE_ENV=development
```

3. Start the server:

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

## 📡 API Endpoints

### GeoJSON Endpoints

- `GET /api/:tableName` - Get GeoJSON data for a specific table
  - Supported tables: `all`, `lahore`, `sheikhpura`, `purposed_ruda_road_network`

### CRUD Endpoints (for 'all' table)

- `GET /api/manage/all` - Get all records
- `POST /api/manage/all` - Create a new record
- `PUT /api/manage/all/:id` - Update a record
- `DELETE /api/manage/all/:id` - Delete a record

### Health Check

- `GET /` - Health check endpoint

## 🟢 Features

- **Clean Architecture**: Separated concerns with models, controllers, and routes
- **Error Handling**: Comprehensive error handling middleware
- **Validation**: Request validation middleware
- **Logging**: Structured logging throughout the application
- **CORS**: Cross-origin resource sharing enabled
- **Graceful Shutdown**: Proper server shutdown handling

## 🛠️ Development

### Project Structure

- **Models**: Handle database operations and data access
- **Controllers**: Contain business logic and request/response handling
- **Routes**: Define API endpoints and middleware chains
- **Middleware**: Custom middleware for validation, error handling, etc.
- **Config**: Configuration files for database and constants
- **Utils**: Utility functions like logging

### Adding New Features

1. **New Model**: Create a new file in `models/`
2. **New Controller**: Create a new file in `controllers/`
3. **New Routes**: Create a new file in `routes/` and register in `server.js`
4. **New Middleware**: Create a new file in `middleware/`

## 📝 Environment Variables

| Variable      | Description              | Default     |
| ------------- | ------------------------ | ----------- |
| `DB_USER`     | PostgreSQL username      | -           |
| `DB_HOST`     | PostgreSQL host          | -           |
| `DB_NAME`     | PostgreSQL database name | -           |
| `DB_PASSWORD` | PostgreSQL password      | -           |
| `DB_PORT`     | PostgreSQL port          | 5432        |
| `PORT`        | Server port              | 5000        |
| `NODE_ENV`    | Environment mode         | development |

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include validation for new endpoints
4. Update documentation as needed

## 📄 License

ISC License
