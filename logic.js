var mainUrl = "http://comp426.cs.unc.edu:3001/";
$(document).ready(function () {

    //go to the register interface
    $(document).on("click", "#register", function () {
        let body = $("#body");
        body.empty();
        body.append("<h1>New User</h1>");
        body.append("<div id=\"register_div\"></div>");
        $("#register_div").append("User:<input type=\"text\" id=\"register_user\"><br>Password: <input type=\"password\" id=\"register_pass\"><br>");
        $("#register_div").append("<button id=\"register_btn\">Sign Up</button>");
        body.append("<span id=\"back\">Click here to return back</span>");
    });
    //go back to login interface

    $(document).on("click", "#back", function () {
        build_login_interface();
    });

    //create a new account
    $(document).on("click", "#register_btn", function () {
        let user = $('#register_user').val();
        let pass = $('#register_pass').val();
        $.ajax(mainUrl + 'users', {
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: {
                user: {
                    username: user,
                    password: pass
                }
            },
          
            async:false,
            success: function () {
                alert('registered successfully');
                build_login_interface();
            },
            error: function () {
                alert('This username has been already taken');
            }
        });
    });

    //login
    $(document).on("click", "#login_btn", function () {
        let user = $('#login_user').val();
        let pass = $('#login_pass').val();
        $.ajax(mainUrl + 'sessions', {
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: {
                user: {
                    username: user,
                    password: pass
                }
            },
            async:false,
            success: function () {
                build_main_interface();
            },
            error: function () {
                alert('username/password is incorrect');
            }
        });
    });

    //log off
    $(document).on("click", "#logoutBtn", function () {
        FB.getLoginStatus(function(response) {
            console.log(response);
            if(response.status=="connected"){
                logout();
            }
        });
        $.ajax(mainUrl + 'sessions', {
            type: "DELETE",
            xhrFields: {
                withCredentials: true
            },
            async:false,
            success: function () {
                build_login_interface();
                $("#loginBtn").css("display","block");
            },
            error: function () {
                alert("action failed");
            }
        });
    });

    //change_password_interface
    $(document).on("click", "#change_pass", function () {
        let body = $("#body");
        body.empty();
        body.append("<h1>Change Your Password</h1>");
        body.append("<div id=\"change_div\"></div>");
        $("#change_div").append("Username:<input type=\"text\" id=\"change_user\"><br>")
        $("#change_div").append("Old Password: <input type = \"password\" id=\"old_pass\"><br>");
        $("#change_div").append("New Password: <input type = \"password\" id=\"new_pass\"><br>");
        $("#change_div").append("<button id=\"change_btn\">Change Password</button>");
        $("#change_div").append("<button id=\"change_back\">Go Back</button>")
    });

    $(document).on("click","#change_back",function(){
        build_login_interface();
    });


    //change_password
    $(document).on('click', '#change_btn', function () {
        let username = $("#change_user").val();
        console.log(username);
        let old_pass = $("#old_pass").val();
        console.log(old_pass);
        let new_pass = $("#new_pass").val();
        console.log(new_pass);
        $.ajax(mainUrl + 'passwords', {
            type: "PUT",
            xhrFields: {
                withCredentials: true
            },
            data: {
                user: {
                    username: username,
                    old_password: old_pass,
                    new_password: new_pass
                }
            },
            async:false,
            success: function () {
                alert("change successfully");
            },
            error: function () {
                alert("action failed")
            }
        })
    });

    //build_main_interface
    build_main_interface = function () {
        let body = $("#body");
        body.empty();
        body.append("<h1>Book your next fantastic flight</h1>")
        search_div = ("<div id=\"search_div\"></div>");
        body.append(search_div);
        search = $("#search_div");
        // search.append('<input type="text" id="source" value=\"Seattle\" placeholder="From City or Airport"><br>');
        // search.append('<input type="text" id="destination" value=\"New York\" placeholder="To City or Airport"><br>');
        //autocomplete
        let sourceInput = $('<input type="text" list = "dlAutoComplete" id="source" placeholder="From City"><br>');
        let destinationInput = $('<input type="text" list = "dlAutoComplete" id="destination" placeholder="To City"><br>');
        search.append('<span style="font-size: 30px; color: #404040;"><i class="fas fa-plane-departure"></i></span>');
        search.append('<span id = "depart_span_search">Departure City: </span>');
        search.append(sourceInput);
        search.append('<span style="font-size: 30px; color: #404040;"><i class="fas fa-plane-arrival"></i></span>');
        search.append('<span id = "arrival_span_search">Arrival City: </span>');
        search.append(destinationInput);

        //city name datalist for autocomplete
        let cityDataList = $('<datalist id = "dlAutoComplete"></datalist>');
        search.append(cityDataList);
        $.ajax(mainUrl + "airports", {
            type: "GET",
            xhrFields: {
                withCredentials: true
            },
            datatype: JSON,
            async:false,
            success: function (response) {
                for (i = 0; i < response.length; i++) {
                    console.log(response[i].city);
                    cityDataList.append('<option value = "'+response[i].city+'"></option>>');
                }
            },
            error: function () {
                alert("get all airports failed")
            }

        });
        search.append('<span style="font-size: 30px; color: #404040;"><i class="fas fa-calendar-alt"></i></span>');
        search.append('<span id = "date_span_search">Date: </span>');
        search.append('<input type="text" value=\"2019-01-22\" id="d_date"><br>');
        search.append('<button id="search_btn">Search</button>');

        body.append('<button id = "tickets_btn">My Ticket</button>');

        body.append('<div id="result_div"></div>');
        body.append('<table id="result"></table>');

        body.append('<button id="logoutBtn" onclick="logout();"><span>Log Out</span></button>')
        $("#loginBtn").css("display","none");
    }
   

    //build_login_interface
    build_login_interface = function () {
        let body = $("#body");
        body.empty();
        body.append('<span style="font-size: 80px; color: #404040;"><i class="fas fa-globe-americas"></i></span><span class = "flight_regis_header">Flight Registration</span>');
        body.append("<div id=\"login_div\"></div>");
        $("#login_div").append('<span style="font-size: 30px; color: #404040;"><i class="fas fa-user"></i></span>');
        $("#login_div").append('<span class = "login_user_span">User: </span><input type="text" value="issacqi" id="login_user"><br></br>');
        $("#login_div").append('<span style="font-size: 30px; color: #404040;"><i class="fas fa-key"></i></span>');
        $("#login_div").append('<span class = "login_password_span">Password: </span><input type="password" value="111111" id="login_pass"><br>');
        //$("#login_div").append("User:<input type=\"text\" id=\"login_user\"><br>Password: <input type=\"password\" id=\"login_pass\"><br>");
        $("#login_div").append(" <button id=\"login_btn\"><span>Login</span></button>");

        

        loginbutton='<div id="loginBtn display="block"><fb:login-button widthscope="public_profile,email" display="block" onlogin="checkLoginState();"></fb:login-button></div>';
        body.append(loginbutton);
        body.append("<span id=\"register\">Click here to create a new account</span><br>");
        body.append("<span id=\"change_pass\">Click here to change your password</span>");
    }

    //search
    $(document).on("click", "#search_btn", function () {
        $("#result").empty();
        let source = $("#source").val();
        let source_id = 0;
        let destination = $("#destination").val();
        let destination_id = 0;
        let date = $("#d_date").val();
        $.ajax(mainUrl + "airports", {
            data: "GET",
            xhrFields: {
                withCredentials: true
            },
            datatype: JSON,
            async:false,
            success: function (response) {
                for (m = 0; m < response.length; m++) {
                    if (response[m].city == source) {
                        source_id = response[m].id;
                    }
                }
                $.ajax(mainUrl + "airports", {
                    data: "GET",
                    xhrFields: {
                        withCredentials: true
                    },
                    datatype: JSON,
                    async:false,
                    success: function (response) {
                        for (k = 0; k < response.length; k++) {
                            if (response[k].city == destination) {
                                destination_id = response[k].id;
                            }
                        }
                        $.ajax(mainUrl + "flights", {
                            data: "GET",
                            xhrFields: {
                                withCredentials: true
                            },
                            datatype: JSON,
                            async:false,
                            success: function (response) {
                                for (i = 0; i < response.length; i++) {
                                    if (response[i].departure_id == source_id && response[i].arrival_id == destination_id) {
                                       
                                        flight_id = response[i].id;
                                        flight_number=response[i].number;
                                        airline_id=response[i].airline_id;
                                       
                                        departure_time=response[i].departs_at.substring(11,19);
                                        arrival_time=response[i].arrives_at.substring(11,19);
                                      
                                        $.ajax(mainUrl + "instances", {
                                            data: "GET",
                                            xhrFields: {
                                                withCredentials: true
                                            },
                                            datatype: JSON,
                                            async:false,
                                            success: function (response) {
                                            
                                                for (j = 0; j < response.length; j++) {
                                           
                                                    if (response[j].date == date && response[j].flight_id == flight_id) {
                                               
                                                        row=$("<tr></tr>");
                                                       $("#result").append(row);
                                                       row.append("<td>"+departure_time+"<td>");
                                                       row.append("<td>"+arrival_time+"</td>");
                                                       airline_name="";
                                                       $.ajax(mainUrl + "airlines", {
                                                        data: "GET",
                                                        xhrFields: {
                                                            withCredentials: true
                                                        },
                                                        async:false,
                                                        datatype: JSON,
                                                        success: function (response) {
                                                            for(z=0;z<response.length;z++){
                                                                if(response[z].id==airline_id){
                                                                    airline_name=response[z].name;
                                                                }
                                                            }
                                                        }
                                                    });
                                                        row.append("<td>"+airline_name+"</td>");
                                                        row.append("<td>"+flight_number+"</td>");
                                                        row.append("<td>"+source+" arrow "+destination+"</td>");
                                                        row.append('<button id = "select_btn" data-airline-name = "' + airline_name + '" data-flight-number = "' + flight_number + '" data-source = "' + source + '" data-destination = "' + destination + '" data-departure-time = "' + departure_time + '" data-arrival-time = "' + arrival_time + '" data-instance-id ="' +response[j].id+ '" data-flight-id ="' +flight_id+ '" data-date="' + date +'">Select</button>');
                                                    }
                                                    
                                                    //console.log("hitagain");
                                                }
                                            }

                                        });
                                    }
                                }
                            },
                            error: function () {
                                alert("error");
                            }
                        });
                    }
                });


            }
        });







    });

    //confirmaion page
    $(document).on("click", "#select_btn", function () {
        let sourceid=$(this).attr("data-source");
        let destinationid=$(this).attr("data-destination");
        let instanceid =$(this).attr("data-instance-id");
        let flightid=$(this).attr("data-flight-id");
        let dateid = $(this).attr("data-date");
        let departuretimeid = $(this).attr("data-departure-time");
        let arrivaltimeid = $(this).attr("data-arrival-time");
        let airlinenameid = $(this).attr("data-airline-name");
        let flightnumberid = $(this).attr("data-flight-number");
        $("#body").empty();
        $("#body").append("<h1>Please enter your information</h1>");
        var info_div = $("<div></div>");
        $("#body").append(info_div);
        info_div.append('Lastname: <input type ="text" id="lastname"></input><br>');
        info_div.append('Firstname: <input type ="text" id="firstname"></input><br>');
        info_div.append('Age: <input type ="text" id="age"></input><br>');
        info_div.append('Gender: <input type ="text" id="gender"></input><br>');
        info_div.append('Email: <input type ="text" id="email"></input><br>');
       
        info_div.append('<button data-date = "' + dateid + '" data-source = "' + sourceid + '" data-destination = "' + destinationid + '" data-airline-name = "' + airlinenameid + '" data-flight-number = "' + flightnumberid + '" data-departure-time = "' + departuretimeid + '" data-arrival-time = "' + arrivaltimeid + '" data-instance-id = "'+instanceid+ '" data-flight-id ="' +flightid+ '" id = "confirm_btn">Confirm</button>');
        info_div.append('<button id="info_back">GO BACK</button>');
    });

    //ticket interface
    $(document).on("click", "#confirm_btn", function() {
        let sourceid=$(this).attr("data-source");
        let destinationid=$(this).attr("data-destination");
        let airlinenameid = $(this).attr("data-airline-name");
        let flightnumberid = $(this).attr("data-flight-number");
        let instanceid =$(this).attr("data-instance-id");
        let flightid=$(this).attr("data-flight-id");
        let dateid = $(this).attr("data-date");
        let departuretimeid = $(this).attr("data-departure-time");
        let arrivaltimeid = $(this).attr("data-arrival-time");
        let emailid=$("#email").val();
        let seatid=0;
        var conf_code = Math.floor(Math.random() * 10000).pad(4);
            $.ajax(mainUrl + 'itineraries', {
                type: 'POST',
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    itinerary: {
                        confirmation_code: conf_code,
                        email: emailid
                    }
                },
                async:false,
                success: function () {
                    console.log("success");
                },
                error: function () {
                    alert('itineraries post fail');
                }
            });

            var selected_plane_id=0;
            $.ajax(mainUrl + "flights/" + flightid, {
                type: "GET",
                xhrFields: {
                    withCredentials: true
                },
                datatype: JSON,
                async:false,
                success: function (response) {
                    selected_plane_id = response.plane_id;
                },
                error: function() {
                    alert("get plane id failed");
                }

            });

            $.ajax(mainUrl + "seats", {
                type: "GET",
                xhrFields: {
                    withCredentials: true
                },
                datatype: JSON,
                async:false,
                success: function (response) {
                    console.log("jinlai");
                    for (i = 0; i < response.length; i++) {
                        //if info is null
                        if (response[i].plane_id == selected_plane_id) {
                            if (response[i].info == "") {
                                
                                infoarray = ""+instanceid;
                                
                                $.ajax(mainUrl + "seats/"+ response[i].id, {
                                    type: "PUT",
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    data: {
                                        seat:{
                                        info: infoarray
                                    },
                                    },
                                    async:false,
                                    success: function() {
                                        console.log("sucessaaa");
                                       seatid=response[i].id;
                                       console.log(infoarray); 
                                    },
                                    error: function() {
                                        alert("post info failed");
                                    }
                                });
                                break;
                            }
                        //if info is not null
                                    //如果info空，则post， 如果不空，如果有，下一个大loop，如果没有，post
                            else {
                                contain=0;
                                for (j = 0; j < response[i].info.length; j++) {
                                    if (response[i].info[j] ==instanceid ){
                                            contain=1;
                                            break;
                                    }
                                }
                                if(contain==1){
                                   continue;
                                }else{
                                    infoarray=response[i].info;
                                    infoarray=infoarray.split(",");
                                    infoarray.push(instanceid);
                                    infoarray=infoarray.toString();
                                    
                                    $.ajax(mainUrl + "seats/"+ response[i].id, {
                                        type: "PUT",
                                        xhrFields: {
                                            withCredentials: true
                                        },
                                        data: {
                                            seat:{
                                                info: infoarray}
                                        },
                                        async:false,
                                        success: function() {
                                            seatid=response[i].id;
                                           
                                        },
                                        error: function() {
                                            alert("post exist info failed");
                                        }
                                    });
                                    break;
                                }
                            }
                        }
                    }
                },
                error: function() {
                    alert("get seats failed");
                }
            });


            $.ajax(mainUrl + "tickets", {
                type: 'POST',
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    ticket: {
                        first_name: $("#firstname").val(),
                        last_name: $("#lastname").val(),
                        age: $("#age").val(),
                        gender: $("#gender").val(),
                        instance_id: instanceid,
                        seat_id:seatid,
                        info:conf_code
                      }
                },
                async:false,
                success: function () {
                    let firstName=$("#firstname").val();
                    let lastName=$("#lastname").val();
                    let age=$("#age").val();
                    let gender=$("#gender").val();
                    $("#body").empty();
                    $("#body").append("<h1>Your ticket</h1>");
                    $("#body").append("<table id='ticket_result'></table>")
                    $("#ticket_result").append($("<tr id='mingzi'></tr>"));
                    $("#mingzi").append("<td>Name: </td>");
                    $("#mingzi").append("<td>"+firstName+" "+lastName+"</td>");

                    $("#ticket_result").append($("<tr id='nianling'></tr>"));
                    $("#nianling").append("<td>Age: </td>");
                    $("#nianling").append("<td>"+age+"</td>");

                    $("#ticket_result").append($("<tr id='xingbie'></tr>"));
                    $("#xingbie").append("<td>Gender: </td>");
                    $("#xingbie").append("<td>"+gender+"</td>");

                    $("#ticket_result").append($("<tr id='youxiang'></tr>"));
                    $("#youxiang").append("<td>Email: </td>");
                    $("#youxiang").append("<td>"+emailid+"</td>");

                    $("#ticket_result").append($("<tr id='queren'></tr>"));
                    $("#queren").append("<td>Confirmation Code: </td>");
                    $("#queren").append("<td>"+conf_code+"</td>");

                    var seat_row;
                    var seat_number;
                    $.ajax(mainUrl + "seats", {
                        type: "GET",
                        xhrFields: {
                            withCredentials: true
                        },
                        async:false,
                        success: function(response) {
                            for (q = 0; q < response.length; q++) {
                                if (response[q].id == seatid) {
                                    seat_row = response[q].row;
                                    seat_number = response[q].number;
                                }
                            }
                        },
                        error: function() {
                            alert("get seats failed");
                        }
                    });

                    $("#ticket_result").append($("<tr id='zuowei'></tr>"));
                    $("#zuowei").append("<td>Seat: </td>");
                    $("#zuowei").append("<td>"+seat_row + seat_number+ "</td>");

                    $("#ticket_result").append($("<tr id='riqi'></tr>"));
                    $("#riqi").append("<td>Date: </td>");
                    $("#riqi").append("<td>"+dateid+ "</td>");

                    $("#ticket_result").append($("<tr id='chufashijian'></tr>"));
                    $("#chufashijian").append("<td>Departure Time: </td>");
                    $("#chufashijian").append("<td>"+departuretimeid+ "</td>");

                    $("#ticket_result").append($("<tr id='daodashijian'></tr>"));
                    $("#daodashijian").append("<td>Arrival Time: </td>");
                    $("#daodashijian").append("<td>"+arrivaltimeid+ "</td>");

                    $("#ticket_result").append($("<tr id='chufadi'></tr>"));
                    $("#chufadi").append("<td>Depart: </td>");
                    $("#chufadi").append("<td>"+sourceid+ "</td>");

                    $("#ticket_result").append($("<tr id='mudidi'></tr>"));
                    $("#mudidi").append("<td>Arrive: </td>");
                    $("#mudidi").append("<td>"+destinationid+ "</td>");

                    $("#ticket_result").append($("<tr id='hangbanhao'></tr>"));
                    $("#hangbanhao").append("<td>Flight Number: </td>");
                    $("#hangbanhao").append("<td>"+flightnumberid+ "</td>");

                    $("#ticket_result").append($("<tr id='hangkong'></tr>"));
                    $("#hangkong").append("<td>Airline: </td>");
                    $("#hangkong").append("<td>"+airlinenameid+ "</td>");
                    $("#body").append("<button id='confirm_back'>Go Back</button>");
                    
                },
                error: function () {
                    alert('ticket post fail');
                }                
            });

        });

    $(document).on("click","#ticketback",function(){
        build_main_interface();
    });
    $(document).on("click","#confirm_back",function(){
        build_main_interface();
    });

    $(document).on("click","#info_back",function(){
        build_main_interface();
    });
    $(document).on("click", "#tickets_btn", function () {
        $("#body").empty();
        $("#body").append("<h1>My Tickets</h1>")
        $("#body").append("<table id = 'myTicketTable'></table>");
        $("#body").append("<button id='ticketback'>Go Back</button>")
        $("#myTicketTable").append("<tr id='headings'></tr>");
        $("#headings").append("<th>First Name: </th>");
        $("#headings").append("<th>Last Name: </th>");
        $("#headings").append("<th>Confirmation Code: </th>");
        $("#headings").append("<th>Seat: </th>");
        $("#headings").append("<th>Date: </th>");
        $("#headings").append("<th>Flight Number: </th>");
        $("#headings").append("<th>Departure Time: </th>");
        $("#headings").append("<th>Arrival Time: </th>");


        $.ajax(mainUrl+"tickets",{
            type:"GET",
            xhrFields: {
                withCredentials: true
            },
            datatype: JSON,
            async:false,
            success: function (response) {
                for(i=0;i<response.length;i++){
                    fname=response[i].first_name;
                    lname=response[i].last_name;
                    instanceid=response[i].instance_id;
                    itineraryid=response[i].itinerary_id;
                    seatid=response[i].seat_id;  
                
                    confirmationcode=response[i].info; 
               
                    rowid=0;
                    number="";
                    flightid="";
                    date="";
                    flightnumber="";
                    depart_time="";
                    arrive_time="";
                    $.ajax(mainUrl+"seats/"+seatid,{
                        type:"GET",
                        xhrFields: {
                            withCredentials: true
                        },
                        datatype: JSON,
                        async:false,   
                        success: function(response){
                            rowid=response.row;
                            number=response.number;
                        },
                        error:function(){
                            alert("seat failed")
                        }        
                    });
                    console.log(itineraryid);
                   
                    $.ajax(mainUrl+"instances/"+instanceid,{
                        type:"GET",
                        xhrFields: {
                            withCredentials: true
                        },
                        datatype: JSON,
                        async:false,   
                        success: function(response){
                          flightid =response.flight_id;
                          date=response.date;
                        },
                        error:function(){
                            alert("instance failed")
                        }        
                    });
                    $.ajax(mainUrl+"flights/"+flightid,{
                        type:"GET",
                        xhrFields: {
                            withCredentials: true
                        },
                        datatype: JSON,
                        async:false,   
                        success: function(response){
                           flightnumber=response.number;
                           depart_time=response.departs_at;
                           arrive_time=response.arrives_at;
                        },
                        error:function(){
                            alert("flight failed")
                        }        
                    });

                   
                    let row = $("<tr></tr>");
                    $("#myTicketTable").append(row);
                    
                    row.append("<td>" + fname + "</td>");
                    
                    row.append("<td>" + lname+ "</td>");
                    
                    row.append("<td class='confcode' id = '"+ confirmationcode + "'>" + confirmationcode + "</td>");
                    
                    row.append("<td class='seatid' id = '" + seatid + "'>" + rowid + number + "</td>");
                    
                    row.append("<td>" + date + "</td>");
                    
                    row.append("<td id='"+instanceid+"' class='instanceid'>" + flightnumber + "</td>");
                    
                    depart_time=depart_time.substring(11,19);
                    arrive_time=arrive_time.substring(11,19);
                    row.append("<td>" + depart_time + "</td>");
                    
                    row.append("<td>" + arrive_time + "</td>");

                    row.append('<button class="cancel" id = "'+ response[i].id +'">Cancel</button>');
                }
            },
            error: function() {
                alert("get tickets failed");
            }
        });

    });

    //cancel
    $(document).on("click",".cancel",function(){
        instanceid=$(this).parent().children(".instanceid").attr("id");
        ticketid=$(this).attr("id");
        seatid=$(this).parent().children(".seatid").attr("id");
        confcode=$(this).parent().children(".confcode").attr("id");
       itineraryid="";
        $.ajax(mainUrl+"tickets/"+ticketid,{
            type:"DELETE",
            xhrFields: {
                withCredentials: true
            },
            datatype: JSON,
            async:false,   
            success: function(){
               
            },
            error:function(){
                alert("ticket delete failed");
            }        
        });
        $.ajax(mainUrl+"itineraries",{
            type:"GET",
            xhrFields: {
                withCredentials: true
            },
            datatype: JSON,
            async:false,   
            success: function(response){
               for(k=0;k<response.length;k++){
                   if(response[k].confirmation_code==confcode){
                       itineraryid=response[k].id;
                   }
               }
            },
            error:function(){
                alert("itinerary get failed");
            }        
        });

        console.log(itineraryid);
        $.ajax(mainUrl+"itineraries/"+itineraryid,{
            type:"DELETE",
            xhrFields: {
                withCredentials: true
            },
            datatype: JSON,
            async:false,   
            success: function(){
               
            },
            error:function(){
                alert("itinerary delete failed");
            }        
        });
        $.ajax(mainUrl+"seats/"+seatid,{
            type:"GET",
            xhrFields: {
                withCredentials: true
            },
            datatype: JSON,
            async:false,   
            success: function(response){
              infoarray= response.info 
              infoarray=infoarray.split(",");
              if(infoarray.length==1){
                  infoarray="";
              }
              else{for(j=0;j<infoarray.length;j++){
                  if(infoarray[j]==instanceid){
                      infoarray.splice(j,1);
                      infoarray=infoarray.toString();
                      break;
                  }
              }}
              $.ajax(mainUrl+"seats/"+seatid,{
                type:"PUT",
                xhrFields: {
                    withCredentials: true
                },
                datatype: JSON,
                async:false,   
                data:{
                    seat:{
                        info:infoarray
                    }
                },
                success:function(){
                },
                error:function(){
                    alert("bug");
                }
            
            })
            },
            error:function(){
                alert("seat get failed");
            }        
        });
        $(this).parent().remove();
    });


});


Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}