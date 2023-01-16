const config = require('./config');
const { promisify } = require("util");

// const redis = require('redis')
// let client;
// const   getCacheClient =  () => {
    // return new Promise((resolve, reject) => {
      const redisClient = require('redis').createClient();
      redisClient.connect();
      redisClient.on('connect', () => {
        // resolve(redisClient)
        // resolve("redis connected...");
        console.log("redis connected...");
      });
  
      redisClient.on('error', (redisError) => {
        console.log('Error connecting Redis', redisError.message);
        redisClient.quit();
        // return reject(redisError);
      });
    // })
  // }

const setValue = async (key, value) => {
      return new Promise(resolve => {
        redisClient.set(key, value, (err, res) => {
          if (err) console.error(err);
          resolve(res);
        })
      })
    }

const getValue = async (key) => {
      return new Promise(resolve => {
        redisClient.get(key, (err, res) => {
          if (err) console.error(err);
          resolve(res);
        })
      }
      )
    }




// async function testList() {
//   let res = await setValue('loo', 'jamal')
//   console.log('redis: ', res)
// }

// testList().then((res) => {
//   console.log(res)
// }).catch((err) => {
//   console.log(err)
// })


module.exports={
  // getCacheClient, 
  setValue, getValue , redisClient
}