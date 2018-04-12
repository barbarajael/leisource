// sidebar
$('document').ready(function () {
    $("#wrapper").toggleClass("toggled");
});



// --------------- MAIN ---------------


// helps to distinguish between create_account and profile
// in order to reuse functions
var isCA;


$(main);


function main() {
    // ----- PAGE LOGIN -----

    // modal login - validate all the fields
    $("#LOGsignBtn").click(function() {
        validateLOG();
    });


    // switch between modals
    $("#createAccBtn").click(function() {
        $("#loginForm").modal('hide');
        $("#createAccForm").modal('show');
    });

    
    // modal create account - validate all the fields
    $("#CAcreateBtn").click(function() {
        isCA = true;
        validateCA(isCA);
    });
}



// --------------- VALIDATIONS ---------------


// validates login
function validateLOG (logFailed) {
    var regex = /^([a-zA-Z0-9_.+-])+\@ua\.pt/;


    // ----- EMAIL -----

    // if was not defined
    if ($("#LOGemail").val().length == 0) {
        $("#LOGemail").css("border","5px solid red");
        $("#LOGemail").attr("placeholder", "CAMPO OBRIGATORIO");
    }

    // if doesn't match the email regex
    else if (regex.test($("#LOGemail").val()) == false) {
        $("#LOGemail").css("border","5px solid red");
        alert("AVISO: E-mail mal formado!");
    }


    // ----- PASS -----

    // if was not defined
    else if ($("#LOGpass").val().length == 0) {
        // reset do anterior
        $("#LOGemail").css("border","1px solid black");

        $("#LOGpass").css("border","5px solid red");
        $("#LOGpass").attr("placeholder", "CAMPO OBRIGATORIO");
    }


    // ----- ALL OK ----
    // after all fields validated, check if user exists
    else {
        // if it does, proceed
        if (checkUserExists()) {
            // hide this modal
            $("#loginForm").modal('hide');

            // save the user id (email strip on char "@")
            var mail = $("#LOGemail").val();
            var res = mail.split("@", 1);
            localStorage.setItem("userID", res);
        
            // unload stuff from home (index)
            $("#homecontainer").html("");
            $("#homecontainer").attr('class', 'newClass');

            // load the necessary ones
            $("#menu-navbar").load("main.html");
            

            // ADMIN
            if (res == "admin") {
                $("#wrapper").load("admin/inicial.html");
            }


            // NORMAL USER
            else {
                $("#wrapper").load("user/paginaInicial.html");


                // a sort of refreshing, so the storage data appears
                $("#wrapper").on("mouseenter", function() {
                    // replace user id with the right one from login
                    user = localStorage.getItem("userID");
                    $("#userMenu").html(user);


                    isCA = false

                    // load info that is already saved
                    var temp = localStorage.getItem("usersData");
                    var userString = JSON.parse(temp);

                    // is not create_account - is profile
                    if (!isCA)
                    {
                        $("#CAname").attr("placeholder", userString.name).val("");
                        $("#CAemail").attr("placeholder", userString.email).val(userString.email);
                    }
                });
            }
        }


        else {
            alert("AVISO: o utilizador não está registado!")
        }
    }
}


// ---------------------


// validates create account
function validateCA (isCA) {
    var regexName = /^[A-Z][a-z]+( )[A-Z][a-z]+/;
    var regexMail = /^[a-zA-Z0-9_.+-]+[a-zA-Z0-9]+\@ua\.pt/;

    // ----- NAME -----

    // if was not defined
    if ($("#CAname").val().length == 0) {
        $("#CAname").css("border","5px solid red");
        $("#CAname").attr("placeholder", "CAMPO OBRIGATORIO");
    }

    // if length is "strange"
    else if ($("#CAname").val().length < 5) {
        $("#CAname").css("border","5px solid red");
        alert("AVISO: Nome demasiado curto!");
    }

    // if doesn't match the name regex
    else if (regexName.test($("#CAname").val()) == false) {
        $("#CAname").css("border","5px solid red");
        alert("AVISO: Insira o primeiro e último nome!");
    }


    // ----- EMAIL -----
    // field only checked if is in create account

    // if was not defined
    else if ($("#CAemail").val().length == 0 && isCA) {
        // reset do anterior
        $("#CAname").css("border","1px solid black");

        $("#CAemail").css("border","5px solid red");
        $("#CAemail").attr("placeholder", "CAMPO OBRIGATORIO");
    }

    // if doesn't match the email regex
    else if (regexMail.test($("#CAemail").val()) == false && isCA) {
        $("#CAemail").css("border","5px solid red");
        alert("AVISO: E-mail mal formado!");
    }

    // if tries to create account as admin
    else if ($("#CAemail").val().toLowerCase() == "admin@ua.pt" && isCA) {
        $("#CAemail").css("border","5px solid red");
        alert("AVISO: Email reservado!");
    }


    // ----- PASS -----

    // if was not defined
    else if ($("#CApass").val().length == 0) {
        // reset do anterior
        $("#CAemail").css("border","1px solid black");

        $("#CApass").css("border","5px solid red");
        $("#CApass").attr("placeholder", "CAMPO OBRIGATORIO");
    }

    // if length is "strange"
    else if ($("#CApass").val().length < 6) {
        $("#CApass").css("border","5px solid red");
        alert("AVISO: Password demasiado curta!");
    }

    // if tries to create account as admin
    else if ($("#CApass").val().toLowerCase() == "admin") {
        $("#CApass").css("border","5px solid red");
        alert("AVISO: Password reservada!");
    }


    // ----- PASS2 -----

    // if passwords aren't equal
    else if ($("#CApass2").val() != $("#CApass").val()) {
        $("#CApass").css("border","5px solid red");
        $("#CApass2").css("border","5px solid red");

        $("#CApass2").attr("placeholder", "PASSWORDS DIFERENTES");
        alert("AVISO: Passwords diferentes!");
    }


    // ----- ALL OK -----
    else {
        // if is create_account, is a modal, so hide it
        if (isCA)
        {
            $("#createAccForm").modal('hide');
        }

        // if is updating (profile), erase first
        else {
            localStorage.removeItem("usersData");
        }

        saveUser();
    }
}


// --------------- HANDLERS ---------------



// USED AT modal create account
// saves user info after all validations
// gives feedback to user that has been created
function saveUser() {
    // create user with fields: name, email, pass
    var myObject = new Object();
    myObject.name = $("#CAname").val();
    myObject.email = $("#CAemail").val();
    myObject.pass = $("#CApass").val();

    // make json string of the user
    var userJsonString = JSON.stringify(myObject);



    // ------ makes possible that can coexists several users ------
    /*
    var tmpUsers = "";

    // get user data storaged
    var tmpStorage = localStorage.getItem("usersData");

    // if is empty - if there isn't any user registered yet
    // then just store this one
    if (tmpStorage.name == "") {
        tmpUsers = userJsonString;
    }

    // otherwise, need to get them together
    else {
        tmpUsers = tmpStorage + ",\n" + userJsonString;
    }
    
    localStorage.setItem("usersData", tmpUsers);
    */
    // ------------------
    
    

    // save info on local storage
    localStorage.setItem("usersData", userJsonString);


    // if is creating - create account
    if (isCA) {
        alert("Utilizador criado com sucesso!");
    }

    // if is updating - profile
    else {
        alert("Utilizador atualizado com sucesso!");
    }
}


// ---------------------


// checks if user exists
// it's either the admin or a registered user
// returns true if it exists
function checkUserExists() {
    var tmpJSON = localStorage.getItem("usersData");
    var userString = JSON.parse(tmpJSON);
    var result;
    

    // either the email and pass are from admin
    // or the user is registered (info at local storage)
    if (
        ($("#LOGemail").val() == "admin@ua.pt" && $("#LOGpass").val() == "admin")
        || ($("#LOGemail").val() == userString.email
             && $("#LOGpass").val() == userString.pass)
    ) {
        result = true;
    }

    // doesn't exist
    else {
        result = false;
    }


    return result;
}



// --------------- LOAD PAGES ---------------

// ----- ADMIN -----

function goInicial() {
    $("#wrapper").load("admin/inicial.html");
}

function goUserList() {
    $("#page-content-wrapper").load("admin/users.html");

    //var tmpJSON = localStorage.getItem("usersData");
    //var userString = JSON.parse(tmpJSON);

    /*$("#listUsers").append("<a class='list-group-item list-group-item-action'>" +
        "<button type='button' class='btn btn-success' style='margin: 5px'> <span class='fa fa-user-o'> </button>" +
        "<span>Miriam Cardoso, mc@ua.pt</span>" +
    "</a>");*/
}


// ----- USER -----

function goPagInicial() {
    $("#wrapper").load("user/paginaInicial.html");
}


function goPerfil() {
    $("#wrapper").load("user/perfil.html");
}


function goDiscl1() {
    $("#page-content-wrapper").load("user/1ano.html");
}


function goDiscl2() {
    $("#page-content-wrapper").load("user/2ano.html");
}

function goDiscl3() {
    $("#page-content-wrapper").load("user/3ano.html");
}


function goIndex() {
    // reset local storage user id
    localStorage.removeItem("userID");

    // must replace all, otherwise somethings won't work
    window.location.replace("index.html");
}


function goUpFile(nome) {
    $("#page-content-wrapper").load("user/uploadfile.html", function () {
        if (nome === "alga") {
            $("#1alga").show();
        } else if (nome === "md") {
            $("#1md").show();
        } else if (nome === "ci") {
            $("#1calculo1").show();
        } else if (nome === "cii") {
            $("#1calculo2").show();
        } else if (nome === "ef") {
            $("#1efisica").show();
        } else if (nome === "itw") {
            $("#1itw").show();
        } else if (nome === "fp") {
            $("#1fp").show();
        } else if (nome === "poo") {
            $("#1poo").show();
        } else if (nome === "iac") {
            $("#1iac").show();
        } else if (nome === "mas") {
            $("#1mas").show();
        } else if (nome === "aed") {
            $("#2aed").show();
        } else if (nome === "mpei") {
            $("#2mpei").show();
        } else if (nome === "rs") {
            $("#2rs").show();
        } else if (nome === "sm") {
            $("#2sm").show();
        } else if (nome === "so") {
            $("#2so").show();
        } else if (nome === "c") {
            $("#2c").show();
        } else if (nome === "cd") {
            $("#2cd").show();
        } else if (nome === "pds") {
            $("#2pds").show();
        } else if (nome === "ihc") {
            $("#2ihc").show();
        } else if (nome === "bd") {
            $("#2bd").show();
        } else if (nome === "sio") {
            $("#3sio").show();
        } else if (nome === "cbd") {
            $("#3cbd").show();
        } else if (nome === "ia") {
            $("#3ia").show();
        } else if (nome === "ies") {
            $("#3ies").show();
        } else if (nome === "pi") {
            $("#3pi").show();
        } else if (nome === "apsei") {
            $("#3apsei").show();
        } else if (nome === "tqs") {
            $("#3tqs").show();
        } else if (nome === "ge") {
            $("#3ge").show();
        } else if (nome === "icm") {
            $("#3icm").show();
        } else if (nome === "emp") {
            $("#3emp").show();
        } else if (nome === "tpw") {
            $("#3tpw").show();
        }
    });
}


function upFileConfirm(disciplina) {
    ficheiro = document.getElementById('fileInput').value;

    if ($("#1alga").is(":visible")) {
        goALGA();
    } else if ($("#1md").is(":visible")) {
        goMD();
    } else if ($("#1calculo1").is(":visible")) {
        goCI();
    } else if ($("#1calculo2").is(":visible")) {
        goCII();
    } else if ($("#1efisica").is(":visible")) {
        goEF();
    } else if ($("#1itw").is(":visible")) {
        goITW();
    } else if ($("#1fp").is(":visible")) {
        goFP();
    } else if ($("#1poo").is(":visible")) {
        goPOO();
    } else if ($("#1iac").is(":visible")) {
        goIAC();
    } else if ($("#1mas").is(":visible")) {
        goMAS();
    } else if ($("#2aed").is(":visible")) {
        goAED();
    } else if ($("#2mpei").is(":visible")) {
        goMPEI();
    } else if ($("#2rs").is(":visible")) {
        goREDES();
    } else if ($("#2sm").is(":visible")) {
        goSMU();
    } else if ($("#2so").is(":visible")) {
        goSO();
    } else if ($("#2c").is(":visible")) {
        goC();
    } else if ($("#2cd").is(":visible")) {
        goCBD();
    } else if ($("#2pds").is(":visible")) {
        goPDS();
    } else if ($("#2ihc").is(":visible")) {
        goIHC();
    } else if ($("#2bd").is(":visible")) {
        goBD();
    } else if ($("#3sio").is(":visible")) {
        goSIO();
    } else if ($("#3cbd").is(":visible")) {
        goCBD();
    } else if ($("#3ia").is(":visible")) {
        goIA();
    } else if ($("#3ies").is(":visible")) {
        goIES();
    } else if ($("#3pi").is(":visible")) {
        goPI();
    } else if ($("#3apsei").is(":visible")) {
        goAPSEI();
    } else if ($("#3tqs").is(":visible")) {
        goTQS();
    } else if ($("#3ge").is(":visible")) {
        goGE();
    } else if ($("#3icm").is(":visible")) {
        goICM();
    } else if ($("#3emp").is(":visible")) {
        goE();
    } else if ($("#3tpw").is(":visible")) {
        goTPW();
    }

    alert("Carregamento do ficheiro concluído!");
    if ($("#mensagem").is(":visible")) {
        $("#mensagem").hide();
    }

    $("#conteudos ul").append("<li class='list-group-item'>"
        + "<button type='button' class='btn btn-success' style='margin:5px' title='Download' "
        + "data-toggle:'modal' data-target='#teste'> <span class='fa fa-download right'> "
        + "</button>" + ficheiro + "</li>");
}

function goALGA() {
    $("#page-content-wrapper").load("user/1ano/alga.html");
}

function goMD() {
    $("#page-content-wrapper").load("user/1ano/md.html");
}

function goCI() {
    $("#page-content-wrapper").load("user/1ano/calculo1.html");  
}

function goCII() {
    $("#page-content-wrapper").load("user/1ano/calculo2.html");  
}

function goEF() {
    $("#page-content-wrapper").load("user/1ano/ef.html");    
}

function goITW() {
    $("#page-content-wrapper").load("user/1ano/itw.html");   
}

function goFP() {
    $("#page-content-wrapper").load("user/1ano/fp.html");    
}

function goPOO() {
    $("#page-content-wrapper").load("user/1ano/poo.html");   
}

function goIAC() {
    $("#page-content-wrapper").load("user/1ano/iac.html");   
}

function goMAS() {
    $("#page-content-wrapper").load("user/1ano/mas.html");   
}

function goAED() {
    $("#page-content-wrapper").load("user/2ano/aed.html");
}

function goMPEI() {
    $("#page-content-wrapper").load("user/2ano/mpei.html");
}

function goREDES() {
    $("#page-content-wrapper").load("user/2ano/redes.html");
}

function goSMU() {
    $("#page-content-wrapper").load("user/2ano/smu.html");
}

function goSO() {
    $("#page-content-wrapper").load("user/2ano/so.html");
}

function goC() {
    $("#page-content-wrapper").load("user/2ano/c.html");
}

function goCD() {
    $("#page-content-wrapper").load("user/2ano/cd.html");
}

function goPDS() {
    $("#page-content-wrapper").load("user/2ano/pds.html");
}

function goIHC() {
    $("#page-content-wrapper").load("user/2ano/ihc.html");
}

function goBD() {
    $("#page-content-wrapper").load("user/2ano/bd.html");
}

function goSIO() {
    $("#page-content-wrapper").load("user/3ano/sio.html");
}

function goCBD() {
    $("#page-content-wrapper").load("user/3ano/cbd.html");
}

function goIA() {
    $("#page-content-wrapper").load("user/3ano/ia.html");
}

function goIES() {
    $("#page-content-wrapper").load("user/3ano/ies.html");
}

function goPI() {
    $("#page-content-wrapper").load("user/3ano/pi.html");
}

function goAPSEI() {
    $("#page-content-wrapper").load("user/3ano/apsei.html");
}

function goTQS() {
    $("#page-content-wrapper").load("user/3ano/tqs.html");
}

function goGE() {
    $("#page-content-wrapper").load("user/3ano/ge.html");
}

function goICM() {
    $("#page-content-wrapper").load("user/3ano/icm.html");
}

function goE() {
    $("#page-content-wrapper").load("user/3ano/e.html");
}

function goTPW() {
    $("#page-content-wrapper").load("user/3ano/tpw.html");
}