var mainUrl = "http://comp426.cs.unc.edu:3001/";
$(document).ready(function () {
   
//go to the register interface
    $(document).on("click","#register",function(){
        let body = $("body");
        body.empty();
        body.append("<h1>New User</h1>");
        body.append("<div id=\"register_div\"></div>");
        $("#register_div").append("User:<input type=\"text\" id=\"register_user\"><br>Password: <input type=\"password\" id=\"register_pass\"><br>");
        $("#register_div").append("<button id=\"register_btn\">Sign Up</button>");
        body.append("<span id=\"back\">Click here to return back</span>");

//go back to login interface
    });
    $(document).on("click","#back",function(){
        let body = $("body");
        body.empty();
        body.append("<h1>What the fuck</h1>");
        body.append("<div id=\"login_div\"></div>");
        $("#login_div").append("User:<input type=\"text\" id=\"login_user\"><br>Password: <input type=\"password\" id=\"login_pass\"><br>");
        $("#login_div").append(" <button id=\"login_btn\">Login</button>");
        body.append("<span id=\"register\">Click here to create a new account</span>");
    });

//create a new account
    $(document).on("click","#register_btn",function(){
        let user = $('#register_user').val();
        let pass = $('#register_pass').val();
        $.ajax(mainUrl + 'users?username='+user+'&password='+pass, {
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
       
            success: function () {
                    alert('registered successfully')
            },
            error: function () {
                alert('This username has been already taken');
            }
        });
    });

//login
    $(document).on("click","#login_btn",function(){
        let user = $('#login_user').val();
        let pass = $('#login_pass').val();
        $.ajax(mainUrl+'sessions',{
            type:'POST',
            xhrFields: {
                withCredentials: true
            },
            data: {
                username: user,
                password: pass
            },
            success:function(){
                build_main_interface();
            },
            error:function(){
                alert('username/password is incorrect');
            }
        });
    });

//build_main_interface
    build_main_interface=function(){
        let body=$("body");
        body.empty();
        body.append("<h1>Book your next fantastic flight</h1>")
        search_div=("<div id=\"search_div\"></div>");
        body.append(search_div);
        
        
    }
});