const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');

$.get(`https://reqres.in/api/users/${myParam}`,
    function(data) {
        console.log(data.data);
        $(".container").append(`<div class="card mb-3 mt-5 ml-auto mr-auto" style="max-width: 800px;">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${data.data.avatar}" alt="avatar" style="height: 15em;">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">id : ${data.data.id}</h5>
                    <p class="card-text">First name : ${data.data.first_name}<span></span></p>
                    <p class="card-text">Last name : ${data.data.last_name}<span></span></p>
                    <p class="card-text">email : ${data.data.email}<span></span></p>
                    <p class="card-text"><small class="text-muted">last seen</small></p>
                </div>
            </div>
        </div>
    </div>`);
    }
);