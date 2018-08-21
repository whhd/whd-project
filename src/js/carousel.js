    document.addEventListener('DOMContentLoaded',()=>{
        
             var Carousel = function(options){
                // 属性
                // 默认值
                let defaults = {
                    ele:'',//必填参数
                    imgs:[],//必传参数
                    width:1280,
                    height:400,
                    index:0,
                    page:true,//是否显示分页
                    button:true,//是否显示左右按钮
                    type:'horizontal',//动画类型：vertical(垂直)，horizontal(水平),fade(淡入淡出)
                    seamless:true,//是否无缝滚动,
                    duration:2000,//轮播间隔时间
                }
                
                // 扩展默认参数
                this.opt = Object.assign({},defaults,options);
                this.len = this.opt.imgs.length;

                // 初始化并传递参数
                this.init(this.opt);
             }


            // 方法：
            Carousel.prototype.init = function(opt){
           
                
                this.ele = document.querySelector(opt.ele);

                // 指定专有类型
                // this.ele.classList.add('wd-carousel');

                // 设置样式（宽高）
                this.ele.style.width = opt.width + 'px';
                this.ele.style.height = opt.height + 'px';

                // 生成图片(ul,li,img)
                let ul = document.createElement('ul');

                // 给ul添加类型：设置轮播类型
                ul.className = opt.type;//horizontal,vertical,fade

                // 水平轮播需要给ul添加宽度
                if(opt.type === 'horizontal'){
                    ul.style.width = opt.width*this.len + 'px';
                }else if(opt.type === 'fade'){
                    ul.style.width = opt.width + 'px';
                    ul.style.height = opt.height + 'px';
                }

                ul.innerHTML = opt.imgs.map(url=>{
                    return '<li><img src="'+url+'"/></li>';
                }).join('');

                // 写入页面
                this.ele.appendChild(ul);


                // 分页
                if(opt.page){
                    this.page = document.createElement('div');
                    this.page.className = 'page';
                    for(var i=0;i<this.len;i++){
                        var span = document.createElement('span');
                        span.innerText = i+1;

                        // 高亮
                        if(i===opt.index){
                            span.className = 'active';
                        }
                        this.page.appendChild(span);
                    }

                    this.ele.appendChild(this.page);


                }

                // 左右按钮
                if(opt.button){
                    let btnPrev = document.createElement('span');
                    btnPrev.className = 'btn-prev';
                    btnPrev.innerHTML = '&lt;';

                    let btnNext = document.createElement('span');
                    btnNext.className = 'btn-next';
                    btnNext.innerHTML = '&gt;';

                    this.ele.appendChild(btnPrev);
                    this.ele.appendChild(btnNext);
                }

                // 传递参数
                this.ul = ul;



                // 初始化
                // 页面进入自动轮播
                this.timer = setInterval(this.autoPlay.bind(this),opt.duration);
                this.play();
                

                // 鼠标移入移出
                this.ele.onmouseover = ()=>{
                    this.stop();
                }
                this.ele.onmouseout = ()=>{
                    this.timer = setInterval(this.autoPlay.bind(this),opt.duration);
                }

                // 点击分页切换
                this.ele.onclick = e=>{
                    if(e.target.parentNode.className === 'page'){
                        opt.index = e.target.innerText-1;

                        this.play();
                    }else if(e.target.className === 'btn-prev'){
                        opt.index--;
                        this.play();
                    }else if(e.target.className === 'btn-next'){
                        opt.index++;
                        this.play();
                    }
                }
                
                
            }

            Carousel.prototype.autoPlay = function(){
                        this.opt.index++;
                        this.play();
            }

            // 播放
            Carousel.prototype.play = function(){
                let opt = this.opt;

                // 到达最后一张后重置到第一张
                if(opt.index>=this.len){
                    opt.index = 0;
                }else if(opt.index<0){
                    opt.index = this.len-1;
                }

                

                var obj = {}

                // 水平
                if(opt.type === 'horizontal'){
                    obj.left = -opt.index*opt.width;
                    animate(this.ul,obj);
                }else if(opt.type === 'vertical'){
                    obj.top = -opt.index*opt.height;
                    animate(this.ul,obj);
                }else if(opt.type === 'fade'){
                    for(var i=0;i<this.len;i++){
                        animate(this.ul.children[i],{opacity:0});
                    }
                    animate(this.ul.children[opt.index],{opacity:1});

                }

                

                // 页码高亮
                if(this.page){
                    for(var i=0;i<this.len;i++){
                        this.page.children[i].className = '';
                    }
                    this.page.children[opt.index].className = 'active';
                }
            }

            // 停止
            Carousel.prototype.stop = function(){
                clearInterval(this.timer);
            }

             new Carousel({
                ele:'.carousel',
                imgs:["img/lun1.jpg","img/lun2.png","img/lun3.jpg"]
             });

            });