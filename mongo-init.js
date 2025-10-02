// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

db = db.getSiblingDB('admin');

// The root user is already created by MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD
// We just need to ensure the databases exist and are accessible

// Switch to cloudapp database and create a dummy collection to initialize it
db = db.getSiblingDB('cloudapp');
db.createCollection('users');
print('Created cloudapp database');

// Switch to mpc1 database and create a dummy collection to initialize it
db = db.getSiblingDB('mpc1');
db.createCollection('users');
print('Created mpc1 database');

// Switch to mpc2 database and create a dummy collection to initialize it
db = db.getSiblingDB('mpc2');
db.createCollection('users');
print('Created mpc2 database');

print('MongoDB initialization completed');
