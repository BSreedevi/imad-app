alert('logged in successfully');
var submit = document.getElementById('submit_btn');
submit.onClick = function(){
    // create request obj
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readystate === XMLHttpRequest.Done)
        {
            alert('XMLHttpRequest');
            if(req.status === 200)
            {
                alert('logged in successfully');
                /*var names = req.responseText;
                names= JSON.parse(names);
                var list ='';
                for(var i=0;i<names.length;i++)
                {
                    list += '<list>' + names[i] + '</list>';
                }
                var ul = document.getElementById('namelist');
                ul.innerHTML = list;*/
            } else if(req.status === 403){
                alert('username/password incorrect');
            }else if(req.status === 500){
                alert('something went wrong');
            }
            
        }
    };
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    req.open('POST','http://sreedeviharigopal.imad.hasura-app.io/login'+ name, true);
    req.setRequestHedder('Content-Type', 'application/json');
    req.send(JSON.stringify({username: username, password: password }));

};