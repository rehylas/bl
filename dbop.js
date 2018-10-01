/**
 * Created by hylas on 2018/8/9.
 */
var randomstring = require("randomstring");
const mongoose = require('mongoose');

//const dbURL = process.env.SOCKET_MONGODB_URL || 'mongodb://192.168.0.168:27017/cxp';
const dbURL = process.env.SOCKET_MONGODB_URL || 'mongodb://52.82.45.206:27017/eos';


mongoose.connect(dbURL);

const TradeInfo = mongoose.model('trade', {
    "_id" : String,
    "orderId" : String,
    "coinType" : String,
    "type" : String,
    "price" : Number,
    "amount" : Number,
    "dt" : Date,
    "userId" : String,
    "userNameChain" :String,
    "state" : Number,
    "noFilled" : Number,
    "priceFilled" :   //String,  
    {
        type: Number,
        get: v =>  Number(v|| 0.0).toFixed(6),   
        //set: v => v.toFixed(6)    
      } ,    
    "__v" : Number
});



const KeyInfo = mongoose.model('key',{
    "_id" : String,
    "keyInfo":
        { masterPrivateKey: String,
            privateKeys:
                { owner: String,
                    active: String },
            publicKeys:
                { owner: String,
                    active: String } },
    "isUsed":Number
})

//db.eosusers.createIndex({"accname":1},{"unique":true})
const EosUser = mongoose.model('eosuser',{
    "_id" : String,
    "blockid":String,
    "ts":String,
    "accname":String,
    "accinfo":Object,
    "keyflag":Number
})

const ConfigInfo = mongoose.model('configinfo',{
    "_id" : String,
    "configid":String,
    "system":String,
    "type":String,
    "param":String,
    "strval":String,
    "val":Number
})

const Data_Rec = mongoose.model('data_rec', {
    "_id" : String,
    "orderId" : String,
    "data" : String,
    "name" :String,
    "dataEx" :{ "age": Number, "name":String  }

});



initdb =  function() {

}

closedb =  function () {

}

insertData = function ( data,callback ) {
    data._id =  randomstring.generate(12)
    let rec = new Data_Rec(  data  );
    rec.orderId ='sdfsdf'
    rec.save().then(() => {
        console.log( 'insertData ok ')
        if( callback ) callback('',  'insertData ok'  );

    }).catch(  (err,res)=>{
        if( callback ) callback('error',  err );
    })
}

deleteData = function ( key ) {

    Data_Rec.deleteOne( {_id:"KGai01je4a4E"} , (err,data)=>{
        console.log(err,data)
    }   )

}

updateData = function ( data ) {

    //let rec = new Data_Rec(  data  );

    Data_Rec.update( {_id:"hgBAQHV8kxdu"}, { name:"zhangyong"}, (err,data)=>{
        console.log(err,data)
    }   )

}

selectData = function ( orderId, callback ) {
    Data_Rec.find(  { orderId:orderId } , function (err, recs) {
        if (err) return console.error(err);
        console.log(  recs );
})
}

selectDatas =function (name,  callback  ) {
    Data_Rec.find(  { name:name } , function (err, recs) {
        if (err) return console.error(err);
        console.log(  recs );
})
}


getUser = function  (username ) {

}

setUser =   function (username, userObj) {

}
///////////////////////////////////// trade 操作/////////////////////////////////////////////////

getUserATrade = function  ( order_id,callback ) {
    TradeInfo.find(  { orderId:order_id } , function (err, recs) {
        if (err) {
            callback(err,'')

        }
        //console.log(recs);
        if( recs.length >0 )
            callback('', recs[0])
        else
            callback('[]','')

    })

}

getUserTradesByUserid = function  ( userId, callback ) {

    TradeInfo.find(  { userId:userId } , function (err, recs) {
        if (err) {

            callback(err, '')
            return console.error(err);

        }

        console.log(recs);
        callback('', recs)
        return recs
    })

}

getUserTradesByChainName = function ( usernameChain , callback ) {

    TradeInfo.find(  { userNameChain:usernameChain } , function (err, recs) {

        if (err) {
            callback(err, '')
            return console.error(err);
        }

        console.log(recs);
        callback('', recs)
        return recs

    })

}


insertUserATrade = function  (  trade , callback ) {

    trade._id =  randomstring.generate(12);


    let rec = new TradeInfo(  trade  );

    rec.save().then(() => {
        console.log( 'insertData ok ')
        if( callback ) callback('',  'insertData ok'  );

    }).catch(  (err,res)=>{
        if( callback ) callback('error',  err );
    })


    // TradeInfo.insert(  trade, (err,data)=>{
    //     console.log(err,data)
    // })



}


setUserATrade = function  (  trade ) {

    TradeInfo.update( {orderId: trade.orderId }, { state:trade.state, noFilled:trade.noFilled, priceFilled:trade.priceFilled }, (err,data)=>{
        console.log(err,data)
    }   )

}

//////////////////////////////////////////////////////////////////

insertKeyInfo = function  (  keyInfo , callback ) {

    //KeyInfo

    let rec = new KeyInfo(  );
    rec._id = randomstring.generate(12);
    rec.keyInfo = keyInfo;
    rec.isUsed = 0;

    rec.save().then(() => {
        console.log( 'insertData ok ')
        if( callback ) callback('',  'insertData ok'  );

    }).catch(  (err,res)=>{
           if( callback ) callback('error',  err );
    })


    // TradeInfo.insert(  trade, (err,data)=>{
    //     console.log(err,data)
    // })



}

///////////////////////////////////////////////////////////////////////
insertEosUser = function  (  eosUser , callback ) {
 
    eosUser._id =  randomstring.generate(12);
    let rec = new EosUser(  eosUser  );

    rec.save().then(() => {
        console.log( 'insertEosUser ok ')
        if( callback ) callback('',  'insertEosUser ok'  );

    }).catch(  (err,res)=>{
        if( callback ) callback('error',  err );
    })

}


/////////////////////////////////////////////////////////////////////////
//configinfo

insertConfiginfo= function  (  configinfo , callback ) {
    configinfo._id =  randomstring.generate(12);
    let rec = new ConfigInfo(  configinfo  );

    rec.save().then(() => {
        console.log( 'insertConfiginfo ok ')
        if( callback ) callback('',  'insertConfiginfo ok'  );
    }).catch(  (err,res)=>{
        if( callback ) callback('error',  err );
    })
}

setConfiginfo = function  (  configinfo ) {

    ConfigInfo.update( {configid: configinfo.configid }, { val:configinfo.val, 
        strval:configinfo.strval  }, (err,data)=>{
        console.log(err,data)
    }   )

}

getConfiginfobyID = async function ( id , callback  ) { //

    ConfigInfo.find(  { configid:id } , function (err, recs) {

        if (err) {
            callback(err, '')
            return console.error(err);
        }

        console.log(recs);
        callback('', recs)
        return recs
    })

}

 
module.exports.getUserATrade = getUserATrade;
module.exports.setUserATrade = setUserATrade;
module.exports.getUserTradesByUserid = getUserTradesByUserid;
module.exports.getUserTradesByChainName = getUserTradesByChainName;
module.exports.insertUserATrade = insertUserATrade;
module.exports.insertKeyInfo = insertKeyInfo;


module.exports.insertEosUser = insertEosUser;
module.exports.insertConfiginfo = insertConfiginfo;
module.exports.setConfiginfo = setConfiginfo;
module.exports.getConfiginfobyID = getConfiginfobyID;


async function test() {
    let ret = '';
    //setUserATrade()
    let data ={"data":"data context "  ,"name":"wm" }
    //ret = insertData( data )
    //updateData( data )
    //deleteData('sdf')

    let eosUser ={    
        "blockid":"12345678",
        "ts":"2018-09-19 16:01:02",
        "accname":"sim",
        "accinfo":{ "name":"sim" } 
    }

    //insertEosUser( eosUser )

    let configinfo ={    
        "configid":"1001",
        "system":"bl",
        "type":"",
        "param":"maxBlockID",
        "strval":"none",
        "val":10000
    }

    //insertConfiginfo( configinfo )

    configinfo.val = 10001
    configinfo.strval = "sec5"
    //setConfiginfo( configinfo )
    //ret = await getConfiginfobyID('1001'  )
    console.log('ret:', ret)

}



test()