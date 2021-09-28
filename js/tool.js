const tool=(function(){
    const isPlainObject = function isPlainObject(obj) {
        let proto, Ctor;
        if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
        proto = Object.getPrototypeOf(obj);
        if (!proto) return true;
        Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
        return typeof Ctor === "function" && Ctor === Object;
    };
    const queryDepartment=async function queryDepartment(){
        //首先看本地是否有缓存信息，如果存在，再验证是否过期
        let departmentinfo,
            isStorage=false;
        let department=localStorage.getItem('department');
        if(department){
            department=JSON.parse(department);
            if(new Date().getTime()-department.time<=86400000){
                departmentinfo=department.data;
                isStorage=true;
            }
        }
        //如果本地没有或过期就发起http请求，否则使用本地
        if(!isStorage)
            departmentinfo=await axios.get('/department/list');
        
        // 对于不经常改变的数据，获取信息后先把信息缓存在本地（时效1天）
        localStorage.setItem('department',JSON.stringify({
            time:new Date().getTime(),
            data:departmentinfo
        }));
        return departmentinfo;
    }
    const queryJob=async function queryJob(){
        //首先看本地是否有缓存信息，如果存在，再验证是否过期
        let jobinfo,
            isStorage=false;
        job=localStorage.getItem('job');
        if(job){
            job=JSON.parse(job);
            if(new Date().getTime()-job.time<=86400000){
                jobinfo=job.data;
                isStorage=true;
            }
        }
        //如果本地没有或过期就发起http请求，否则使用本地
        if(!isStorage)
            jobinfo=await axios.get('/job/list');
        
        // 对于不经常改变的数据，获取信息后先把信息缓存在本地（时效1天）
        localStorage.setItem('job',JSON.stringify({
            time:new Date().getTime(),
            data:jobinfo
        }));
        return jobinfo;
    }
    String.prototype.queryURLParams = function queryURLParams(attr) {
        attr = attr + '';
        let obj = {};
        //匹配除了？=#&字符
        this.replace(/#([^?=&#]+)/g, (_, $1) => obj['_HASH'] = $1);
        this.replace(/([^?=&#]+)=([^?=&#]+)/g, (_, $1, $2) => obj[$1] = $2);
        if (attr !== "undefined") return obj[attr];
        return obj;
    }
    //点击最后一列操作按键所做的处理(事件委托)
    const operation= function operation(){
        document.body.addEventListener('click',async (ev)=>{
            let el=ev.target, 
                text=el.innerHTML,
                tagname=el.tagName,
                userid=el.parentNode.parentNode.getAttribute('userid');
            if(tagname=='A'){
                if(text=='编辑'){
                    window.location.href=`useradd.html?userId=${userid}`;
                    return;
                }
                if(text=='删除'){
                    let flag=confirm('确定删除本条数据吗？');
                    if(!flag) return;
                    let result=await axios.get('/user/delete',{
                        params:{
                            userId:userid
                        }
                    });
                    if(result.code==0){
                        let del=el.parentNode.parentNode.parentNode,
                            parent=del.parentNode;
                        parent.removeChild(del);
                        alert('删除成功！');
                    }
                    else{
                        alert('删除失败，请稍后重试！');
                    }
                }
                if(text=='重置密码'){
                    let flag=confirm('确定重置密码吗？');
                    if(!flag) return;
                    let result=await axios.post('/user/resetpassword',{
                        userId:userid
                    });
                    console.log(result);
                    if(result.code==0){
                        alert('重置成功！');
                    }
                    else{
                        alert('重置失败，请稍后重试！');
                    }
                }
            }
        })
    }
    // 全选处理(在动态插入表格项后执行)
    const checkAll= function checkAll(checkall,checkgroup,container){
        checkall.addEventListener('click',()=>{
            let checked=checkall.checked;
            checkgroup.forEach((item)=>{
                item.checked=checked;
            })
        });
        container.addEventListener('click',(ev)=>{
            let target=ev.target,
                tagname=target.tagName,
                flag=true;
            if(tagname=='INPUT'){
                //只有全部的都选择了，checkall才选中
                checkgroup.forEach((item)=>{
                    if(!item.checked) flag=false;
                });
                checkall.checked=flag;
            }
        })
    }
    // 批量删除
    const groupDel=function groupDel(deletebtn,checkgroup,bindHtml){
        deletebtn.addEventListener('click',async ()=>{
            let arr=[];
            checkgroup.forEach((item)=>{
                if(item.checked){
                    arr.push(item.getAttribute('userid'));
                }
            });
            if(arr.length==0) alert('请先勾选需要删除的项！');
            let flag=confirm('确定要删除选择项吗？');
            if(!flag) return;
            //批量删除采用逐一删除的串行实现
            let result=[];
            new Promise(async (resolve)=>{
                for(let i=0;i<arr.length;i++){
                    let res=await axios.get('/user/delete',{
                        params:{
                            userId:arr[i]
                        }
                    });
                    if(res.code==0){
                        result[i]='成功';
                    }else{
                        result[i]='失败';
                    }
                    if(i==arr.length-1) resolve();
                }
            }).then(()=>{
                result.forEach((item)=>{
                    console.log(item);
                    if(item=='失败'){
                        alert('批量删除失败');
                    }
                })
                alert('批量删除成功');
                bindHtml(); 
                alert('数据刷新完毕')
            })
        })
    }    
    return{
        isPlainObject,
        queryDepartment,
        queryJob,
        operation,
        checkAll,
        groupDel
    }
})()
if(typeof window!=='undefined') window.tool=tool;
if(typeof module==='object'&&typeof module.export==='object') module.export=tool;