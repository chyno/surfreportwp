"use strict";

var http = require('requestify');
var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('./config');


//Private Functions
function getDbClient(cnf) {
    return new DocumentDBClient(cnf.host, {
        masterKey: cnf.authKey
    });
};

function getDatabaseAsync(dbClient) {
    var databaseId = config.databaseId;
      console.log('creating database: Id: ' + config.databaseId);
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{
            name: '@id',
            value: databaseId
        }]
    };

    return new Promise((resolve, reject) => {
        dbClient.queryDatabases(querySpec)
            .toArray(function (err, results) {
                if (err) {
                     console.log('**** erro creating db: ' + err.toString() + '*******************');
                    reject(err);
                    console.log(err);
                }
                else {
                    resolve(results[0]);
                }
            });
    });
};

function getCollectionAsync(dbClient, databaseLink, collectionId) {
    //client, databaseLink, collectionId, callback
    var col;
    var querySpec = {
        query: 'SELECT * FROM root r WHERE r.id=@id',
        parameters: [{
            name: '@id',
            value: collectionId
        }]
    };
    return new Promise((resolve, reject) => {
        dbClient.queryCollections(databaseLink, querySpec).toArray(function (err, results) {
            if (err) {
               // console.log(err);
                reject(err);

            } else {
                let result = results;
                resolve(result);
            }
        });
    });
};

function rejectWithLog(reason, fn) {
   console.error('An error occurred', reason);
    fn(reason);
}

function getConfiguredCollectionAsync(client, collectionId) {

    return new Promise((resolve, reject) => {
        getDatabaseAsync(client, config).then((db) => {
           
            getCollectionAsync(client, db._self, collectionId).then((collection) => {
                console.log('collection: ' + collection[0].toString());
                resolve(collection[0]);
            }).catch(reason => rejectWithLog('Get collection errror.... :' + reason, reject));
        }).catch(reason => rejectWithLog('Getingt Database Error.... : ' + reason, reject));
    });
};

//*****************************************
//End Provate FInction


var database = {
    
    runDbQueryAsync(querySpec, collectionId) {
        
         var client = getDbClient(config);

        return new Promise((resolve, reject) => {
                getConfiguredCollectionAsync(client, collectionId).then((collection) => {
                    client.queryDocuments(collection._self, querySpec).toArray(function (err, results) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            
                            let result = results;
                            resolve(result);
                        }
                    });
                }).catch(reason => rejectWithLog('In database ... : '+ reason, reject));
        });
        
     },

     insertDocument(item, collectionId) {
         item.date = Date.now();
         const client = getDbClient(config);

           return new Promise((resolve, reject) => {
                getConfiguredCollectionAsync(client, collectionId).then((collection) => {
                 client.createDocument(collection._self, item,  (err, doc) => {
                    if (err) {
                        reject(err);

                    } else {
                        resolve(doc);
                    }
                });
                    
                }).catch(reason => rejectWithLog('In database ... : '+ reason, reject));
        });
        
    
     },

     deleteDocument(docId,collectionId)  {
        
         const client = getDbClient(config);
         const dbLink = 'dbs/' + config.databaseId;
         let collLink = dbLink + '/colls/' + collectionId;
         let  docLink = collLink + '/docs/' + docId;  
        console.log("delete document");
           return new Promise((resolve, reject) => {
            client.deleteDocument(docLink, function (err) {
                if (err) {
                      console.log("error delete document. Error : " + JSON.stringify(err));
                     reject(err);
                 } else {
                     console.log('Document deleted');
                    //cleanup & end
                   console.log('\nCleaning up ...');
                    resolve();
               }
            });

            }).catch(reason =>   console.log("delete document error ..." + reason));
        

     }
         
}

module.exports = database;