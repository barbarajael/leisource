// sidebar
$('document').ready(function () {
    $("#wrapper").toggleClass("toggled");
});



// --------------- MAIN ----------------


// helps to distinguish between create_account and profile
// in order to reuse functions
var isCA;


$(main);


function main() {
    // ----- PAGE LOGIN -----

    // login - validate all the fields
    $("#LOGsignBtn").click(function() {
        validateLOG();
    });


    // create account - validate all the fields
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
            $("#menu-navbar").load("mainP");
            

            // ADMIN
            if (res == "admin") {
                $("#wrapper").load("adminInicial");
            }


            // NORMAL USER
            else {
                $("#wrapper").load("userInicial");


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



// --------------- LOAD PAGES ---------------


// ----- ADMIN -----

function goUserList() {
    $("#page-content-wrapper").load("adminUsers");
}



// ----- GUEST -----

function goGuestDisc (ano) {
    switch (ano) {
        case 1:
            $("#page-content-wrapper").load("guestCad1");
            break;
        case 2:
            $("#page-content-wrapper").load("guestCad2");
            break;
        case 3:
            $("#page-content-wrapper").load("guestCad3");
            break;
        default:
            break;
    }

}



// ----- USER -----

function goDisc (ano) {
    switch(ano) 
    {
        case 1:
            $("#page-content-wrapper").load("user1ano");
            break;
        case 2:
            $("#page-content-wrapper").load("user2ano");
            break;
        case 3:
            $("#page-content-wrapper").load("user3ano");
            break;
        default:
            break;
    }
}


// cadeiras

function goCadeira(disciplina) {
    switch (disciplina) {
        case "alga":
            $("#page-content-wrapper").load("userAlga");
            break;
        case "md":
            $("#page-content-wrapper").load("userMd");
            break;
        case "calculo1":
            $("#page-content-wrapper").load("userCalculo1");
            break;
        case "calculo2":
            $("#page-content-wrapper").load("userCalculo2");
            break;
        case "ef":
            $("#page-content-wrapper").load("userEf");
            break;
        case "itw":
            $("#page-content-wrapper").load("userItw");
            break;
        case "fp":
            $("#page-content-wrapper").load("userFp");
            break;
        case "poo":
            $("#page-content-wrapper").load("userPoo");
            break;
        case "iac":
            $("#page-content-wrapper").load("userIac");
            break;
        case "mas":
            $("#page-content-wrapper").load("userMas");
            break;
        case "aed":
            $("#page-content-wrapper").load("userAed");
            break;
        case "mpei":
            $("#page-content-wrapper").load("userMpei");
            break;
        case "redes":
            $("#page-content-wrapper").load("userRedes");
            break;
        case "smu":
            $("#page-content-wrapper").load("userSmu");
            break;
        case "so":
            $("#page-content-wrapper").load("userSo");
            break;
        case "c":
            $("#page-content-wrapper").load("userComp");
            break;
        case "cd":
            $("#page-content-wrapper").load("userCd");
            break;
        case "pds":
            $("#page-content-wrapper").load("userPds");
            break;
        case "ihc":
            $("#page-content-wrapper").load("userIhc");
            break;
        case "bd":
            $("#page-content-wrapper").load("userBd");
            break;
        case "sio":
            $("#page-content-wrapper").load("userSio");
            break;
        case "cbd":
            $("#page-content-wrapper").load("userCbd");
            break;
        case "ia":
            $("#page-content-wrapper").load("userIa");
            break;
        case "ies":
            $("#page-content-wrapper").load("userIes");
            break;
        case "pi":
            $("#page-content-wrapper").load("userPi");
            break;
        case "apsei":
            $("#page-content-wrapper").load("userApsei");
            break;
        case "tqs":
            $("#page-content-wrapper").load("userTqs");
            break;
        case "ge":
            $("#page-content-wrapper").load("userGe");
            break;
        case "icm":
            $("#page-content-wrapper").load("userIcm");
            break;
        case "e":
            $("#page-content-wrapper").load("userE");
            break;
        case "tpw":
            $("#page-content-wrapper").load("userTpw");
            break;
        default:
            break;
    }
}

/*
// upload

function goUpFile (disc) {
    $("#page-content-wrapper").load("userUploadFile", function () {
        if (disc === "alga") {
            $(disc).show();
        } else if (disc === "md") {
            $(disc).show();
        } else if (disc === "calculo1") {
            $(disc).show();
        } else if (disc === "calculo2") {
            $(disc).show();
        } else if (disc === "ef") {
            $(disc).show();
        } else if (disc === "itw") {
            $(disc).show();
        } else if (disc === "fp") {
            $(disc).show();
        } else if (disc === "poo") {
            $(disc).show();
        } else if (disc === "iac") {
            $(disc).show();
        } else if (disc === "mas") {
            $(disc).show();
        } else if (disc === "aed") {
            $(disc).show();
        } else if (disc === "mpei") {
            $(disc).show();
        } else if (disc === "redes") {
            $(disc).show();
        } else if (disc === "smu") {
            $(disc).show();
        } else if (disc === "so") {
            $(disc).show();
        } else if (disc === "c") {
            $(disc).show();
        } else if (disc === "cd") {
            $(disc).show();
        } else if (disc === "pds") {
            $(disc).show();
        } else if (disc === "ihc") {
            $(disc).show();
        } else if (disc === "bd") {
            $(disc).show();
        } else if (disc === "sio") {
            $(disc).show();
        } else if (disc === "cbd") {
            $(disc).show();
        } else if (disc === "ia") {
            $(disc).show();
        } else if (disc === "ies") {
            $(disc).show();
        } else if (disc === "pi") {
            $(disc).show();
        } else if (disc === "apsei") {
            $(disc).show();
        } else if (disc === "tqs") {
            $(disc).show();
        } else if (disc === "ge") {
            $(disc).show();
        } else if (disc === "icm") {
            $(disc).show();
        } else if (disc === "e") {
            $(disc).show();
        } else if (disc === "tpw") {
            $(disc).show();
        }
    });
}


function upFileConfirm (disciplina) {
    ficheiro = document.getElementById('fileInput').value;

    if ($(disciplina).is(":visible")) {
        goCadeira(disciplina);
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
*/