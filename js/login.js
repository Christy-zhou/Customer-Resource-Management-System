let loginModule=(function(){
    let account=document.querySelector('#account'),
        password=document.querySelector('#password'),
        btn=document.querySelector('#btn');
    // 检查用户名合法性
    function checkaccount(){ 
        let phone=/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
            mail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/,
            value=account.value.trim();
        if(!phone.test(value) && !mail.test(value)){
            account.value='';
            account.placeholder='请输入格式正确的用户名';
        }
    }
    async function handle(){
        let aval=account.value.trim(),
            pval=password.value.trim();
        // 检查用户名密码不能为空
        if(aval===''||pval===''){
            alert('用户名或密码不能为空！');
            return;
        }
        pval=MD5(pval);
        // 发送post请求
        let result=await axios.post('/user/login',{
            account:aval,
            password:pval
        })
        if(parseInt(result.code)===0){
            window.location.href='index.html';
            return;
        }
        else{
            alert('用户名或密码错误，请重新登录');
            account.value='';
            password.value='';
            return;
        }
       /*  axios.post('/user/login',{
            account:aval,
            password:pval
        }).then((result)=>{
            if(parseInt(result.code)===0){
                window.location.href='index.html';
                return;
            }
            else{
                alert('用户名或密码错误，请重新登录');
                account.value='';
                password.value='';
                return;
            }
        }).catch((error)=>{
            alert(error);
        }) */
    }
    return{
        init(){
            account.addEventListener('blur',checkaccount);
            btn.addEventListener('click',handle);
        }
    }

})()
loginModule.init()