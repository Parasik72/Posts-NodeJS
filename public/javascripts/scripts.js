$(function(){$("#sendPost").on("click",function(o){o.preventDefault();var n={title:$("#titlePost").val(),body:$("#bodyPost").val()};$.ajax({method:"POST",data:JSON.stringify(n),contentType:"application/json",url:"/posts/create"}).done(function(o){console.log(o),$(location).attr("href","/posts")}).fail(function(o){console.log(o.responseJSON)})}),$(".deletePost").on("click",function(o){o.preventDefault();var n={post:this.parentElement.parentElement.getAttribute("id")};$.ajax({method:"POST",data:JSON.stringify(n),contentType:"application/json",url:"/posts/delete"}).done(function(o){console.log(o),$(location).attr("href",window.location.href)}).fail(function(o){console.log(o.responseJSON)})})}),$(function(){function o(){$(".formLogin").has("p")&&$(".formLogin p").remove(),$(".formRegistration").has("p")&&$(".formRegistration p").remove(),$("input").removeClass("error")}$("form #loginSend").on("click",function(n){n.preventDefault();var t={login:$("#loginLogin").val(),password:$("#loginPassword").val()};$.ajax({method:"POST",data:JSON.stringify(t),contentType:"application/json",url:"/api/auth/login"}).done(function(o){console.log(o),$(location).attr("href",window.location.href)}).fail(function(n){o(),n.responseJSON.fields.forEach(function(o){$("#"+o).addClass("error")}),$(".formLogin h2").after('<p class="error">'+n.responseJSON.error+"</p>"),console.log(n.responseJSON)})}),$("form #registrationSend").on("click",function(n){n.preventDefault();var t={login:$("#registrationLogin").val(),password:$("#registrationPassword").val(),confirmPassword:$("#registrationConfirmPassword").val()};$.ajax({method:"POST",data:JSON.stringify(t),contentType:"application/json",url:"/api/auth/registration"}).done(function(o){console.log(o),$(location).attr("href",window.location.href)}).fail(function(n){o(),n.responseJSON.fields.forEach(function(o){$("#"+o).addClass("error")}),$(".formRegistration h2").after('<p class="error">'+n.responseJSON.error+"</p>"),console.log(n.responseJSON)})}),$("#logout").on("click",function(o){o.preventDefault(),$.ajax({method:"GET",url:"/api/auth/logout"}).done(function(o){console.log(o),$(location).attr("href",window.location.href)}).fail(function(o){console.log(o.responseJSON)})}),$("#toLogin").on("click",function(n){n.preventDefault(),o(),$("input").val(""),$(".formRegistration").hide(),$(".formLogin").show("slow")}),$("#toRegistration").on("click",function(n){n.preventDefault(),o(),$("input").val(""),$(".formRegistration").show("slow"),$(".formLogin").hide()}),$("input").on("focus",o)}),$(function(){$("#addComment").on("click",function(o){o.preventDefault();var n={body:$("#bodyComment").val(),post:$(".post").attr("id")};$.ajax({method:"POST",contentType:"application/json",data:JSON.stringify(n),url:"/comment/add"}).done(function(o){console.log(o),$(location).attr("href",window.location.href)}).fail(function(o){console.log(o.responseJSON)})}),$(".deleteComment").on("click",function(o){o.preventDefault();var n={comment:this.parentElement.parentElement.getAttribute("id")};$.ajax({method:"POST",contentType:"application/json",data:JSON.stringify(n),url:"/comment/delete"}).done(function(o){$(location).attr("href",window.location.href)}).fail(function(o){console.log(o.responseJSON)})})}),$(function(){$(".posts").css("max-height",window.screen.height/2),$(window).resize(function(){$(".posts").css("max-height",window.screen.height/2)})});