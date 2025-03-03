const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
    contactPoints: ['192.168.1.132'],
    localDataCenter: 'datacenter1',
    keyspace: 'ecommerce',
    authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra')
});

module.exports = client;