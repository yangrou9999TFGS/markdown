$("style")[0].outerHTML='';
$("style")[0].outerHTML='';
function addMdStyle(text){document.head.innerHTML+=`<style>${text}</style>`}
addMdStyle('<style id="mdStyle">.code{padding:2px,4px;font-size:90%;color:#c7254e;background:#f9f2f4;border-radius:4px;}img{width:200px;}.code2{display: block; padding: 9.5px; margin: 0 0 10px; font-size: 13px; line-height: 1.42857143; color: #333; word-break: break-all; word-wrap: break-word; background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 4px;}</style>');
addMdStyle('table { width: 200px; margin-bottom: 20px; border: 1px solid #d9d9d9; border-collapse: collapse; border-left: none; word-break: normal; }');
addMdStyle('table td,table th {padding: 8px;border: 1px solid #d9d9d9;line-height: 20px;vertical-align: middle;}');
addMdStyle('table tr:nth-of-type(2n) {background-color: hsla(0,0%,71%,.1);}');
addMdStyle('blockquote {padding: 10px 20px;margin: 0 2em;font-size: 17.5px;border-left: 5px solid #eee;}')
String.prototype.count=function(char){
    let __sum=0;
    for(let __i=0;__i<=this.length-char.length;__i++){
        let __flag=1;
        for(let __j=0;__j<char.length;__j++){
            if(char.charAt(__j)!=this.charAt(__i+__j))__flag=0;
        }
        if(__flag)__sum++;
    }
    return __sum;
}
function toHTML(text){
    let _line=text.split("\n");
    let i=0;
    while(i<_line.length){
        _line[i]=new String(_line[i]);
        _line[i]=_line[i].replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("'","&apos;").replaceAll('"','&quot;').replaceAll('**','"').replaceAll('~~',"'");
        if(/^```scratch-blocks$/.test(_line[i])){
            let last=i+1;
            while(!(_line[last]=='```'||last==_line.length)){
                last++;
            }
            _line[i]='';
            _line.splice(last,1);
            for(let i2=i+1;i2<last;i2++){
                _line[i]+=_line[i+1]+"\n";
                _line.splice(i+1,1);
            }
            if(/\{.*\}/.test(_line[i+1])){
                _line[i]=`<pre style='${_line[i+1].slice(1,-1).replaceAll("'",'"')}' class="code2 blocks">${_line[i]}</pre>`;
                _line[i+1]=''
            }else{
                _line[i]=`<pre class="code2 blocks">${_line[i]}</pre>`;
            }
            i++;
            continue;
        }else if(/^\\```scratch-blocks$/.test(_line[i])){
            _line[i]='```scrtach-blocks';
        }
        if(/^```$/.test(_line[i])){
            let last=i+1;
            while(!(_line[last]=='```'||last==_line.length)){
                last++;
            }
            _line[i]='';
            _line.splice(last,1);
            for(let i2=i+1;i2<last;i2++){
                _line[i]+=_line[i+1]+"\n";
                _line.splice(i+1,1);
            }
            if(/\{.*\}/.test(_line[i+1])){
                _line[i]=`<pre style='${_line[i+1].slice(1,-1).replaceAll("'",'"')}' class="code2">${_line[i]}</pre>`;
                _line[i+1]=''
            }else{
                _line[i]=`<pre class="code2">${_line[i]}</pre>`;
            }
            i++;
            continue;
        }else if(/^\\```$/.test(_line[i])){
            _line[i]='```';
        }
        let chars=new Array();
        for(let i2=0;i2<_line[i].slice('').length;chars[i2]=_line[i].slice('')[i2++]);
        let sym1=1,sym2=1,sym3=1,sym4=1;
        for(let c in chars){
            if(chars[c]=='*'){
                if(chars[c-1]!='\\')chars[c]=sym1?'<i>':'</i>',sym1=!sym1;
                else chars[c-1]='';
            }
            if(chars[c]=='"'){
                if(chars[c-1]!='\\')chars[c]=sym2?'<b>':'</b>',sym2=!sym2;
                else chars[c-1]='',chars[c]='**';
            }
            if(chars[c]=='`'){
                if(/\{.*\}/.test(_line[i+1])){
                    if(chars[c-1]!='\\')chars[c]=sym3?`<span class="code" style='${_line[i+1].slice(1,-1).replaceAll("'",'"')}'>`:'</span>',sym3=!sym3;
                    else chars[c-1]='';
                }else{
                    if(chars[c-1]!='\\')chars[c]=sym3?`<span class="code">`:'</span>',sym3=!sym3;
                    else chars[c-1]='';
                }
            }
            if(chars[c]=="'"){
                if(chars[c-1]!='\\')chars[c]=(sym4?'<strike>':'</strike>'),sym4=!sym4;
                else chars[c-1]='',chars[c]='~~';
            }
        }
        _line[i]=chars.join('');
        if(/^# /.test(_line[i]))_line[i]=`<h1>${_line[i].slice(2)}</h1>`;
        if(/^## /.test(_line[i]))_line[i]=`<h2>${_line[i].slice(3)}</h2>`;
        if(/^### /.test(_line[i]))_line[i]=`<h3>${_line[i].slice(4)}</h3>`;
        if(/^#### /.test(_line[i]))_line[i]=`<h4>${_line[i].slice(5)}</h4>`;
        if(/^##### /.test(_line[i]))_line[i]=`<h5>${_line[i].slice(6)}</h5>`;
        if(/^###### /.test(_line[i]))_line[i]=`<h6>${_line[i].slice(7)}</h6>`;
        if(/  $/.test(_line[i])&&_line[i+1]!='')_line[i]=_line[i].slice(0,-2)+'<br>';
        if(_line[i+1]=='')_line[i]+='<br><br>';
        let i2=0;
        while(/!\[.*\]\(.*\)/.test(_line[i])&&!/\\!\[.*\]\(.*\)/.test(_line[i])){
            let _url='',_name='',_title='';
            while(_line[i].charAt(i2)!='['&&i2!=_line[i].length)i2++;
            let f=i2++-1;
            while((_line[i].charAt(i2)!=']'||_line[i].charAt(i2+1)!='(')&&i2!=_line[i].length){
                _name+=_line[i].charAt(i2);
                i2++;
            }
            i2+=2;
            while(_line[i].charAt(i2)!=')'&&i2!=_line[i].length){
                _url+=_line[i].charAt(i2);
                i2++;
            }
            let l=i2;
            if(i2==_line[i].length)break;
            if(/ “.*“/.test(_url)){
                _title=_url.slice(_url.indexOf(' ')+2,-1);
                _url=_url.slice(0,_url.indexOf(' '));
            }
            if(/\{.*\}/.test(_line[i+1])){
                _line[i]=_line[i].slice(0,f)+`<img style='${_line[i+1].slice(1,-1).replaceAll("'",'"')}' title='${_title}' alt='${_name}' src='${_url}'>`+_line[i].slice(l+1);
            }else{
                _line[i]=_line[i].slice(0,f)+`<img title='${_title}' alt='${_name}' src='${_url}'>`+_line[i].slice(l+1);
            }
        }
        while(/\[.*\]\(.*\)/.test(_line[i])&&!/\\\[.*\]\(.*\)/.test(_line[i])){
            let _url='',_name='',_title='';
            while(_line[i].charAt(i2)!='['&&i2!=_line[i].length)i2++;
            let f=i2++;
            while((_line[i].charAt(i2)!=']'||_line[i].charAt(i2+1)!='(')&&i2!=_line[i].length){
                _name+=_line[i].charAt(i2);
                i2++;
            }
            i2+=2;
            while(_line[i].charAt(i2)!=')'&&i2!=_line[i].length){
                _url+=_line[i].charAt(i2);
                i2++;
            }
            let l=i2;
            if(i2==_line[i].length)break;
            if(/ “.*“/.test(_url)){
                _title=_url.slice(_url.indexOf(' ')+2,-1);
                _url=_url.slice(0,_url.indexOf(' '));
            }
            if(/\{.*\}/.test(_line[i+1])){
                _line[i]=_line[i].slice(0,f)+`<a style='${_line[i+1].slice(1,-1).replaceAll("'",'"')}' title='${_title}' href='${_url}'>${_name}</a>`+_line[i].slice(l+1);
            }else{
                _line[i]=_line[i].slice(0,f)+`<a title='${_title}' href='${_url}'>${_name}</a>`+_line[i].slice(l+1);
            }
        }
        if(/^-{3,}$/.test(_line[i])){
            if(/\{.*\}/.test(_line[i+1])){
                _line[i]=`<hr style='${_line[i+1].slice(1,-1).replaceAll("'",'"')}'>`
            }else{
                _line[i]="<hr>"
            }
        }else if(/^\\-{3,}$/.test(_line[i])){
            _line[i]=_line[i].replace('\\','');
        }
        if(/^\|(.*\|)*/.test(_line[i])){
        while(1){
            let __count=1;
            for(let __i2=i+1;/^\|(.*\|){1,}/.test(_line[__i2]);__i2++,__count++);
            let __table=new Array(__count);
            if(__table.length<2){
                break;
            }
            for(let __i2=i;/^\|(.*\|){1,}/.test(_line[__i2]);__i2++){
                __table[__i2-i]=_line[__i2].split('|').slice(1,-1);
                for(let __i4=__table[__i2-i].length-2;__i4>=0;__i4--){
                    if(__table[__i2-i][__i4].charAt(__table[__i2-i][__i4].length-1)=='\\'){
                        __table[__i2-i][__i4]=__table[__i2-i][__i4].slice(0,-1)+'|'+__table[__i2-i][__i4+1];
                        __table[__i2-i].splice(__i4+1,1);
                    }
                }
            }
            for(let __i2=0;__i2<__table[1].length;__i2++){
                if(/:-*:/.test(__table[1][__i2]))__table[1][__i2]='center';
                else if(/-*:/.test(__table[1][__i2]))__table[1][__i2]='right';
                else __table[1][__i2]='left';
            }
            let __align=__table[1];
            __table.splice(1,1);
            let __content="";
            for(let __i3=0;__i3<__table.length;__i3++){
                if(__i3+1!=__table.length){
                    if(/(\{.*\}){1,}/.test(__table[__i3+1].join(''))){
                        let __style=__table[__i3+1];
                        for(let __i4=0;__i4<__style.length;__style[__i4]=__style[__i4++].replaceAll("'",'"'));
                        __table.splice(__i3+1,1);
                        if(/\{\{.*\}\}/.test(__style[0])){
                            __content+=`<tr style='${__style[0].slice(2,-2)}'>`
                            for(let __i2=0;__i2<__table[0].length;__i2++){
                                __content+=`<td align='${__align[__i2]}' style='${__style.length>1?__style[__i2+1>=__style.length?__style.length-1:__i2+1].slice(1,-1):__i2+1>=__style.length?__style.length-1:__style[__i2+1].slice(1,-1)}'>${__table[__i3][__i2]}</td>`
                            }
                        }else{
                            __content+=`<tr>`
                            for(let __i2=0;__i2<__table[0].length;__i2++){
                                __content+=`<td align='${__align[__i2]}' style='${__style[__i2>=__style.length?__style.length-1:__i2].slice(1,-1)}'>${__table[__i3][__i2]}</td>`
                            }
                        }
                    }else{
                        __content+="<tr>"
                        for(let __i2=0;__i2<__table[0].length;__i2++){
                            __content+=`<td align='${__align[__i2]}'>${__table[__i3][__i2]}</td>`
                        }
                    }
                }else{
                    __content+="<tr>"
                    for(let __i2=0;__i2<__table[0].length;__i2++){
                        __content+=`<td align='${__align[__i2]}'>${__table[__i3][__i2]}</td>`
                    }
                }
                __content+="</tr>";
            }
            if(/\{.*\}/.test(_line[i+__count])){
                __content=`<table style='${_line[i+__count].slice(1,-1).replaceAll("'",'"')}'>${__content}</table>`;
            }else{
                __content=`<table>${__content}</table>`;
            }
            _line[i]=__content;
            _line.splice(i+1,__count-1);
            break;
        }
        }
        if(/^- /.test(_line[i])){
            let __count=0,__content=new Array();
            while(/^- /.test(_line[__count+i])&&__count+i!=_line.length){
                __content[__content.length]=_line[__count+i].slice(2);
                __count++;
            }
            for(let __i2=0;__i2<__content.length;__i2++){
                if(/\{.*\}/.test(__content[__i2+1])){
                    __content[__i2]=`<li style='${__content[__i2+1].slice(1,-1).replaceAll("'","\'")}'>${__content[__i2]}</li>`;
                    __content.splice(__i2+1,1);
                    __count--;
                }else{
                    __content[__i2]=`<li>${__content[__i2]}</li>`;
                }
            }
            _line[i]=`<ul>${__content.join('')}</ul>`;
            console.log(__count);
            console.log(i+1);
            console.log(_line);
            _line.splice(i+1,__count-1);
        }
        let qqFace=['微笑','撇嘴','色','发呆','得意','流泪','害羞','闭嘴','睡','大哭','尴尬','发怒','调皮','呲牙','惊讶','难过','酷','冷汗','抓狂','吐','偷笑','愉快','白眼','傲慢','饥饿','困','惊恐','流汗','憨笑','悠闲','奋斗','咒骂','疑问','嘘','晕','疯了','衰','骷髅','敲打','再见','擦汗','抠鼻','鼓掌','糗大了','坏笑','左哼哼','右哼哼','哈欠','鄙视','委屈','快哭了','阴险','亲亲','吓','可怜','菜刀','西瓜','啤酒','篮球','乒乓','咖啡','饭','猪头','玫瑰','凋谢','嘴唇','爱心','心碎','蛋糕','闪电','炸弹','刀','足球','瓢虫','便便','月亮','太阳','礼物','拥抱','强','弱','握手','胜利','抱拳','勾引','拳头','差劲','爱你','NO','OK','爱情','飞吻','跳跳','发抖','怄火','转圈','磕头','回头','跳绳','投降','激动','乱舞','献吻','左太极','右太极','嘿哈','捂脸','滑稽','机智','皱眉','耶','吃瓜','猫','二哈','doge'];
        for(let __i2=0;__i2<qqFace.length;__i2++){
            _line[i]=_line[i].replaceAll('/'+qqFace[__i2],`<span class="qq_face qqface${__i2}"></span>`);
        }

        if(/^\{.*\}/.test(_line[i+1])){
            _line[i+1]=_line[i+1].replaceAll("'",'"');
            _line[i]=`<span style='${_line[i+1].slice(1,-1)}'>${_line[i]}</span>`;
            _line[i+1]='';
        }
        _line[i]=_line[i].replaceAll('\\\\','\\');
        _line[i]=_line[i].replaceAll('\\|','|');
        _line[i]=_line[i].replaceAll('\\[','[');
        _line[i]=_line[i].replaceAll('\\!','!');
        _line[i]=_line[i].replaceAll('\\-','-');
        _line[i]=_line[i].replaceAll('\\{','{');
        _line[i]=_line[i].replaceAll('\\.','.');
        i++;
    }
    return _line.join('');
}
let markdown={
    "toHTML":toHTML,
    "addMdStyle":addMdStyle
};
