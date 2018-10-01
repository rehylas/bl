//////////////////////////////////////////////////////////////////////////
//
//  author : hylas.zhang  @ coinxp
//  create date: 2018.7.1
//
//////////////////////////////////////////////////////////////////////////

const fs= require('fs');
const Eos = require('eosjs');
const EosAPI = require('eosjs-keygen');

//const eosURL = process.env.SOCKET_EOS_URL || 'https://api.eoseco.com';
//const eosURL = process.env.SOCKET_EOS_URL || 'http://mainnet.genereos.io';
//const eosURL = process.env.SOCKET_EOS_URL || 'http://192.168.0.168:8888';
const eosURL = process.env.SOCKET_EOS_URL || 'http://demoeos.coinxp.io:8888';
console.log('eosUrl', eosURL);

const eosAPI_VERSION = 'V0.9'
const requestTimeOut = 3000
const CXP_CHAIN_IP = eosURL;

const gconfig = {
    httpEndpoint: CXP_CHAIN_IP,
    expireInSeconds: 60,
    broadcast: true,
    debug: false,
    sign: true
}   
const geos = Eos(gconfig);
let Config ={}

console.log(' ------------------------- ')
console.log('eos api ' + eosAPI_VERSION)
console.log(' ------------------------- ')

function log(error, result) {

    console.log('result:------------------------------------------------')
    console.log(result)
    console.log('error:------------------------------------------------')
    console.log(error)

}

function getConfig(){
    let file = __dirname+"/config.json";
    try{
        console.log( file );
        Config = JSON.parse(fs.readFileSync( file));
    }catch (err) {
        console.log(err);
    }
}


module.exports.VERSION = function () {
    console.log(eosAPI_VERSION)
    return eosAPI_VERSION;
}

/* ----------------------------------------------------------------------------------
输出接口
1.用户注册 *

----------------------------------------------------------------------------------*/

const getNewAccountFromBlock = async(blockid) =>{
    const id = blockid
    let newAccs ={ "data":[]};
    let recData ={ "blockid":blockid }

    let result = await geos.getBlock( id )
    if( result ){
        let Actions = result.transactions;
        recData ={ "blockid":blockid ,"ts":result.timestamp }
        console.log( recData )
        Actions.forEach(function(item){  
            //console.log('-------------------------------------')
            
           
            if( item.trx.transaction ) {
                
                //console.log( 'transaction  name:',item.trx.transaction.actions[0].name )
                if( 'newaccount' == item.trx.transaction.actions[0].name ){ 
                    //console.log( 'transaction  data:', item.trx.transaction.actions[0].data )
                    recData.accname =  item.trx.transaction.actions[0].data.name 
                    recData.accinfo =  item.trx.transaction.actions[0].data  
                    //console.log( recData )               
                    newAccs.data.push( recData )
                }
            }
        });

        console.log('list:', newAccs)        

    }
    return newAccs
 
}
 
// eos.getCurrencyBalance({ code: "eosio.token", account: "eosio", symbol: "DEV" }).then(result => console.log(result))
// cleos get currency balance eosio.token eosio DEV
 
const getBlance = async( accname ) =>{
    let result = await geos.getAccount( accname );

    if( result ){
        //console.log('data:', result.core_liquid_balance )
        return result.core_liquid_balance
    }
}

//cleos get info
const getInfo = async(  ) =>{
    let result = await geos.getInfo( {}  );
    //console.log('result:',  result )

    if( result ){
        //console.log('data:', result.core_liquid_balance )
        return result
    }
}
 


/* ----------------------------------------------------------------------------------
内部接口


----------------------------------------------------------------------------------*/

//userTrade 排序
const sortUserTrade = function (tradeArr) {
    /* */
    tradeArr = tradeArr.sort((v, w) => {
        return v.timestamp > w.timestamp
    })

    return tradeArr
}


function deepClone(obj) {
    let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
    return objClone
}

const printPriceList = function (arr) {
    //arr.forEach (  (item, index, arr)=>{
    for (let index = 0; index < arr.length; index++) {
        let item = arr[index]
        console.log(index, '  ', item.price)
    }
}

var a = [{ time: 10 }, { time: 2 }, { time: 6 }, { time: 1 }]

a = a.sort((v, w) => {
    return v.time > w.time
})


//////////////////////////////////////////////////////////////////////////////////////////
//exports：

module.exports.getNewAccountFromBlock = getNewAccountFromBlock;
module.exports.getBlance = getBlance;
module.exports.getInfo = getInfo;


const getBlockActions = async(id) =>{
  

    geos.getBlock( id ).then(result => { 
        //console.log(result) 
        let Actions = result.transactions;
        //console.log('actions:')
        //console.log( Actions )

        // for item in Actions(){

        // }
        
        console.log('blockid:', id )
        let nCount = 0;
        Actions.forEach(function(item){  
            console.log('-------------------------------------')
            
            //console.log( 'transaction:',item.trx.transaction )
            if( item.trx.transaction ) {
                //console.log( 'transaction:',item.trx.transaction.actions )
                //console.log( 'transaction  name:',item.trx.transaction.actions[0].name )
                if( 'newaccount' == item.trx.transaction.actions[0].name ){ 
                    console.log( 'transaction  data:', item.trx.transaction.actions[0].data )
                    //console.log('actions:',item.trx.transaction.actions )
                    //console.log( 'transaction:',item.trx.transaction )
                    nCount = nCount +1
                    
                }
            }
        });
        console.log('Count :',  nCount )

    }).catch( err => {  console.log('err:', err )   } )

} 

// test
const test = async () => {

 
    try {
        let ret = ''      //1661930   1662590
        
        let blockId =  421439 ;  
        let accName = 'zhangyong412'

        //ret =  await getNewAccountFromBlock( 19089369 )   
        

        // for( let i=blockId;i<blockId+200; i++) {
        //      //await getBlockActions( i )
        //      await getNewAccountFromBlock( i )
        // }

        //ret = await getBlance( accName )
        //ret = await getInfo()
        console.log( 'ret:', ret )
    } catch (e) {
        console.error('test---', e);
    }
}

 
test();
