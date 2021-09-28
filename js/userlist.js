let userlistModule=(function(){
    let department=document.querySelector('.department'),
        searchbox=document.querySelector('.searchbox'),
        container=document.querySelector('.container'),
        checkall=document.querySelector('.checkall'),
        deletebtn=document.querySelector('.delete'),
        checkgroup;
    // 绑定部门
    async function bindDepartment(){
        let departmentinfo=await tool.queryDepartment();
        //数据绑定
        if(departmentinfo.code===0){
            let str=`<option value="0">全部</option>`;
            departmentinfo.data.forEach((item)=>{
                str+=`<option value=${item.id}>${item.name}</option>`;
            });
            department.innerHTML=str;
        }
    }
    // 获取用户数据
    async function bindHtml(){
        let result=await axios.get('/user/list',{
            params:{
                departmentId:department.value,
                search:searchbox.value.trim()
            }
        })
        let str=``;
        if(result.code===0){
            result.data.forEach((item)=>{
                str+=`<tr>
                <td><input type="checkbox" class="checkgroup" userid=${item.id}></td>
                <td>${item.name}</td>
                <td>${item.sex}</td>
                <td>${item.department}</td>
                <td>${item.job}</td>
                <td>${item.email}@163.com </td>
                <td>${item.phone}</td>
                <td>${item.desc}</td>
                <td userid=${item.id}>
                    <span class="operate"><a href="javascript:;">编辑</a></span>
                    <span class="operate"><a href="javascript:;">删除</a></span>
                    <span class="operate"><a href="javascript:;">重置密码</a></span>
                </td>
                </tr>`
            });
            container.innerHTML=str;
            //html内容绑定好后处理批量删除和全选
            checkgroup=container.querySelectorAll('.checkgroup');
            //全选处理
            tool.checkAll(checkall,checkgroup,container);
            // 批量删除处理
            tool.groupDel(deletebtn,checkgroup,bindHtml);
        }
    }
    //根据选择框重新绑定数据
    function handleHtml(){
        department.addEventListener('change',bindHtml);
        searchbox.addEventListener('keydown',(ev)=>{
            if(ev.keyCode===13) bindHtml()
        })
    }

    return {
        init(){
            bindDepartment();
            bindHtml();
            handleHtml();
            //定义操作
            tool.operation(`useradd.html?userId=${userid}`,); 
        }
    }
})()
userlistModule.init();