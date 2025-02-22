import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '../config/Api';

function renderCallback() {
    console.log("renderCallback not assigned in LoginManager.js, signin signout won't rerender.");
};

export async function getAuthHeader() {
    return { headers: { "secrettoken": await getToken() } };
}

export function setRenderCallback(cb) {
    renderCallback = cb;
}

export async function getToken() {
    return await AsyncStorage.getItem('secrettoken');
}

export async function login(username, password) {
    try {
        // Working around url encode form because react native doesn't support it
        var details = {
            'email': username,
            'password': password
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        var response = await fetch(API_URL + 'user/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody
            }
        );

        if (response.status != 200) {
            alert('Login failed, please try again.');
            return false;
        }

        const data = await response.json();
        await AsyncStorage.setItem('secrettoken', data.token);
        renderCallback(await getToken());
    } catch (error) {
        console.error(error);
    }
}

export async function signup(username, password, confirm) {
    if (password != confirm || username === "" || password === "") {
        alert("Passwords do not match, or fields are empty.");
        return false;
    }

    if (!validatePassword(password)) {
        // Define the error messages
        const errors = [
            "Password must fulfill these requirements:",
            "Must be at least 8 characters long",
            "Must contain at least one uppercase letter",
            "Must contain at least one lowercase letter",
            "Must contain at least one number",
            "Must contain at least one special character ($,%,&,*,@,!)"
        ];

        // Build the error message string
        const errorMessage = errors.join("\n");

        // Show the error message in a popup
        alert(errorMessage);
        return false;
    }

    var details = {
        'email': username,
        'password': password
    };

    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    var response = await fetch(API_URL + 'user/auth/signup',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody
        }
    );
}

export async function logout() {
    console.log("Logging out");
    await AsyncStorage.clear();
    renderCallback(await getToken());
}

export function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$,%,&,*,@,!])[A-Za-z\d$,%,&,*,@,!]{8,}$/;
    return regex.test(password);
}
