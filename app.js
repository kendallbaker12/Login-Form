const URL = "https://forum2022.codeschool.cloud";


var app = new Vue({
    el: "#app",
    data: {
        //login data
        loginEmailInput: "",
        loginPasswordInput: "",
        // registration data
        newEmailInput: "",
        newPasswordInput: "",
        newFullNameInput: "",
        //
        page: "home",
        message: "congrats on getting pages setup."
    },
    methods: {
        getSession: async function () {
            let response = await fetch(`${URL}/session`, {
                method: "GET",
                credentials: "include",

            });
            if (response.status == 200) {
                console.log("logged in");
                let data = await response.json();
                console.log(data);
                this.page = "first-page"
            } else if (response.status == 401) {
                console.log("not logged in");
                let data = await response.json();
                console.log(data);
            } else {
                console.log("some sort of error when using get", response.status, response)
            }

        },
        postSession: async function () {
            let loginCredentials = { username: this.loginEmailInput, password: this.loginPasswordInput };
            let response = await fetch(`${URL}/session`, {
                method: "POST",
                body: JSON.stringify(loginCredentials),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",

            });
            console.log(response);


        },
        postUser: async function () {
            let loginCredentials = { username: this.newEmailInput, fullname: this.newFullNameInput, password: this.newPasswordInput };
            let response = await fetch(`${URL}/user`, {
                method: "POST",
                body: JSON.stringify(loginCredentials),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (response.status == 201) {
                console.log("new user Created!")
            }
        }
    },
    created: function () {
        this.getSession();
    }
})