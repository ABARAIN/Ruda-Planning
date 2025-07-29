# Migration Guide: Old Structure to Clean Architecture

## Overview

This document explains the migration from the old monolithic `index.js` structure to the new clean architecture.

## What Changed

### Old Structure (index.js.backup)

- Single file containing all logic
- Mixed concerns (routes, database, business logic)
- No separation of responsibilities
- Hard to maintain and scale

### New Structure (Clean Architecture)

```
Backend/
├── config/           # Configuration files
├── controllers/      # Business logic
├── middleware/       # Custom middleware
├── models/          # Data access
├── routes/          # Route definitions
├── utils/           # Utilities
└── server.js        # Main app file
```

## File Mapping

| Old Code Location       | New Location                       | Purpose            |
| ----------------------- | ---------------------------------- | ------------------ |
| Database connection     | `config/database.js`               | Database setup     |
| ALLOWED_TABLES constant | `config/constants.js`              | App constants      |
| GeoJSON query logic     | `models/GeoDataModel.js`           | Data access        |
| CRUD operations         | `models/GeoDataModel.js`           | Data access        |
| Request handling        | `controllers/geoDataController.js` | Business logic     |
| Route definitions       | `routes/geoDataRoutes.js`          | API endpoints      |
| Error handling          | `middleware/errorHandler.js`       | Error management   |
| Validation              | `middleware/validation.js`         | Request validation |
| Logging                 | `utils/logger.js`                  | Logging utility    |
| Server setup            | `server.js`                        | Main application   |

## Benefits of New Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Maintainability**: Easier to find and modify specific functionality
3. **Scalability**: Easy to add new features without affecting existing code
4. **Testability**: Each component can be tested independently
5. **Reusability**: Components can be reused across different parts of the app
6. **Error Handling**: Centralized error handling with proper logging
7. **Validation**: Input validation middleware for better data integrity

## How to Use the New Structure

### Starting the Server

```bash
# Old way
node index.js

# New way
npm start
# or
npm run dev  # for development with auto-reload
```

### Adding New Features

1. **New API Endpoint**:

   - Add method to `models/GeoDataModel.js`
   - Add controller method to `controllers/geoDataController.js`
   - Add route to `routes/geoDataRoutes.js`

2. **New Validation**:

   - Add validation function to `middleware/validation.js`
   - Apply to routes in `routes/geoDataRoutes.js`

3. **New Error Handling**:
   - Add to `middleware/errorHandler.js`

## Environment Variables

The same environment variables are used, but now they're organized in `config/constants.js` and `config/database.js`.

## Testing the Migration

1. Ensure your `.env` file is properly configured
2. Run `npm install` to ensure all dependencies are installed
3. Start the server with `npm start`
4. Test the endpoints:
   - `GET /` - Health check
   - `GET /api/all` - GeoJSON data
   - `GET /api/manage/all` - CRUD operations

## Rollback

If you need to rollback, you can:

1. Rename `server.js` to `server.js.new`
2. Rename `index.js.backup` to `index.js`
3. Update `package.json` to use `index.js` as main
4. Restart the server

## Support

If you encounter any issues with the new structure, check:

1. Environment variables are properly set
2. Database connection is working
3. All dependencies are installed
4. File paths are correct for your system
