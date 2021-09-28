let customerlist=(function(){
    let checkall=document.querySelector('.checkall'),
        department=document.querySelector('.department'),
        searchbox=document.querySelector('.searchbox'),
        container=document.querySelector('.container'),
        pageBox=document.querySelector('.pageBox'),
        checkgroup;

    let lx='my',
        limit=10,
        page=1;

    //根据选择框重新绑定数据 
    function handleHtml(){
        department.addEventListener('change',bindHtml);
        searchbox.addEventListener('keydown',(ev)=>{
            if(ev.keyCode===13) bindHtml()
        })
    }
    // 获取用户数据
    async function bindHtml(){
        let result=await axios.get('/customer/list',{
            params:{
                lx,
                type:department.value,
                search:searchbox.value.trim(),
                limit,
                page
            }
        })
        let str=``;
        //处理数据表格的动态生成
        if(result.code==0){
            result.data.forEach((item)=>{
                str+=`<tr>
            <td><input type="checkbox" class="checkgroup" customerId=${item.id}></td>
            <td>${item.name}</td>
            <td>${item.sex}</td>
            <td>${item.email}</td>
            <td>${item.phone}<span</td>
            <td>${item.weixin}</td>
            <td>${item.QQ}</td>
            <td>${item.type}</td>
            <td>${item.username?item.username:''}</td>
            <td>${item.address}</td>
            <td customerId=${item.id}>
                <span class="operate"><a href="javascript:;">编辑</a></span>
                <span class="operate"><a href="javascript:;">删除</a></span>
                <span class="operate"><a href="javascript:;">回访记录</a></span>
            </td>
        </tr>`
            });
        container.innerHTML=str;
        }
        //处理下一页的动态显示
        let recpage=parseInt(result.page),
            totalPage=parseInt(result.totalPage);
            str=``;
        if(totalPage>1){
            str+= recpage>1?`<a href="javascript:;">上一页</a>`:'';
            str+=`<ul class="pageNum">`;
            for(let i=1;i<=totalPage;i++){
                str+=`<li class=${i==recpage?"active":""}>${i}</li>`
            }
            str+=`</ul>`;
            str+= recpage<totalPage?`<a href="javascript:;">下一页</a>`:'';
        }
        pageBox.innerHTML=str;
        //html内容绑定好后处理批量删除和全选
        checkgroup=container.querySelectorAll('.checkgroup');
        //全选处理
        tool.checkAll(checkall,checkgroup,container);
    }
    // 分页处理
    function splitHandle(){
        pageBox.addEventListener('click',(ev)=>{
            let target=ev.target,
                tagname=target.tagName,
                temp=page,
                text=target.innerHTML;
            if(tagname=='A'){
                if(text=='下一页') temp++;
                else temp--;
            }
            if(tagname=='LI'){
                temp=parseInt(text);
            }
            if(temp!=page){
                console.log('11');
                page=temp;
                bindHtml();
            }
        })
    }
    return{
        init(){
            window.location.href.queryURLParams('lx')?lx=window.location.href.queryURLParams('lx'):null;
            bindHtml();
            handleHtml();
            splitHandle();
        }
    }
})()
customerlist.init();