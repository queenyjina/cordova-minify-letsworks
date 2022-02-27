# cordova-minify-letsworks

cordova www 내에 소스등을 최적화 하는 plugin 입니다.

## 설치
```
npm install https://github.com/queenyjina/cordova-minify-letsworks.git
```
## 설정
config.xml 파일에 아래 구문삽입
```
<hook src="hook/minify.js" type="after_prepare"/>
```