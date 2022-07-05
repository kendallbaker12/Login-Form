const URL = "http://localhost:8080";

var app = new Vue({
    el: "#app",
    data: {
        page: "login",

        loginEmailInput: "",
        loginPasswordInput: "",

        newEmailInput: "",
        newPasswordInput: "",
        newFullnameInput: "",

        threads: [],
        currentThread: [],

        commentBody: "",
    },
    methods: {
        // change the page that the user sees
        setPage: function (page) {
            this.page = page;
        },

        // GET /session - Ask the server if we are logged in
        getSession: async function () {
            let response = await fetch(`${URL}/session`, {
                method: "GET",
                credentials: "include"
            });

            // Are we logged in?
            if (response.status == 200) {
                // logged in :)
                console.log("logged in");
                let data = await response.json();
                console.log(data);

                // send the user to the home page
                this.loadHomePage();
                return;

            } else if (response.status == 401) {
                // Not logged in :(
                console.log("Not logged in");
                let data = await response.json();
                console.log(data);

            } else {
                console.log("Some sort of error when GETTING /session:", response.status, response);
            }
        },
        // POST /session - Attempt to login
        postSession: async function () {
            let loginCredentials = {
                username: this.loginEmailInput,
                password: this.loginPasswordInput
            };

            let response = await fetch(URL + "/session", {
                method: "POST",
                body: JSON.stringify(loginCredentials),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            // 1. parse response body
            let body;
            try {
                body = response.json();
                // console.log(body);
            } catch (error) {
                console.log("Response body was not json.")
            }

            // 2. check - was the login successful?
            if (response.status == 201) {
                // successful login

                // clear inputs
                this.loginEmailInput = "";
                this.loginPasswordInput = "";

                // take the user to the home page
                this.loadHomePage();

            } else if (response.status == 401) {
                // unsuccessful login

                // let the user know it was unsuccessful
                alert("Unsuccessful login");

                // clear password input
                this.loginPasswordInput = "";
            } else {
                console.log("Some sort of error when POSTING /session:", response.status, response);
            }
        },
        // POST /user - create new user
        postUser: async function () {
            let newUser = {
                username: this.newEmailInput,
                fullname: this.newFullnameInput,
                password: this.newPasswordInput
            }

            let response = await fetch(URL + "/users", {
                method: "POST",
                body: JSON.stringify(newUser),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            // parse the response body
            let body;
            try {
                body = response.json();
            } catch (error) {
                console.error("Error parsing body as JSON:", error);
                body = "An Unknown Error has occured";
            }

            if (response.status == 201) {
                // user successfully created
                this.newEmailInput = "";
                this.newFullnameInput = "";
                this.newPasswordInput = "";

                // send them back to the login page
                this.setPage('login');
            } else {
                // error creating user
                this.newPasswordInput = "";

                // create notification

            }
        },
        loadHomePage: async function () {
            await this.getThread();
            this.setPage('home');
        },
        getThread: async function () {
            let response = await fetch(URL + "/thread", {
                credentials: "include"
            });

            // check response status
            if (response.status == 200) {
                // successfully got the data
                let body = await response.json();
                this.threads = body;
            } else {
                console.error("Error fetching threads:", response.status);
            }
        },
        loadThreadPage: async function () {
            this.setPage("thread");
        },
        getSingleThread: async function (id) {
            let response = await fetch(URL + "/thread/" + id, {
                credentials: "include"
            });

            // check response status
            if (response.status == 200) {
                this.currentThread = await response.json();
                this.loadThreadPage();
            } else {
                console.error("Error fetching individual request with id", id, "- status:", response.status);
            }
        },
        postComment: async function (id) {
            let newPost = {
                body: this.commentBody,
                thread_id: id
            }
            let response = await fetch(URL + "/post", {
                method: "POST",
                body: JSON.stringify(newPost),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (response.status == 201) {
                console.log("comment succesful");
                this.getSingleThread(id);
                this.commentBody = "";
            } else {
                console.log("something went wrong, here is the status code:", response.status)
            }
        }
    },
    created: function () {
        this.getSession();
    }
})