function Validation(values) {
    let error = {}
    const username_pattern = /^[A-Za-z][A-Za-z0-9]{4,19}$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

    if (values.username === "") {
        error.username = "Username should not be empty";
    }
    else if (!username_pattern.test(values.username)) {
        error.username = "ID는 알파벳으로 시작하며, 최소 5글자 이상이어야 합니다.";
    } else {
        error.username = "";
    }

    if (values.password === "") {
        error.password = "Password should not be empty";
    }
    else if (!password_pattern.test(values.password)) {
        error.password = "비밀번호는 적어도 1개의 대문자, 소문자, 그리고 숫자를 포함한 8글자 이상이어야 합니다.";
    } else {
        error.password = "";
    }

    if (values.password !== values.confirmPassword) {
        error.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    return error;
}

export default Validation;