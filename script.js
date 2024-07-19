document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('showPassword');
    const evaluateButton = document.getElementById('evaluateButton');
    const characterCountSpan = document.getElementById('characterCount');
    const passwordStatus = document.getElementById('passwordStatus');
    const criteriaSpans = {
        lowercase: document.getElementById('lowercase'),
        uppercase: document.getElementById('uppercase'),
        numbers: document.getElementById('numbers'),
        symbols: document.getElementById('symbols')
    };
    const crackTime = document.getElementById('crackTime');
    const review = document.getElementById('review');

    showPasswordCheckbox.addEventListener('change', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
    });

    evaluateButton.addEventListener('click', function() {
        const password = passwordInput.value;
        const { strengthLabel, feedback, crackTimeResult } = checkPasswordStrength(password);
        displayPasswordStrength(strengthLabel, feedback, crackTimeResult, password.length);
        highlightCriteria(password);
    });

    function displayPasswordStrength(strengthLabel, feedback, crackTimeResult, length) {
        passwordStatus.textContent = strengthLabel;
        crackTime.textContent = crackTimeResult;
        review.innerHTML = feedback.join('<br>');
        characterCountSpan.textContent = length;
    }

    function highlightCriteria(password) {
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        criteriaSpans.lowercase.classList.toggle('highlight', hasLowercase);
        criteriaSpans.uppercase.classList.toggle('highlight', hasUppercase);
        criteriaSpans.numbers.classList.toggle('highlight', hasNumbers);
        criteriaSpans.symbols.classList.toggle('highlight', hasSymbols);
    }

    function checkPasswordStrength(password) {
        const min_length = 8;
        const max_length = 64;
        let complexity_score = 0;
        const feedback = [];
        let crackTimeResult = "0 second";

        if (password.length < min_length) {
            feedback.push(`Password should be at least ${min_length} characters long.`);
        } else if (password.length > max_length) {
            feedback.push(`Password should not exceed ${max_length} characters.`);
        } else {
            feedback.push("Password length is good.");
        }

        const has_upper = /[A-Z]/.test(password);
        const has_lower = /[a-z]/.test(password);
        const has_digit = /\d/.test(password);
        const has_special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!has_upper) {
            feedback.push("Password should contain at least one uppercase letter.");
        }
        if (!has_lower) {
            feedback.push("Password should contain at least one lowercase letter.");
        }
        if (!has_digit) {
            feedback.push("Password should contain at least one digit.");
        }
        if (!has_special) {
            feedback.push("Password should contain at least one special character.");
        }

        complexity_score = [has_upper, has_lower, has_digit, has_special].filter(Boolean).length;

        if (complexity_score < 4) {
            feedback.push("Add more complexity (uppercase, lowercase, digits, special characters).");
        } else if (complexity_score === 4) {
            feedback.push("Good mix of characters.");
        }

        const common_passwords = ["password", "123456", "qwerty", "abc123", "letmein"];
        if (common_passwords.includes(password.toLowerCase())) {
            feedback.push("Avoid common passwords.");
        }

        if (/(123|abc|qwerty|password|letmein)/i.test(password)) {
            feedback.push("Avoid sequences or repeated characters.");
        }

        const strengthLabel = determineStrengthLabel(password.length, complexity_score);
        crackTimeResult = estimateCrackTime(password.length, complexity_score);

        return { strengthLabel, feedback, crackTimeResult };
    }

    function determineStrengthLabel(length, complexity) {
        if (length >= 16 && complexity === 4) {
            return "Extremely Strong";
        } else if (length >= 12 && complexity === 4) {
            return "Very Strong";
        } else if (length >= 10 && complexity >= 3) {
            return "Strong";
        } else if (length >= 8 && complexity >= 2) {
            return "Moderate";
        } else if (length >= 8 && complexity >= 1) {
            return "Fair";
        } else {
            return "Weak";
        }
    }

    function estimateCrackTime(length, complexity) {
        if (length >= 16 && complexity === 4) {
            return "100+ years";
        } else if (length >= 12 && complexity === 4) {
            return "50+ years";
        } else if (length >= 10 && complexity >= 3) {
            return "10 years";
        } else if (length >= 8 && complexity >= 2) {
            return "2 years";
        } else if (length >= 8 && complexity >= 1) {
            return "1 year";
        } else {
            return "0 second";
        }
    }
});
