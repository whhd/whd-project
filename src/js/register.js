
  
$(function(){
    var callBackUrl  = "http://www.zol.com/";        
    var baseUrl      = "https://login.zol.com";
    
    var zolBaseUrl   = "https://service.zol.com.cn";

    var userAgent    = window.navigator.userAgent.toLowerCase();
    if (navigator.userAgent.indexOf("MSIE") && ("6.0" == $.browser.version)){                
        zolBaseUrl = "http://service.zol.com.cn";                    
    } 
    
    // 验证手机号
    var checkMobile = function (mobile){
        var flag = false;
        if (mobile){
            var regPartton = new RegExp(/1[3-8]+\d{9}/);
            if (regPartton.test(mobile)){
                flag = true;
            }
        }

        return flag;
    }    
    
    var registerTipsMsg = function(obj, flag, msg){
        if (flag){
            obj.html('').removeClass("wrong-tips").addClass("right-tips").show();            
        }else{            
            obj.removeClass("right-tips").addClass("wrong-tips").html(msg).show();
        }        
    }
    
    
    // 选中加红色边框
    $(":input[name != J_register_phone_send]").focus(function(){        
        $(this).css("border-color", "#c00");
    }).blur(function(){          
        $(this).css("border-color", "#ccc");
    })
    
    // 注册切换
    $("#J_register > li").bind('click', function(){
        var rel = $(this).attr('rel');
        if (!$(this).hasClass('current')){
            $(this).addClass("current").siblings().removeClass('current');
        }
        if ('email' == rel){
//            $("#J_register_phone").hide();
//            $("#J_register_email_layer").show();
//            $("#J_register_type").val(2);
        }else{
            $("#J_register_phone").show();
            $("#J_register_email_layer").hide();            
            $("#J_register_type").val(1);
        }        
    });
    
    // 检测手机号
    $("#J_register_phone_number").bind("blur", function(){
        var mobile = $(this).val();
        var obj    = $("#J_register_phone_tips");
        if ('' == mobile){
            registerTipsMsg(obj, false, '请填写手机号码');                        
            return false;
        }
        if (!checkMobile(mobile)){
            registerTipsMsg(obj, false, '请填写有效的11位手机号码');
            return false;            
        }
        return false;
    });
    
    $("#J_register_phone_code").bind('blur', function(){
        var flag = false; 
        var code = $("#J_register_phone_code").val();
        if ('' == code){
            msg = '请填写手机验证码';
        }else{
            
            var re = /^[0-9,]*$/;
            if (re.test(code)){
                var strlen = code.length;
                if (strlen != 6){
                    msg = '验证码不正确';
                }else{
                    flag     = true;
                }
            }else{
                msg = '验证码格式不正确';
            }
        }
        registerTipsMsg($("#J_register_phone_code_tips"), flag, msg);
        return false;        
    });
    
    $("#J_register_pasword_phone").bind('blur', function(){
        var password = $(this).val();
        var msg      = '';
        var flag     = false;        
        if ('' == password){
            msg = '请填写密码';
        }else{
            var strlen = password.length;
            if (strlen < 6 || strlen > 16){
                msg = '6-16位字符，可使用字母、数字或符号的组合';
            }else{
                var re = /^[0-9,]*$/;
                if (re.test(password)){
                    msg = "密码不能全是数字";
                }else{
                    flag     = true;
                }                  
            }            
        }
        registerTipsMsg($("#J_register_pasword_phone_tips"), flag, msg);
        return false;
    });
    
    
    $("#J_register_regPasword_phone").bind('blur', function(){
        var password    = $("#J_register_pasword_phone").val();        
        var regPassword = $(this).val();
        var msg         = '';
        var flag        = false;
        if ('' == regPassword){
            msg = '请填写确认密码';
        }else{
            if (password != regPassword){
                msg = '两次填写的密码不一致';
            }else{
                var strlen = regPassword.length;
                if (strlen < 6 || strlen > 16){
                    msg = '6-16位字符，可使用字母、数字或符号的组合';
                }else{
                    var re = /^[0-9,]*$/;
                    if (re.test(regPassword)){
                        msg = "密码不能全是数字";
                    }else{
                        flag     = true;
                    }                     
                }                                 
            }         
        }        
        registerTipsMsg($("#J_register_regPasword_phone_tips"), flag, msg);
        return false;
    });
    
    // 发送验证码倒计时时间
    var timeout         = null;
    var countDownNumber = 100;
    var userMobileCountDown = function (){                     
        $("#J_register_phone_send").hide();                                          
        countDownNumber--;
        $('#J_register_send_wait').html(countDownNumber + '秒后重新获取').show();
        if (!countDownNumber){
            countDownNumber = 100;
            clearTimeout(timeout);
            $("#J_register_send_wait").hide();
            $("#J_register_phone_send").show();           
        }else{                                                                              
            timeout = setTimeout(userMobileCountDown, 1000);
        }
    }       
    // 获取手机验证码
    $("#J_register_phone_send").bind("click", function(){
        var obj    = $("#J_register_phone_tips");                
        var mobile = $("#J_register_phone_number").val();
        if ('' == mobile){
            registerTipsMsg(obj, false, '请填写手机号码');            
            return false;
        }
        if (!checkMobile(mobile)){
            registerTipsMsg(obj, false, '请填写有效的11位手机号码');            
            return false;            
        }        
        
        var picCode  = $("#J_register_checkcode_phone").val();
        if ('' == picCode){
            $("#J_register_checkcode_tips_phone").html("请填写图片验证码").show();
            return false;            
        }        
        var picToken = $("#J_register_checkcode_token_phone").val();
        
        var url = baseUrl + "/index.php?c=Default&a=AjaxRegisterSendPhone&sendType=phone&callback=?&t="+Math.random();
        $.getJSON(
            url,
            {mobile:mobile, picCode:picCode, picToken:picToken},
            function(data){
                if (data.flag){
                    $("#J_register_phone_tips").hide();                    
                    setTimeout(userMobileCountDown, 500);                     
                }else{
                    captchaPhone();
                }
                registerTipsMsg(obj, data.flag, data.msg);
            }
        );
        return false;        
    });
    
    
    // 手机注册
    function phoneNumberRegister(){
        var mobile      = $("#J_register_phone_number").val();
        var phoneCode   = $("#J_register_phone_code").val();
        var password    = $("#J_register_pasword_phone").val();
        var regPassword = $("#J_register_regPasword_phone").val();
        var regRead     = 0;
        
        var checkcode   = $("#J_register_checkcode_phone").val();
        var token       = $("#J_register_checkcode_token_phone").val();
        
        $("input[name=J_regRead_phone]").each(function(){
           if ($(this).is(":checked")){
               regRead = 1;               
           } 
        });   
        if (!regRead){
            alert("请先阅读用户协议");
            return false;
        }
        $("#J_register_phone_submit").hide();
        $("#J_register_phone_loading").show();         
        var url = baseUrl + "/index.php?c=Default&a=AjaxRegisterPhone&callback=?&t="+Math.random();
        $.getJSON(
            url,
            {mobile:mobile, phoneCode:phoneCode, password:password, regPassword:regPassword, regRead:regRead, checkcode:checkcode, token:token},
            function(data){
                if (data.flag){
                    
                    // 回调 登录zol                                    
                    var url = zolBaseUrl + "/user/api/login_zol_new.php?act=signin&callback=?&t=" + Math.random();
                    $.getJSON(
                            url,
                            {username: data.userName, checkCode: data.checkCode, sid: data.userId, check: data.check},
                            function(dataJson) {
                                if (dataJson.code) {
                                    setTimeout(function() {
                                        $("#J_login-wrong-tips").html(dataJson.msg).show();
                                        userLoginBtn();
                                    }, 1000);
                                } else {
                                    window.location = callBackUrl;
                                }
                            }
                    );  
            
                }else{
                    var errorInfo = data.errorInfo;
                    $(".wrong-tips").hide();
                    for(id in errorInfo){                                                
                        registerTipsMsg($("#"+id), false, errorInfo[id]); 
                        if ('J_register_checkcode_tips_phone' == id){
                            captchaPhone();
                        }                        
                    }
                    setTimeout(function() {
                        $("#J_register_phone_submit").show();
                        $("#J_register_phone_loading").hide(); 
                    }, 500);  
                    captchaPhone();
                }
            }
        );        
    }
    $("#J_register_phone_submit").bind("click", function(){
        phoneNumberRegister();
        return false;
    });
    

    // 检测Email
    var emailArr      = new Array("qq.com", "163.com", "gmail.com", "126.com", "sina.com", "hotmail.com");
    var emailIndex    = 0;
    var topClassIndex = 0;
    var isUP          = 0;
    var isDown        = 0;
    $("#J_register_email").bind({
            blur:function(){              
                var email = $("#J_register_email").val();
                if ('' == email){
                    $("#J_register_email_tips").html("请填写邮箱").show();
                    return false;
                }
                var url = baseUrl + "/index.php?c=Default&a=AjaxCheckRegisterEmail&callback=?&t="+Math.random();
                $.getJSON(
                    url,
                    {email:email},
                    function(data){
                        var obj = $("#J_register_email_tips");
                        registerTipsMsg(obj, data.flag, data.msg);
                    }
                );

                return false;                
            },
            keyup:function(e){
                var code = e.keyCode;
                if ((38 === code) || (40 === code) || (13 === code)){
                    return false;
                }
                var email = $(this).val();
                if (email){
                    var indexNumber = email.indexOf("@");
                    if (indexNumber){
                        var emailList = '';

                        var number      = emailArr.length;
                        var emailtTitle = email.substr(0, indexNumber);
                        var emailBody = email.substr(indexNumber + 1);
                        for (i = 0; i < number; i++) {
                            if (-1 !== emailArr[i].indexOf(emailBody)) {
                                if (email != (emailtTitle + '@' + emailArr[i])) {
                                    emailList += '<li>' + emailtTitle + '@' + emailArr[i] + '</li>';
                                }
                            }
                        }
                        
                        if (emailList){
                            $("#J_register_accountList").html(emailList).show();
                            
                            $("#J_register_accountList > li").bind({
                                hover:function(){
                                    $("#J_register_email").val($(this).html());
                                },
                                click:function(){                                    
                                    $("#J_register_accountList").hide();                                      
                                }
                            });                           
                        }else{
                            $("#J_register_accountList").html('').hide();
                        }
                      
                    }                                        
                }
            },
            keydown:function(e){
                var code          = e.keyCode;
                
                var emailArrLen   = emailArr.length;
                
                if (13 === code){
                    $("#J_register_accountList").hide(); 
                    $(this).css("border-color", "#ccc");
                    return false;
                }

                if (38 === code){// 向上                         
                    if (isDown){
                        if (emailIndex){
                            emailIndex--;                                                        
                        }else{
                            if (!emailIndex && !topClassIndex){
                                emailIndex = emailArrLen - 1;                                
                            }
                        }
                        topClassIndex = emailIndex;  
                    }
                    isDown = 0;
                    isUP   = 1;                    
                    
                    if (!emailIndex && !topClassIndex){
                        topClassIndex = emailArrLen - 1;
                    }else if (!emailIndex && (topClassIndex == emailArrLen - 1)){
                        topClassIndex--;
                        emailIndex = topClassIndex;                        
                    }else{
                        emailIndex--;
                        topClassIndex = emailIndex;
                    }                    
                    $("#J_register_accountList > li:eq(" + topClassIndex + ")").addClass("tippopHover").siblings().removeClass("tippopHover");
                    var chooseEmail  = $("#J_register_accountList > li:eq(" + topClassIndex + ")").html();
                    $("#J_register_email").val(chooseEmail);
                    
                }
                
                if (40 === code){// 向下     
                    if (isUP){
                        emailIndex++;
                        topClassIndex = emailIndex;
                    }                    
                    isUP   = 0;
                    isDown = 1;
                    
                    $("#J_register_accountList > li:eq(" + topClassIndex + ")").addClass("tippopHover").siblings().removeClass("tippopHover");
                    emailIndex++;
                    topClassIndex = emailIndex;
                    if (emailIndex == emailArrLen){
                        emailIndex    = 0;
                        topClassIndex = 0;
                    }       
                    var chooseEmail  = $("#J_register_accountList > li:eq(" + topClassIndex + ")").html();
                    $("#J_register_email").val(chooseEmail);                    
                    
                }   
            }
        });
    
    $("#J_register_pasword").bind('blur', function(){
        var password = $(this).val();
        var msg      = '';
        var flag     = false;        
        if ('' == password){
            msg = '请填写密码';
        }else{
            var strlen = password.length;
            if (strlen < 6 || strlen > 16){
                msg = '6-16位字符，可使用字母、数字或符号的组合';
            }else{
                var re = /^[0-9,]*$/;
                if (re.test(password)){
                    msg = "密码不能全是数字";
                }else{
                    flag     = true;
                }                                
            }            
        }
        registerTipsMsg($("#J_register_pasword_tips"), flag, msg);
        return false;
    });
    
    
    $("#J_register_reg_pasword").bind('blur', function(){
        var password    = $("#J_register_pasword").val();
        var regPassword = $(this).val();
        var msg         = '';
        var flag        = false;
        if ('' == regPassword){
            msg = '请填写确认密码';
        }else{                        
            if (password != regPassword){
                msg = '两次填写的密码不一致';
            }else{
                var strlen = regPassword.length;
                if (strlen < 6 || strlen > 16){
                    msg = '6-16位字符，可使用字母、数字或符号的组合';
                }else{
                    var re = /^[0-9,]*$/;
                    if (re.test(regPassword)){
                        msg = "密码不能全是数字";
                    }else{
                        flag     = true;
                    }                     
                }                                    
            }         
        }
        registerTipsMsg($("#J_register_reg_pasword_tips"), flag, msg);
        return false;
    });
    
    $("#J_register_checkcode_phone").bind('blur', function(){
       var msg       = '';
       var flag      = false;        
       var checkcode = $(this).val();
       if ('' == checkcode){
           msg = '请填写验证码';           
       }else{
           flag = true;
       }
       registerTipsMsg($("#J_register_checkcode_tips_phone"), flag, msg);
       return false;       
    });    
    
    $("#J_register_checkcode").bind('blur', function(){
       var msg       = '';
       var flag      = false;        
       var checkcode = $(this).val();
       if ('' == checkcode){
           msg = '请填写验证码';           
       }else{
           flag = true;
       }
       registerTipsMsg($("#J_register_checkcode_tips"), flag, msg);
       return false;       
    });
    
    
    // email注册
    function emailRegister(){
        var email       = $("#J_register_email").val();        
        var password    = $("#J_register_pasword").val();
        var regPassword = $("#J_register_reg_pasword").val();
        var checkcode   = $("#J_register_checkcode").val();
        var token       = $("#J_register_checkcode_token").val();    
        var regRead     = 0;
        $("input[name=J_regRead]").each(function(){
           if ($(this).is(":checked")){
               regRead = 1;               
           } 
        });
        if (!regRead){
            alert("请先确认阅读协议");
            return false;
        }
        $("#J_register_email_loading").show();
        $("#J_register_email_submit").hide();
        var url = baseUrl + "/index.php?c=Default&a=AjaxRegisterEmail&callback=?&t="+Math.random();
        $.getJSON(
            url,
            {email:email, password:password, regPassword:regPassword, checkcode:checkcode, token:token, regRead:regRead},
            function(data){
                if (data.flag){
                    // 回调 登录zol                    
                    var url = zolBaseUrl + "/user/api/login_zol_new.php?act=signin&callback=?&t=" + Math.random();
                    $.getJSON(
                            url,
                            {username: data.userName, checkCode: data.checkCode, sid: data.userId, check: data.check},
                            function(dataJson) {
                                if (dataJson.code) {
                                    setTimeout(function() {
                                        alert("系统繁忙，请刷新再试");
                                    }, 1000);
                                } else {
                                    window.location = callBackUrl;
                                }
                            }
                    );                        
                }else{
                    var errorInfo = data.errorInfo;
                    $(".wrong-tips").hide();
                    for(id in errorInfo){       
                        registerTipsMsg($("#"+id), false, errorInfo[id]);                        
                        if ('J_register_checkcode_tips' == id){
                            captcha();
                        }
                    }    
                    setTimeout(function() {
                        $("#J_register_email_loading").hide();
                        $("#J_register_email_submit").show(); 
                    }, 500);
                   
                }
            }
        );        
        return false;
    }
    $("#J_register_email_submit").bind("click", function(){
        emailRegister();    
    });    
    
    // 回车提交注册表单
    $('#J_RegisterForm').keypress(function(e) {        
        if (e.keyCode == 13) {
            var registerType = $("#J_register_type").val();
                registerType = parseInt(registerType);                
            if (1 == registerType){
                phoneNumberRegister();                
            }   
            if (2 == registerType){
                emailRegister(); 
            }

        }
    });    
    
    // 切换验证码
    var captcha = function (){
        var curtime = new Date().getTime();       
        var numCnt  = 5;
        var url     = zolBaseUrl + "/captcha.php?token="+curtime+'&numCnt='+numCnt + '&width=98&height=38';
        $("#J_Captcha-Img").attr("src", url);
        $("#J_register_checkcode_token").val(curtime);    
        return false;
    }   
    var captchaPhone = function (){
        var curtime = new Date().getTime();       
        var numCnt  = 5;
        var url     = zolBaseUrl + "/captcha.php?token="+curtime+'&numCnt='+numCnt + '&width=98&height=38';
        $("#J_Captcha-Img_phone").attr("src", url);
        $("#J_register_checkcode_token_phone").val(curtime);    
        return false;
    }     
    $("#J_Captcha-Img, #J_Captcha-Img_Change").bind('click', captcha);
    $("#J_Captcha-Img_phone, #J_Captcha-Img_Change_phone").bind('click', captchaPhone);
    captcha();
    captchaPhone();
    
})
