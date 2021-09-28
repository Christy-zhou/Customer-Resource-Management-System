let useraddModule=(function(){
    let userdepartment=document.querySelector('.department'),
        userjob=document.querySelector('.job'),
        username=document.querySelector('.username')
        usernameWarning=document.querySelector('.username-warning'),
        usermail=document.querySelector('.usermail'),
        usermailWarning=document.querySelector('.usermail-warning'),
        userphone=document.querySelector('.userphone'),
        userphoneWarning=document.querySelector('.userphone-warning'),
        department=document.querySelector('.department'),
        job=document.querySelector('.job'),
        male=document.querySelector('.usersex-nan'),
        female=document.querySelector('.usersex-nv'),
        selfintro=document.querySelector('.txtarea'),
        btn=document.querySelector('.btn'),
        userId=window.location.href.queryURLParams('userId')?window.location.href.queryURLParams('userId'):null;

    //获取数据绑定选项 ajax并行
    async function bindData(){
        
        let departmentinfo=await tool.queryDepartment();
        let jobinfo=await tool.queryJob();

        //数据绑定
        if(departmentinfo.code===0){
            let str=``;
            departmentinfo.data.forEach((item)=>{
                str+=`<option value=${item.id}>${item.name}</option>`;
            })
            userdepartment.innerHTML=str;
        }
        if(jobinfo.code===0){
            let str=``;
            jobinfo.data.forEach((item)=>{
                str+=`<option value=${item.id}>${item.name}</option>`;
            })
            userjob.innerHTML=str;
        }
    }
    //用户名验证
    function checkName(){
        let uname=username.value.trim();
        if(!uname){
            usernameWarning.innerHTML='用户名不能为空';
            return false;
        }
        return true;
    }
    //邮箱验证
    function checkmail(){
        let umail=usermail.value.trim();
        let mail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;
        if(!mail.test(umail)){
            usermail.value='';
            usermailWarning.innerHTML='请输入格式正确的邮箱';
            return false;
        }
        return true;
    }
    //手机号验证
    function checkPhone(){
        let uphone=userphone.value.trim();
        let phone=/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
        if(!phone.test(uphone)){
            uphone.value='';
            userphoneWarning.innerHTML='请输入格式正确的手机号';
            return false;
        }
        return true;
    }
    //提交表单（要区分新增还是修改）
    async function handle(ev){
        ev.preventDefault();
        if(userId){
            if(checkName() && checkPhone() &&checkmail()){
                let result=await axios.post('/user/update',{
                    userId,
                    name:username.value.trim(),
                    sex:male.checked?0:1,
                    email:usermail.value.trim(),
                    phone:userphone.value.trim(),
                    departmentId:department.value,
                    jobId:job.value,
                    desc:selfintro.value.trim()
                });
                // alert(result);
                if(result.code==0){
                    alert('数据修改成功');
                    window.location.href='userlist.html';
                    return;
                }else{
                    alert('用户信息修改失败');
                }
            }
        }
        //二次检验表单
        else{
            if(checkName() && checkPhone() &&checkmail()){
                let result=await axios.post('/user/add',{
                    name:username.value.trim(),
                    sex:male.checked?0:1,
                    email:usermail.value.trim(),
                    phone:userphone.value.trim(),
                    departmentId:department.value,
                    jobId:job.value,
                    desc:selfintro.value.trim()
                })
                if(result.code===0){
                    alert('数据添加成功');
                    window.location.href='userlist.html';
                    return;
                }
                else{
                    alert('网络异常添加失败，请稍后再试');
                }
            }
        }
    }
    //编辑进入是绑定用户信息
    async function editBind(){
        let result=await axios.get('/user/info',{
            params:{
                userId
            }
        });
        if(result.code==0){
            username.value=result.data.name;
            result.data.sex==0?male.checked=true:female.checked=true;
            department.value=result.data.departmentId;
            job.value=result.data.jobId;
            usermail.value=result.data.email;
            userphone.value=result.data.phone;
            selfintro.value=result.data.desc;

        }else{
            alert('编辑用户不存在');
        }
    }
    return{
        init(){
            bindData();
            if(userId) editBind();
            username.addEventListener('blur',checkName);
            usermail.addEventListener('blur',checkmail);
            userphone.addEventListener('blur',checkPhone);
            btn.addEventListener('click',handle); 
        }
    }
})()
useraddModule.init();