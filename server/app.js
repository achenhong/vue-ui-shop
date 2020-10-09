// 加载express模块
const express = require("express");
//1, 加载 cors模块 从服务器端,解决跨域问题
const cors = require("cors");
// 创建express对象  注意括号
const server = express();
// 加载body'parser模块
const bodyParser = require("body-parser");
//
//11, 加载MySQL模块
const mysql = require("mysql");
//22, 创建连接池
const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "xz",
  charset: "utf8",
  connectionLimit: 20,
});
// 获取文章分类信息的接口
//2, 使用cors中间件  (使用server必须要在server加载后使用)
server.use(
  cors({
    origin: ["http://127.0.0.1:8080", "http://localhost:8080"],
  })
);

// 使用模块
server.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
// 获取商品分类的信息
server.get("/category", (req, res) => {
  let sql = "select fid,fname from  xz_laptop_family";
  pool.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.send({ message: "查询成功", code: 1, results: results });
    // console.log(results);
  });
  // res.send("ok");
});
// 获取轮播图的信息
server.get("/carousel", (req, res) => {
  let sql = "select cid,img,href from  xz_index_carousel";
  pool.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.send({ message: "查询成功", code: 1, results: results });
    // console.log(results);
  });
  // res.send("ok");
});
// 获取首页商品的信息
server.get("/index", (req, res) => {
  let sql = "select pid,title,details,pic,price from  xz_index_product";
  pool.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.send({ message: "查询成功", code: 1, results: results });
    // console.log(results);
  });
  // res.send("ok");
});
// 获取导航栏切换时商品的信息
server.get("/indexchange", (req, res) => {
  // console.log(req.query);
  let fid = req.query.id;
  let sql = "select lid,title,price, pic from  xz_laptop  where family_id =?";
  pool.query(sql, [fid], (err, results) => {
    if (err) {
      throw err;
    }
    res.send({ message: "查询成功", code: 1, results: results });
    // console.log(results);
  });
  // res.send("ok");
});
// 获取导航栏切换时商品的照片
server.get("/indexchange_pic", (req, res) => {
  // console.log(req.query);
  let lid = req.query.id;
  let sql = "select pid,md from  xz_laptop_pic  where laptop_id =?";
  pool.query(sql, [lid], (err, results) => {
    if (err) {
      throw err;
    }
    res.send({ message: "查询成功", code: 1, results: results });
    // console.log(results);
  });
  // res.send("ok");
});
// 获取商品详情信息
server.get("/promsg", (req, res) => {
  // console.log(req.query);
  let lid = req.query.lid;
  let sql =
    "select lid,title,subtitle,price,promise,spec,category,lname,is_onsale pic from  xz_laptop  where lid =?";
  pool.query(sql, [lid], (err, results) => {
    if (err) {
      throw err;
    }
    res.send({ message: "查询成功", code: 1, results: results });
    // console.log(results);
  });
  // res.send("ok");
});
// 获取商品详情的照片
server.get("/proimg", (req, res) => {
  // console.log(req.query);
  let lid = req.query.lid;
  let sql = "select pid,sm,md,lg from  xz_laptop_pic  where laptop_id =?";
  pool.query(sql, [lid], (err, results) => {
    if (err) {
      throw err;
    }
    res.send({ message: "查询成功", code: 1, results: results });
    // console.log(results);
  });
  // res.send("ok");
});

// 个人信息的查看
server.get("/userMsg", (req, res) => {
  // console.log(req.query);
  let uname = req.query.uname;
  let sql = "select uid,uname,email,phone,avatar,user_name,gender from  xz_user  where uname =?";
  pool.query(sql, [uname], (err, results) => {
    if (err) {
      throw err;
    }
    res.send({ message: "查询成功", code: 1, results: results });
    // console.log(results);
  });
  // res.send("ok");
});

































//获取文章信息
// server.get("/articles", (req, res) => {
//   //接收URL的参数 -- cid表示分类ID
//   let cid = req.query.cid;
//   //接收URL的参数 -- page表示当前页码
//   let page = req.query.page;
//   //声明变量,用于设置每页显示的记录数，假定为20
//   let pagesize = 20;
//   //根据每页显示的记录数量及当前页码来计算offset参数值
//   let offset = (page - 1) * pagesize;

//   //统计某一分类下包含的文章总数
//   let sql = "SELECT COUNT(id) AS count FROM xzqa_article WHERE category_id=?";

//   pool.query(sql, [cid], (err, results) => {
//     if (err) throw err;
//     //获取该分类下的总记录数
//     let rowcount = results[0].count;
//     //计算总页数
//     let pagecount = Math.ceil(rowcount / pagesize);
//     //查询该分类下文章的SQL语句
//     sql =
//       "SELECT id,subject,description,image FROM xzqa_article WHERE category_id=? LIMIT " +
//       offset +
//       "," +
//       pagesize;
//     //执行SQL语句(为占位符传递实际值)
//     pool.query(sql, [cid], (err, results) => {
//       if (err) throw err;
//       res.send({
//         message: "查询成功",
//         code: 1,
//         results: results,
//         pagecount: pagecount,
//       });
//     });
//   });
// });

// //获取某一篇文章的详细信息
// server.get("/article", (req, res) => {
//   // 获取请求地址栏的id
//   let id = req.query.id;
//   let sql =
//     "SELECT r.id,subject,content,created_at,nickname,avatar ,article_number FROM xzqa_article AS r INNER JOIN xzqa_author AS u ON author_id = u.id WHERE r.id=?";
//   pool.query(sql, [id], (err, results) => {
//     if (err) throw err;
//     res.send({ message: "查询成功", code: 1, results: results[0] });
//   });
// });

// 用户注册
// express模块不能接收post传来的参数，需要用到bodyparser模块
server.post("/register", (req, res) => {
  let uname = req.body.username;
  let upwd = req.body.password;
  let sql = "select  uid,uname from xz_user where  uname= ?";
  pool.query(sql, [uname], (err, results) => {
    if (err) throw err;
    // 根据用户名是否存在，继续操作，不存在的话，写入数据库
    if (results.length == 0) {
      // 将用户账号密码写入数据库，密码用MD5
      sql = "insert into xz_user(uname,upwd) value( ?,MD5(?) )";
      pool.query(sql, [uname, upwd], (err, results) => {
        if (err) throw err;
        res.send({ message: "注册成功", code: 1 });
      });
    } else {
      // 如果长度>0说明用户名存在
      res.send({ message: "用户名已经存在", code: 0 });
    }
    // console.log(results);
  });
  // console.log(req.body);
});

// 用户登录
server.post("/login", (req, res) => {
  let uname = req.body.username;
  let upwd = req.body.password;
  // console.log(req.body);
  let sql =
    "select  uid,uname,user_name from xz_user where  uname= ? AND upwd=MD5(?)";
  pool.query(sql, [uname, upwd], (err, results) => {
    // console.log(results);
    // console.log(results.RowDataPacket.uid)
    if (err) throw err;
    if (results.length == 1) {
      res.send({ message: "登陆成功", code: 1 });
    } else {
      res.send({ message: "登陆失败", code: 0 });
    }
  });
});

// 指定监听的端口号
server.listen(5000, () => {
  console.log(`server running。。。。`);
});
