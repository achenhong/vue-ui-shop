// 加载express模块
const express=require("express");
//1, 加载 cors模块 从服务器端,解决跨域问题
const cors =require("cors");
// 创建express对象  注意括号
const server =express();
// 加载body'parser模块
const bodyParser=require('body-parser')
// 
//11, 加载MySQL模块
const mysql =require("mysql");
//22, 创建连接池
const pool=mysql.createPool({
    host:'127.0.0.1',
    port:3306,
    user:'root',
    password:'',
    database:'shop',
    charset:'utf8',
    connectionLimit:20
})
// 获取文章分类信息的接口
//2, 使用cors中间件  (使用server必须要在server加载后使用)
server.use(cors({
    origin:['http://127.0.0.1:8080','http://localhost:8080']

}));

// 使用模块
server.use(bodyParser.urlencoded({
  extended:false
}))
// ①获取商品分类的信息
server.get('/category',(req,res)=>{
    let sql="select c_id,category from  category";
    pool.query(sql,(err,results)=>{
        if(err){throw err};
        res.send({message:'查询成功',code:1,results:results});
       // console.log(results);
    })
    // res.send("ok");
})
//获取商品详细信息
server.get("/products", (req, res) => {
    //接收URL的参数 -- cid表示分类ID
    let cid = req.query.cid;
    //接收URL的参数 -- page表示当前页码
    let page = req.query.page;
    //声明变量,用于设置每页显示的记录数，假定为20
    let pagesize = 10;
    //根据每页显示的记录数量及当前页码来计算offset参数值
    let offset = (page - 1) * pagesize;
  
    //统计某一分类下包含的文章总数
    let sql = "SELECT COUNT(product_id) AS count FROM product WHERE c_id=?";
  
    pool.query(sql, [cid], (err, results) => {
      if (err) throw err;
      //获取该分类下的总记录数
      let rowcount = results[0].count;
      //计算总页数
      let pagecount = Math.ceil(rowcount / pagesize);
      //查询该分类下文章的SQL语句
      sql =
        "SELECT product_id,name,price,image FROM product WHERE c_id=? LIMIT " +
        offset +
        "," +
        pagesize;
      //执行SQL语句(为占位符传递实际值)
      pool.query(sql, [cid], (err, results) => {
        if (err) throw err;
        res.send({ message: "查询成功", code: 1, results: results, pagecount: pagecount });
      });
      
    });
  
  });


//获取某一篇文章的详细信息
server.get("/article",(req,res)=>{
  // 获取请求地址栏的id
  let id=req.query.id;
  let sql="SELECT r.id,subject,content,created_at,nickname,avatar ,article_number FROM xzqa_article AS r INNER JOIN xzqa_author AS u ON author_id = u.id WHERE r.id=?";
  pool.query(sql, [id], (err, results) => {
    if (err) throw err;
    res.send({ message: "查询成功", code: 1, results: results[0]});
  });

}) 

// 用户注册
// express模块不能接收post传来的参数，需要用到bodyparser模块
server.post("/register",(req,res)=>{
  let username=req.body.username;
  let password=req.body.password;
  let sql="select  id,username from xzqa_author where  username= ?"
  pool.query(sql,[username],(err,results)=>{
    if (err) throw err;
    // 根据用户名是否存在，继续操作，不存在的话，写入数据库
    if(results.length==0){
      // 将用户账号密码写入数据库，密码用MD5
      sql="insert into xzqa_author(username,password) value( ?,MD5(?) )"
      pool.query(sql,[username,password],(err,results)=>{
        if (err) throw err;
        res.send({message:'注册成功',code:1});
      })
    }else{
      // 如果长度>0说明用户名存在
      res.send({message:'用户名已经存在',code:0})
    }
    console.log(results)
  })
  console.log(req.body)
})

// 用户登录
server.post("/login",(req,res)=>{
  let username=req.body.username;
  let password=req.body.password;
  console.log(req.body)
  let sql="select  id,username,nickname from xzqa_author where  username= ? AND password=MD5(?)"
  pool.query(sql,[username,password],(err,results)=>{
    console.log(results)
    if(results.length==1){
      res.send({message:'登陆成功',code:1})    

    }else{
      res.send({message:'登陆失败',code:0})

    }
  })
})


// 指定监听的端口号
server.listen(5000,()=>{
    console.log(`server running。。。。`)
});

