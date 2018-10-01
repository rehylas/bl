/**
 * Created by hylas on 2018/8/15.
 */


var api_ncc_eos = require('./eosAPI');

 
function log(error, result) {

    console.log('result:------------------------------------------------')
    console.log(result)
    console.log('error:------------------------------------------------')
    console.log(error)

}

// test
const test = async () => {

    const orderId = 1239213321;
    const drawId = Math.floor(Math.random() * 1000000);
    const name = 'zhangyong412'; //ybf.user
    try {
        let ret = 'cxpudunok'
        //ret = await api_ncc_eos.getBlance( name )

        console.log( ret )

    } catch (e) {
        console.error('test---', e);
    }

}


 
//console.log( EosAPI.Keygen.generateMasterKeys() )
test();

