const express = require('express'); // express 라이브러리 사용
const app = express(); // 객체 생성
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs'); //EJS는 서버 데이터를 HTML에 쉽게쉽게 박아넣을 수 있게 도와주는 일종의 HTML 렌더링 엔진
// ejs로 쓴 html을 node js 가 렌더링을 잘 해줌

var db;
MongoClient.connect('mongodb+srv://bang:bang0324@cluster0.sp6po.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(error, client) {
    // 연결되면 할 일
    if(error) return console.log(error);
    db = client.db('todoapp');

    // db.collection('post').insertOne( {이름 : 'Myo', 나이 : 29, _id : 100}, function(error, result) {
    //     console.log('저장완료');
    // });

    app.listen(8080, function() {
        console.log('listening on 8080');
    });

});

// 서버를 띄우기 위한 기본 세팅 (express 라이브러리)
// listen(서버띄울 포트번호, 띄운 후 실행할 코드)

// 누군가가 /pet 으로 방문을 하면 pet 관련된 안내문을 띄워주자!

app.get('/pet',function(request, response) {
    response.send('펫용품 쇼핑 할 수 있는 페이지 입니다!');
});

app.get('/beauty', function(req, res) {
    res.send('뷰티용품을 쇼핑 할 수 있는 페이지 입니다!');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
// sendFile() 함수를 쓰면 파일을 보낼 수 있음
// __dirname은 현재 파일의 경로

app.get('/write', function(req, res) {
    res.sendFile(__dirname + '/write.html');
});

// 어떤 사람이 /add 경로로 post 요청을 하면 ?? 를 해주세요
app.post('/add', function(req, res) {
    res.send('전송완료!');

    // 총게시물개수가 담겨있는 컬렉션에서 개수 가져오기
    // 전체 다 찾고 싶으면 .find().toArray()
    // 하나만 찾고 싶으면
    db.collection('counter').findOne({name : '게시물갯수'}, function(error, result) {
        console.log(result.totalPost); // 0
        var totalCount = result.totalPost;
        // 어떤 사람이 /add 라는 경로로 post 요청을 하면,
        // 데이터 2개 (날짜, 제목)을 보내주는데,
        // 이때, post 라는 이름을 가진 collection 에 두개 데이터를 저장하기
        db.collection('post').insertOne( { _id : totalCount + 1, 제목 : req.body.title, 날짜 : req.body.date }, function(error, result) {
            console.log('저장완료');
        });

        // counter 라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야 함. 게시물 하나를 등록할 때마다 카운터도 1 증가 시켜야 함.

    });


    // console.log(req.body.title);    
    // console.log(req.body.date);    
    // DB에 저장해주세요.
});

// list로 GET 요청으로 접속하면
//실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get('/list', function(req, res) {
    // post 컬렉션 안의 내용들을 다 가져오기
    db.collection('post').find().toArray(function(error, result){
        console.log(result);
        res.render('list.ejs', { posts : result });
    });


});

