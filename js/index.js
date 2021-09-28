let indexModule=(function indexModule(){
    let hello=document.querySelector('.hello'),
        namespan=hello.querySelector('span'),
        exitbtn=hello.querySelector('a'),
        bar=document.querySelector('.bar'),
        nav=document.querySelector('.nav'),
        iframe=document.querySelector('#iframe'),
        controls=Array.from(nav.querySelectorAll('a'));
    //验证是否登录
    async function isLogin(){
        let result=await axios.get('/user/login');
        if(result.code===1){
            alert('您还未登录，请先登录！');
            window.location.href='login.html';
        }
    }
    //获取权限信息和个人信息
    async function permitInfo(){
        let [user,userpower]=await axios.all([axios.get('/user/info'),axios.get('/user/power')]);
        let name=user.data.name;
        power=userpower.power;
        //个人信息绑定你好后的值
        namespan.innerHTML=name||'';
        sub.emit('power',power);
    }

    // 基于发布订阅管控事件
    //权限1—nav的条件渲染，根据权限信息控制nav的内容显示
    function showNav(power){
        let str=``;
        if(power.includes('userhandle')){
            str+=`<div class="user" group="1">
            <div class="title">
                <i class="icon">&#xe623;</i>
                <span>员工管理</span>
            </div>
            <a href="./page/userlist.html" target="iframebox">员工列表</a>
            <a href="./page/useradd.html" target="iframebox">新增列表</a>
        </div>`;
        }
        if(power.includes('departhandle')){
            str+=`<div class="department" group="1">
            <div class="title">
                <i class="icon">&#xe62a;</i>
                <span>部门管理</span>
            </div>
            <a href="javascript:;">部门列表</a>
            <a href="javascript:;">新增部门</a>
        </div>`;
        }
        if(power.includes('jobhandle')){
            str+=`<div class="job" group="1">
            <div class="title">
                <i class="icon">&#xf0070;</i>
                <span>职务管理</span>
            </div>
            <a href="javascript:;">职务列表</a> 
            <a href="javascript:;">新增职务</a>    
        </div>`;
        }
        if(power.includes('customer')){
            str+=`<div class="customer" group="0">
            <div class="title">
                <i class="icon">&#xe669;</i>
                <span>客户管理</span>
            </div>
            <a href="./page/customerlist.html?lx=my" target='iframebox'>我的客户</a>
            ${power.includes('customerall')?`<a href="./page/customerlist.html?lx=all" target='iframebox'>全部客户</a>`:``}
            <a href="javascript:;">新增客户</a>
        </div>`;
        }
        bar.innerHTML=str;
    }
    sub.on('power',showNav);
    //权限2-切换的点击生效
    function groupShow(index){
        // 控制显示隐藏
        let group1=(Array.from(bar.children)).filter((item)=>{
            return item.getAttribute('group')==index 
        }),
        group2=(Array.from(bar.children)).filter((item)=>{
            return item.getAttribute('group')!=index 
        });
        group1.forEach((i)=>{
            i.style.display='block';
        });
        group2.forEach((i)=>{
            i.style.display='none';
        })
    }
    function change(power,ev){
        // 权限校验
        let text=ev.target.innerHTML;
        if(text==='客户关系' && !/^customermy|customerall$/.test(power)){
            alert('您没有访问当前模块的权限，请先联系管理员');
            return;
        }
        if(text==='组织结构' && !/^userhandle|departhandle|jobhandle$/.test(power)){
            alert('您没有访问当前模块的权限，请先联系管理员');
            return;
        }
        //控制切换
        ev.target.className='active';
        let index=controls.indexOf(ev.target);
        //控制显示对应分组
        groupShow(index);
        let ele=controls[controls.length-(++index)];
        ele.removeAttribute('class');
    }
    function slide(power){
        groupShow(0);
        for(var i=0;i<controls.length;i++){
            controls[i].addEventListener('click',change.bind(this,power));
        }
    }
    sub.on('power',slide);

    // 退出登录
    async function exitLogin(){
        let result=await axios.get('/user/signout');
        console.log(result);
        if(result.code===0){
            //清空缓存数据
            localStorage.clear();
            window.location.href='login.html';
        }
        else{
            alert('网络出现错误，请稍后再试');
        }
    }

    return{
        init(){
            isLogin();
            permitInfo();
            exitbtn.addEventListener('click',exitLogin);
        }
    }

})()
indexModule.init();