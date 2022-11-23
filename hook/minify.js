#!/usr/bin/env node

module.exports=function(ctx){

    let excludefile=[
            'loaded.js',
            // 'nlibrary.js',
        ];

    const fs=require('fs'),
        path=require('path'),
        UglifyJS=require('uglify-js'),
        CleanCSS=require('clean-css'),
        imagemin=require('imagemin'),
        imageminSvgo=require('imagemin-svgo'),
        imageminJpegtran=require('imagemin-jpegtran'),
        imageminGifsicle=require('imagemin-gifsicle'),
        imageminOptipng=require('imagemin-optipng'),
        htmlMinify=require('html-minifier').minify,
        projectRoot=ctx.opts.projectRoot;
        cmdoption=ctx.opts.options;

    if(!cmdoption['minify']) return; //Don't Minify

    let wwwPath=[
            projectRoot+'/platforms/ios/www', //ios
            projectRoot+'/platforms/android/app/src/main/assets/www', //android
        ];
    let wwwExt=['.html','.js','.css','.svg','.gif','.png','.jpg'];

    let cssOptions={keepSpecialComments:0},
        cssMinifier=new CleanCSS(cssOptions),
        htmlOptions={
            removeAttributeQuotes:true,
            removeComments:true,
            minifyJS:true,
            minifyCSS:cssOptions,
            collapseWhitespace:true,
            conservativeCollapse:true,
            removeComments:true,
            removeEmptyAttributes:true,
            ignoreCustomFragments:[/<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/,/{{[\s\S]*?}}/],
        };

    //File list set
    let filelists={};
    const findfiles=(paths,exts)=>{try{  
        paths.forEach(dpath=>{
            fs.readdirSync(dpath,{withFileTypes:true}).forEach((file)=>{
                const apath=`${dpath}/${file.name}`;         
                if(file.isDirectory()){ 
                    findfiles([apath],exts);
                }else{
                    const ex=path.extname(apath).toLowerCase(); if(ex=='.jpeg') ex='.jpg';
                    if(exts.indexOf(ex)>-1){ 
                        if(!filelists[ex]) filelists[ex]=[];
                        if(/svg|gif|png|jpg/gi.test(ex)){
                            if(filelists[ex].indexOf(path.dirname(apath))==-1) 
                                filelists[ex].push(path.dirname(apath));
                        }else{
                            filelists[ex].push(apath);
                        }
                    }
                }
            });
        });
    }catch(err){ 
        return console.error('Read file Error', err);
    }}

    findfiles(wwwPath,wwwExt);

    console.log('Starting Minify files in www path!');
    for(var key in filelists){
        var val=filelists[key];
        if(!val.length) return true;
        switch(key){
            case '.html':
                val.forEach(file=>{
                    //제외파일
                    var pass=false;
                    excludefile.forEach(ex=>{
                        if(file.match(new RegExp(ex,'gi'))){
                            pass=true;
                            return false;
                        }
                    }); if(pass) return;
                    var source=fs.readFileSync(file, 'utf8');
                    if(!source||source.length==0){
                        console.error('Empty Minify: '+file);
                    }else{
                        var result=htmlMinify(source, htmlOptions);
                        if(!result||result.length==0){
                            console.error('\x1b[31mError Minify: %s\x1b[0m', file);
                        }
                        else{
                            fs.writeFileSync(file, result, 'utf8');
                        }
                    }
                });
                break;
            case '.js':
                val.forEach(file=>{
                    //제외파일
                    var pass=false;
                    excludefile.forEach(ex=>{
                        if(file.match(new RegExp(ex,'gi'))){
                            pass=true;
                            return false;
                        }
                    }); if(pass) return;
                    var source=fs.readFileSync(file, 'utf8');
                    if(!source||source.length==0){
                        console.error('Empty Minify: '+file);
                    }else{
                        var result=UglifyJS.minify(source, {
                            compress: {
                                dead_code: true,
                                loops: true,
                                if_return: true,
                                keep_fargs: true,
                                keep_fnames: true
                            }
                        });
                        if(!result||!result.code||result.code.length==0){
                            console.error(result,'\x1b[31mError Minify: %s\x1b[0m', file);
                        }else{
                            fs.writeFileSync(file, result.code, 'utf8');
                        }
                    }
                });
                break;
            case '.css':
                val.forEach(file=>{
                    //제외파일
                    var pass=false;
                    excludefile.forEach(ex=>{
                        if(file.match(new RegExp(ex,'gi'))){
                            pass=true;
                            return false;
                        }
                    }); if(pass) return;
                    var source=fs.readFileSync(file, 'utf8');
                    if(!source||source.length==0){
                        console.error('Empty Minify: '+file);
                    }else{
                        var result=cssMinifier.minify(source).styles;
                        if(!result||result.length==0){
                            console.error('\x1b[31mError Minify: %s\x1b[0m', file);
                        }
                        else{
                            fs.writeFileSync(file, result, 'utf8');
                        }
                    }
                });
                break;
            // Image options https://github.com/imagemin/imagemin
            case '.svg':
                val.forEach(file=>{
                    //제외파일
                    var pass=false;
                    excludefile.forEach(ex=>{
                        if(file.match(new RegExp(ex,'gi'))){
                            pass=true;
                            return false;
                        }
                    }); if(pass) return;
                    // svgGo options https://www.npmjs.com/package/imagemin-svgo#options
                    imagemin([file+'/*.'+key], { destination:file, plugins: [imageminSvgo()]}).then((files) => {
                    });
                });
                break;
            case '.gif':
                val.forEach(file=>{
                    //제외파일
                    var pass=false;
                    excludefile.forEach(ex=>{
                        if(file.match(new RegExp(ex,'gi'))){
                            pass=true;
                            return false;
                        }
                    }); if(pass) return;
                    // OptiPNG options https://www.npmjs.com/package/imagemin-optipng#options
                    imagemin([file+'/*.'+key], { destination:file, plugins: [imageminGifsicle({interlaced: true})]}).then((files) => {
                    });
                });
                break;
            case '.png':
                val.forEach(file=>{
                    //제외파일
                    var pass=false;
                    excludefile.forEach(ex=>{
                        if(file.match(new RegExp(ex,'gi'))){
                            pass=true;
                            return false;
                        }
                    }); if(pass) return;
                    // OptiPNG options https://www.npmjs.com/package/imagemin-optipng#options
                    imagemin([file+'/*.'+key], { destination:file, plugins: [imageminOptipng({optimizationLevel: 2})]}).then((files) => {
                    });
                });
                break;
            case '.jpg':
                val.forEach(file=>{
                    //제외파일
                    var pass=false;
                    excludefile.forEach(ex=>{
                        if(file.match(new RegExp(ex,'gi'))){
                            pass=true;
                            return false;
                        }
                    }); if(pass) return;
                    // jpegTran options https://www.npmjs.com/package/imagemin-jpegtran#options
                    imagemin([file+'/*.'+key], { destination:file, plugins: [imageminJpegtran({progressive: true})]}).then((files)=>{
                    });
                });
                break;
            default:
                console.error('Encountered file with '+key+' extension - not compressing.');
                break;
        }

    };

}