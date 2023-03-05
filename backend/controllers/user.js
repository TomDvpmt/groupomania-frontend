exports.signUp = (req, res, next) => {
    const userInput = req.body;
    console.log("=======userInput (signup) : === ", userInput);

    // check in DB if email already exists

    const mockEmailAlreadyExists = true;
    return mockEmailAlreadyExists ? res.status(400).json() : res.status(201).json()

};

exports.login = (req, res, next) => {
    const userInput = req.body;
    console.log("=======userInput (login) : === ", userInput);
    
    // check credentials in DB
    
    const mockCredentialsCheck = false;
    return mockCredentialsCheck ? res.status(200).json() : res.status(401).json()
};