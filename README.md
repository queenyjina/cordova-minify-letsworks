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

## Dependencies
* [uglify-js](https://github.com/mishoo/UglifyJS2)
* [clean-css](https://github.com/jakubpawlowicz/clean-css)
* [imagemin](https://github.com/imagemin/imagemin) (**not** image-min)
* [imagemin-svgo](https://github.com/imagemin/imagemin-svgo)
* [imagemin-jpegtran](https://github.com/imagemin/imagemin-jpegtran)
* [imagemin-gifsicle](https://github.com/imagemin/imagemin-gifsicle)
* [imagemin-optipng](https://github.com/imagemin/imagemin-optipng)
* [html-minifier](https://github.com/kangax/html-minifier)
