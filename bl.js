const api_eos = require('./eosAPI');
const dbapi = require('./dbop.js');

////////////////////////////////////////////////////////////////////////
//功能描述
//运行方式分 最新跟踪模式和历史挖掘模式
//最新跟踪模式：

//读取配置文件， maxBlockid = 读取的最后一块编号
//读取当前链信息，获得 HeadBlockid 
//从当天id 开始 或者 maxBlockid 开始，循环遍历数据，读取数据到数据库
//读取到， HeadBlockid ，暂停1000 ，继续上一个循环

////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
//内部函数
// "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
// "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP7"
checkKeyFlag = ( accInfo )=>{
    //console.log( accInfo.owner.keys[0].key )
    if( accInfo.owner.keys[0].key  =='EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV' )
        return 1;
    if( accInfo.active.keys[0].key =='EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV' )
        return 1;        

    return 0
}

////////////////////////////////////////////////////////////////////////
//业务相关

async function  testfun(err,data){
    dbcfg = data[0]
    console.log('dbcfg:', dbcfg )    
    let eosinfo =  await api_eos.getInfo()

    let offset  = 10

    if( eosinfo.head_block_num - 172800  > dbcfg.val )
        offset = eosinfo.head_block_num - 172800
    else
        offset = dbcfg.val
    
    console.log('start for: ',offset, ' noumber:', eosinfo.head_block_num - offset )
    for( ; offset<=eosinfo.head_block_num; offset ++ ){
          await blockNewuser2db( offset )
          
    }        
    dbcfg.val = offset
    dbapi.setConfiginfo( dbcfg )
    
    setTimeout(dogetuser2db ,2000  )        
    

}

async function  dogetuser2db( ){

//dogetuser2db = async ()=>{
//
    let eosinfo =  await api_eos.getInfo()
    console.log( 'eosinfo:', eosinfo )

    let dbcfg   = await dbapi.getConfiginfobyID('1001', testfun  );
    // let dbcfg   = await dbapi.getConfiginfobyID('1001',(err,data)=>{ 
    //     dbcfg = data[0]
    // })
    // setTimeout(2000, testfun )

    /*
    let dbcfg   = await dbapi.getConfiginfobyID('1001',(err,data)=>{  
        
        dbcfg = data[0]
        console.log('dbcfg:', dbcfg )    

        let offset  = 10
 
        if( eosinfo.head_block_num - 172800  > dbcfg.val )
            offset = eosinfo.head_block_num - 172800
        else
            offset = dbcfg.val
        
        console.log('start for:')
        for( ; offset<=eosinfo.head_block_num; offset ++ ){
              await blockNewuser2db( offset )
              return 
        }        
        dbcfg.val = eosinfo.head_block_num
        dbapi.setConfiginfo( dbcfg )
    
        setTimeout(2000, dogetuser2db )        

    } )
    */
      


}

blockNewuser2db = async ( blockid )=>{
    console.log('blockNewuser2db blockid:',  blockid )
    let ret =  await api_eos.getNewAccountFromBlock( blockid ) 
    
    if(!ret )
        return 
    let accounts =  ret.data    
    accounts.forEach(item => {
        //console.log('account:', item )   
        item.keyflag = checkKeyFlag( item.accinfo )
        dbapi.insertEosUser( item )
    });
}


////////////////////////////////////////////////////////////////////////
//主流程

test = async ()=>{

    let ret = '';
    //ret =  await api_eos.getInfo();
    for(let i = 10086;i<10086+50; i++ )
        await blockNewuser2db( i )
    console.log( 'blockNewuser2db:', ret )
    return 

    

    ret =  await api_eos.getNewAccountFromBlock( 421630 ) 
    console.log('getNewAccountFromBlock ret:',  ret )
    if(!ret )
        return 
    let accounts =  ret.data    
    accounts.forEach(item => {
        console.log('account:', item )   
        item.keyflag = checkKeyFlag( item.accinfo )
        dbapi.insertEosUser( item )
    });
}

maindo = async ()=>{
    await dogetuser2db()
}

//test();
maindo();

