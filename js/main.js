let pageID = 1;
let res = [];

function pagination(arr) {
    let countPage = arr.length / 6
    $("#pagination").html("")
    $("#pagination").append(`
    <li class="page-item" "><a class="page-link" id="1" onclick = "activePage(this)">1</a></li>
    `)
    for (let i = 1; i < countPage; i++) {
        $("#pagination").append(`
        <li class="page-item" ><a class="page-link" id="${i+1}" onclick = "activePage(this)">${i+1}</a></li>
        `);
    }
}

function addPage(arr) {
    pagination(arr)
    $("#card").html("");
    for (let index = (pageID - 1) * 6; index < arr.length && index < pageID * 6; index++) {
        $("#card").append(`
        <div class="mt-3 col-12 col-md-6 col-lg-4">
            <div class="card">
                <img class="card-img-top" src="${arr[index].avatar}" alt="Card image cap" style="height: 15em;">
                <div class="card-body">
                    <h5 class="card-title">id: ${arr[index].id}</h5>
                    <p class="card-text">email: <span>${arr[index].email}</span></p>
                    <button  class="btn btn-primary" onclick="openModal(this)" id="${arr[index].id}">user profile</button>
                </div>
            </div>
        </div>
        `);
    }
}

function getUsers() {
    $.get("https://reqres.in/api/users?page=1",
        function(data1) {
            $.get("https://reqres.in/api/users?page=2",
                function(data2) {
                    res.push(...data1.data, ...data2.data)
                    addPage(res);
                }
            );
        }
    );
}
getUsers();



function activePage(element) {
    $("#card").html("");
    if (element.id === "pageBack" || element.id === "pageNext") {
        if (element.id === "pageNext") {
            pageID = (pageID == Math.ceil(res.length / 6)) ? 1 : pageID + 1;
        } else {
            pageID = (pageID == 1) ? Math.ceil(res.length / 6) : pageID - 1;
        }
    } else
        pageID = +element.id
        /* for (let i = 1; i <= Math.ceil(res.length / 6); i++) {
            $(`#${i}`).parent().removeClass("active");
        }
        $(`#${pageID}`).parent().addClass("active"); */
    addPage(res);
}

$(".page-link").click(function() {
    activePage(this)
});


function addModal(id) {
    let index = getIndexByID(+id);
    $(".modal-title span").html(`${res[index].id}`);
    $("#modal-body").html(`
    <div class="row g-0">
        <div class="col-md-4">
            <img src="${res[index].avatar}" alt="avatar" style="height: 12em; width: 10em;">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <p class="card-text">First name : ${res[index].first_name}<span></span></p>
                <p class="card-text">Last name : ${res[index].last_name}<span></span></p>
                <p class="card-text">email : ${res[index].email}<span></span></p>
                <p class="card-text"><small class="text-muted">last seen</small></p>
            </div>
        </div>
    </div>`);
}


function openModal(element) {
    addModal(element.id)
    $("#modal").slideDown(1000);
}


$(".closeModal").click(function() {
    $("#create").slideUp(500)
    $("#modal").slideUp(500);
    $("#update").slideUp();
});

function getIndexByID(id) {
    return res.findIndex(element => element.id === id);
}

function deleteByID(id) {
    $("#modal").slideUp(500);
    res.splice(getIndexByID(id), 1)
    addPage(res);
}

$("#delete").click(function() {
    deleteByID(+$(".modal-title span").html())
});

$("#btn-update").click(function() {
    let element = res[getIndexByID(+$(".modal-title span").html())]
    $("#modal").slideUp(1);
    $(".update-avatar").attr("src", `${element.avatar}`)
    $("#update-body").html(`
        <label class="form-label">First name : </label>
        <input type="text" class="form-control" value="${element.first_name}">
        <label class="form-label">Last name : </label>
        <input type="text" class="form-control" value="${element.last_name}">
        <label class="form-label">email : </label>
        <input type="email" class="form-control" value="${element.email}">
    `)
    $("#update").slideDown(1000)
})

function Persone(id, fName, Lname, email, img) {
    this.id = id
    this.first_name = fName;
    this.last_name = Lname
    this.avatar = img
    this.email = email;
}

function creat(id, fName, Lname, email, img, update = false) {
    if (!update) {
        res.push(new Persone(+id, fName, Lname, email, img))
    } else {
        res.splice(getIndexByID(+id), 1, new Persone(+id, fName, Lname, email, img))
    }
}

$("#save-update").click(function() {
    creat(
        $(".modal-title span").html(),
        $(`#update-body input`).eq(0).val(),
        $(`#update-body input`).eq(1).val(),
        $(`#update-body input`).eq(2).val(),
        $('.update-avatar').attr('src'),
        true
    )
    addPage(res);
    $("#update").slideUp(500)
});

$("#btn-create").click(function() {
    if (getIndexByID(+$(`#create input`).eq(0).val()) === -1 && $(`#create input`).eq(0).val() !== "") {
        creat(
            $(`#create input`).eq(0).val(),
            $(`#create input`).eq(1).val(),
            $(`#create input`).eq(2).val(),
            $(`#create input`).eq(3).val(),
            $('.create-avatar').attr('src'),
        )
        addPage(res);
        $("#create").slideUp(500)
    } else {
        erroForId()
    }
    $(`#create input`).eq(0).val("")
    $(`#create input`).eq(1).val("")
    $(`#create input`).eq(2).val("")
    $(`#create input`).eq(3).val("")
    $('.create-avatar').attr('src', "./assets/product3.jpeg")
});

function erroForId() {
    $(".alert").addClass("d-flex");
}

$("#close-alert").click(function() {
    $(".alert").slideUp(1000)
    $(".alert").removeClass("d-flex");
});

function getImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('.update-avatar').attr('src', e.target.result);
            $('.create-avatar').attr('src', e.target.result)
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#btn-open-create").click(function() {
    $('.create-avatar').attr('src', "./assets/product3.jpeg")
    $("#create").slideDown(1000);
})

function filterUsers(text) {
    let filter = res.filter(element => element.id === +text || element.first_name.includes(text) || element.last_name.includes(text) || element.email.includes(text))
    addPage(filter)
}

$("#search").click(function() {
    filterUsers($("#input-search").val())
});