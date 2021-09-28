axios.defaults.baseURL='http://127.0.0.1:9999';
axios.defaults.timeout=10000;
axios.defaults.withCredentials=true;

//传递参数转化为urlencode格式
axios.defaults.transformRequest = data => {
    if (tool.isPlainObject(data)){
        return Qs.stringify(data);
    }
    return data;
};
//携带token
axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
})
//响应值
axios.interceptors.response.use(response => {
    return response.data;
},error=>{
    return Promise.reject(error);
});
