document.head.innerHTML+='<style>.code{padding:2px,4px;font-size:90%;color:#c7254e;background:#f9f2f4;border-radius:4px;}img{width:200px;}.code2{display: block; padding: 9.5px; margin: 0 0 10px; font-size: 13px; line-height: 1.42857143; color: #333; word-break: break-all; word-wrap: break-word; background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 4px;}</style>'
function toHTML(text){
    let _line=text.split("\n");
    let i=0;
    while(i<_line.length){
        _line[i]=new String(_line[i]);
        _line[i]=_line[i].replaceAll("<","＜").replaceAll(">","＞").replaceAll("'","’").replaceAll('"','“').replaceAll('**','"');
        if(/^```/.test(_line[i])){
            let last=i+1;
            while(!(_line[last]=='```'||last==_line.length)){
                last++;
            }
            _line[i]='';
            _line.splice(last,1);
            for(let i2=i+1;i2<last;i2++){
                _line[i]+=_line[i+1]+"<br>";
                _line.splice(i+1,1);
            }
            if(/\{.*\}/.test(_line[i+1])){
                _line[i]=`<pre style='${_line[i+1].slice(1,-1)}' class="code2">${_line[i]}</pre>`;
                _line[i+1]=''
            }else{
                _line[i]=`<pre class="code2">${_line[i]}</pre>`;
            }
            i++;
            continue;
        }
        let chars=new Array();
        for(let i2=0;i2<_line[i].slice('').length;chars[i2]=_line[i].slice('')[i2++]);
        let sym1=0,sym2=0,sym3=0;
        for(let c in chars){
            if(chars[c]=='*'){
                sym1=!sym1;
                if(chars[c-1]!='\\')chars[c]=sym1?'<i>':'</i>';
            }
            if(chars[c]=='"'){
                sym2=!sym2;
                if(chars[c-1]!='\\')chars[c]=sym2?'<b>':'</b>';
            }
            if(chars[c]=='`'){
                sym3=!sym3;
                if(/\{.*\}/.test(_line[i+1])){
                    if(chars[c-1]!='\\')chars[c]=sym3?`<span class="code" style='${_line[i+1].slice(1,-1)}'>`:'</span>';
                }else{
                    if(chars[c-1]!='\\')chars[c]=sym3?`<span class="code">`:'</span>';
                }
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
        while(/!\[.*\]\(.*\)/.test(_line[i])){
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
                _line[i]=_line[i].slice(0,f)+`<img style='${_line[i+1].slice(1,-1)}' title='${_title}' alt='${_name}' src='${_url}'>`+_line[i].slice(l+1);
            }else{
                _line[i]=_line[i].slice(0,f)+`<img title='${_title}' alt='${_name}' src='${_url}'>`+_line[i].slice(l+1);
            }
        }
        while(/\[.*\]\(.*\)/.test(_line[i])){
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
                _line[i]=_line[i].slice(0,f)+`<a style='${_line[i+1].slice(1,-1)}' title='${_title}' href='${_url}'>${_name}</a>`+_line[i].slice(l+1);
            }else{
                _line[i]=_line[i].slice(0,f)+`<a title='${_title}' href='${_url}'>${_name}</a>`+_line[i].slice(l+1);
            }
        }

        if(/\{.*\}/.test(_line[i+1])){
            _line[i+1]=_line[i+1].replaceAll("'",'"');
            _line[i]=`<span style='${_line[i+1].slice(1,-1)}'>${_line[i]}</span>`;
            _line[i+1]='';
        }
        i++;
    }
    return _line.join('');
}
let markdown={
    "toHTML":toHTML
};